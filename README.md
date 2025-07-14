[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-player-abi?style=flat-square)

# IQB Stars Player
version: 0.1.5-beta

## Development

This player is an Angular web application. After cloning this repository, you need to download all components this application depends on: 

```
npm install
```

After install of all required components, `ng serve` will start the player. You get a simple helper menu to load unit definitions.

### Build Stars Player Html File
The Verona Interface Specification requires all programming to be built in one single html file. All styles and images need to be packed in one file.
```
npm run build
```
This way, the Angular application is built into the folder `dist` and then packed into the file `docs/index.html`. This way, one can try out the player via GitHub pages. The helper menu will show up when the player is started without host.

### Release

Please copy the `docs/index.html` file locally, rename it to `stars-player-<version>.html` 
and load it as artefact into the release.
