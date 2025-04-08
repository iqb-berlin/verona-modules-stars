/*
This script packs Javascript and CSS files found in the target directory
into one single file.

Usage:
node js_css_packer.js <directory containing files> <sub folder name> <target>

Author:
- Martin Mechtel (mechtel@iqb.hu-berlin.de)
- Richard Henck (richard.henck@iqb.hu-berlin.de)
*/
const fs = require('fs');

if (process.argv.length < 5) {
  console.log('Not enough parameters. ' +
    'Pass source folder, project name and target folder!\n' +
    'Example: node js_css_packer.js dist verona-editor-aspect dist');
  process.exit(1);
}

const sourceFolder = process.argv[2];
const projectName = process.argv[3];
const targetFolder = process.argv[4];

const targetFileNameJs = `${targetFolder}/${projectName}.js`;
const targetFileNameCss = `${targetFolder}/${projectName}.css`;

let fileContentJs = '';
let fileContentCss = '';

fs.readdirSync(`${sourceFolder}/${projectName}`).forEach(file => {
  const i = file.lastIndexOf('.');
  if (i > 0) {
    const fileExtension = file.substr(i + 1);
    if (fileExtension.toLowerCase() === 'css') {
      const fileContent = fs.readFileSync(`${sourceFolder}/${projectName}/${file}`, 'utf8').toString();
      console.log(`reading ${file}`);
      fileContentCss += fileContent;
    } else if (fileExtension.toLowerCase() === 'js') {
      const fileContent = fs.readFileSync(`${sourceFolder}/${projectName}/${file}`, 'utf8').toString();
      console.log(`reading ${file}`);
      fileContentJs += fileContent;
    }
  }
});

if (fileContentCss) {
  fs.writeFileSync(targetFileNameCss, fileContentCss, 'utf8');
  console.log(`writing ${targetFileNameCss}`);
}
if (fileContentJs) {
  fs.writeFileSync(targetFileNameJs, fileContentJs, 'utf8');
  console.log(`writing ${targetFileNameJs}`);
}
console.log('finished');
