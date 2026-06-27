/*
 * Builds the editor with embedded player as a single HTML file.
 * This script:
 * 1. Builds the player and packs it into a single HTML file.
 * 2. Encodes the player HTML as base64.
 * 3. Updates the editor's environment.prod.ts with the base64.
 * 4. Builds the editor and packs it.
 * 5. Restores the original environment.prod.ts.
 *
 * Usage: node projects/tools/build-editor-bundled.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "../..");
const playerDistDir = path.join(rootDir, "dist/stars-player/browser");
const playerPackedFile = path.join(playerDistDir, "index_packed.html");
const editorEnvProdFile = path.join(
  rootDir,
  "projects/editor/src/environments/environment.prod.ts",
);
const editorEnvProdBackup = editorEnvProdFile + ".bak";

function log(message) {
  console.log(`[build-editor-bundled] ${message}`);
}

// Step 1: Always build the player so the embedded preview cannot use a stale artifact.
log("Building player...");
try {
  execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
} catch (error) {
  console.error("Failed to build player:", error);
  process.exit(1);
}

// Step 2: Check if packed player exists
if (!fs.existsSync(playerPackedFile)) {
  console.error(`Player packed file not found at ${playerPackedFile}`);
  process.exit(1);
}

// Step 3: Read player HTML, fix base href, and create base64
log("Reading player HTML...");
let playerHtml = fs.readFileSync(playerPackedFile, "utf8");

// Replace the dynamic base href script with a static one
// The dynamic script uses document.location which breaks in srcdoc/blob contexts
// The script looks like: <script>document.write('<base href="' + document.location + '" />');</script>
playerHtml = playerHtml.replace(
  /<script>document\.write\('<base href="' \+ document\.location \+ '" \/>'\);<\/script>/,
  '<base href="./">',
);

// Also handle any line-based matches as fallback
const lines = playerHtml.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("document.write") && lines[i].includes("base href")) {
    lines[i] = '    <base href="./">';
  }
}
playerHtml = lines.join("\n");

const playerBase64 = Buffer.from(playerHtml).toString("base64");
log(`Player base64 length: ${playerBase64.length}`);

// Step 4: Backup original environment.prod.ts
log("Backing up environment.prod.ts...");
fs.copyFileSync(editorEnvProdFile, editorEnvProdBackup);

// Step 5: Write new environment.prod.ts with embedded player HTML as base64
log("Creating environment.prod.ts with embedded player HTML...");
const newEnvContent = `export const environment = {
  production: true,
  playerUrl: 'http://localhost:4200',
  playerHtmlBase64: '${playerBase64}'
};
`;
fs.writeFileSync(editorEnvProdFile, newEnvContent, "utf8");

// Verify written content
const writtenContent = fs.readFileSync(editorEnvProdFile, "utf8");
const match = writtenContent.match(/playerHtmlBase64: '([^']*)'/);
if (match) {
  log(`Written playerHtmlBase64 length: ${match[1].length}`);
} else {
  log("ERROR: playerHtmlBase64 not found in written environment.prod.ts");
}

// Step 6: Build editor (this also triggers postbuild:editor which packs the editor)
log("Building editor...");
try {
  execSync("npm run build:editor", { cwd: rootDir, stdio: "inherit" });
} catch (error) {
  console.error("Failed to build editor:", error);
  // Restore backup before exiting
  fs.copyFileSync(editorEnvProdBackup, editorEnvProdFile);
  fs.unlinkSync(editorEnvProdBackup);
  process.exit(1);
}

// Step 7: Restore original environment.prod.ts
log("Restoring environment.prod.ts...");
fs.copyFileSync(editorEnvProdBackup, editorEnvProdFile);
fs.unlinkSync(editorEnvProdBackup);

log(
  "Done. Editor bundled with embedded player at dist/stars-editor/browser/index_packed.html",
);
