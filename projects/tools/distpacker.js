/*
This script packs the source files of a web project (html, js and css) into
one self contained html file. It includes the source code of all referenced
files and generates base64 representations for all images, which are included.

Usage:
node distpacker.js <directory containing html and source files> <target_filename>

Author:
- Andreas Fleck
- Richard Henck (richard.henck@iqb.hu-berlin.de)

possible improvements:
- ignore comments when matching regex
*/

const fs = require('fs');

const existsSync = fs.existsSync;
const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;

const folderseperator = '/';
const debug = true;

const args = process.argv.slice(2);
if (args.length <= 0) {
  console.log('Not enough arguments! Pass source folder and optionally target file name!');
  process.exit(1);
}

let folder = args[0];
let targetFilename;
let subfolder;
(args.length > 1) ? targetFilename = args[1] : targetFilename = 'index_packed.html';
(args.length > 2) ? subfolder = args[2] : subfolder = '';

function logDebug(str) {
  if (debug) {
    console.log(str);
  }
}

function base64Encode(file) {
  return readFileSync(file, 'base64');
}

function getExtension(filename) {
  const i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i + 1);
}

function getFolderPath(filePath) {
  return filePath.substring(0, filePath.lastIndexOf('/'));
}

/** replace img with base64 in css url */
function replaceUrlInCss(jsString, cssPath) {
  const regexUrl = /\burl\([^)]+\)/gi; // rebuild regex
  return jsString.replace(regexUrl, a => {
    console.log('Replacing URL: ', a);
    // List of illegal file chars: ~ “ # % & * : < > ? / \ { | }
    // : / \ are path delimiters
    // If one of the other characters is found, a must be a variable and must not be replaced.
    if (a.search(/[~|"|#|%|*|<|>|?|{|}||]/) > -1) {
      return a;
    }
    const regexFile = /\((.*?)\)/ig;
    const src = regexFile.exec(a)[1].replace(/\'/gi, '').replace(/\"/gi, '').replace('./', '');
    const ext = getExtension(src);
    const file = `${folder}${getFolderPath(cssPath)}/${src}`;
    if (existsSync(file)) {
      const base64Str = base64Encode(file);
      return `url(data:image/${ext};base64,${base64Str})`; // ATTENTION with " & '
    }
    logDebug(`file ${file} not found. Skipping replacement.`);
    return a;
  });
}

/** replace img with base64 in img-tags with src-attribute */
function replaceLinkedAssetsInJS(jsString) {
  // RH: old variant. Prefixes "asstes" with "./". Dont know why.
  // const regexAssets = /['|"]\.\/assets(.*?)['|"]/gi;
  const regexAssets = /['|"]assets\/(.*?)['|"]/gi; // replace assets only if followed by a slash (s. GeoGebra-Bug)
  return jsString.replace(regexAssets, (a, b) => {
    logDebug(`Replacing linked assets in JS: ${a}`);

    const firstSign = a[0];
    const src = a.replace(/\'/gi, '').replace(/\"/gi, '').replace('./', '');
    const ext = getExtension(b);

    try {
      const file = folder + subfolder + src;
      if (existsSync(file)) {
        const base64Str = base64Encode(file);
        if (firstSign === '"') {
          return '"data:image/' + ext + ';base64,' + base64Str + '"'; // ATTENTION with " & '
        }
        return "'data:image/" + ext + ";base64," + base64Str + "'"; // ATTENTION with " & '
      }
      return a;
    } catch (e) {
      logDebug('error in replaceLinkedAssetsInJS');
      logDebug(e);
      return a;
    }
  });
}

function replaceFavicon(htmlString) {
  const regexCss = /<link.*href="(.*?.ico)".*?>/gi;
  return htmlString.replace(regexCss, (a, b) => {
    const file = folder + b;
    logDebug(`Replacing favicon: ${file}`);
    const base64Str = base64Encode(file);
    return `<link type="image/x-icon" href="data:image/x-icon;base64,${base64Str}" />`;
  });
}

/** replace existing link-tags with manipulated style-tags */
function replaceCSSLinks(htmlString) {
  const regexCss = /<link.*href="(.*?.css)".*?>/gi;
  return htmlString.replace(regexCss, (searchString, foundPath) => {
    let cssString = readFileSync(folder + foundPath, 'utf8').toString();
    logDebug(`Replacing CSS: ${searchString} - path found: ${foundPath}`);
    cssString = replaceUrlInCss(cssString, foundPath);
    return `<style>${cssString}</style>`;
  });
}

/** replace existing script-tags (linked) with manipulated script-tags (embedded) */
function replaceScriptTags(htmlString) {
  // RH: Changed regex to exclude script content without src attribute, i.e. real code
  // const regexJS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gim;
  const regexJS = /<script\s+.*?<\/script>/gim;
  return htmlString.replace(regexJS, (a, b) => {
    console.log('Replacing Script Tag: ', a);
    const regexSRC = /src="(.*?)"/ig; // Attention, global declaration is wrong, because of pointer
    const filename = regexSRC.exec(a)[1];
    let fileContent = readFileSync(folder + filename, 'utf8').toString();
    // fileContent = replaceUrlInCss(fileContent); // first because works with url-pattern
    fileContent = replaceLinkedAssetsInJS(fileContent);
    return "<script type='text/javascript'>" + fileContent + "\n" + "</script>";
  });
}

// /** Replace the base tag <base href="/"> with a dynmaic value based on the
// location of the document */
function replaceBaseHREF(htmlString) {
  const regexJS = /<base href="\/">/gim;
  return htmlString.replace(regexJS, (a, b) => {
    console.log('Replacing Base Href: ', a);
    return "<script>document.write('<base href=\"' + document.location + '\" />');</script>";
  });
}

if (!folder.endsWith(folderseperator)) {
  folder += folderseperator;
}

if (subfolder !== '' && !subfolder.endsWith(folderseperator)) {
  subfolder += folderseperator;
}

console.log(`Running iqb-distpacker in folder: ${folder}`);

let htmlString = readFileSync(`${folder}index.html`, 'utf8').toString();

htmlString = replaceFavicon(htmlString);
htmlString = replaceCSSLinks(htmlString);
htmlString = replaceScriptTags(htmlString);

htmlString = replaceBaseHREF(htmlString);

// write new index.html
writeFileSync(`${folder}${targetFilename}`, htmlString, 'utf8');
console.log(`finished, wrote packed ${targetFilename} to: ${folder}`);
