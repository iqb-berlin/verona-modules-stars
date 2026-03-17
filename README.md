[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-modules-stars?style=flat-square)

# IQB Stars Player
version: 0.6.30

## Development

This player is an Angular web application. After cloning this repository, you need to download all components this application depends on:

```
npm install
```

After install of all required components, `ng serve` will start the player. You get a simple helper menu to load unit definitions. 
Example unit definitions can be found inside `projects/player/test/unitdata`

```
npm validate-data
```

If you add new unit definition examples, you should run this command to check if you have a valid json format.

```
npm test
```

You can run the end-to-end tests via this command.

### Build Stars Player Html File
The Verona Interface Specification requires all programming to be built in one single html file. All styles and images need to be packed in one file.

```
npm run build
```
This way, the Angular application is built into the folder `dist` .

```
npm run postbuild
```
Packs the application into the file `dist/stars-player/browser/index_packed.html`. This way, one can try out the player via GitHub pages. The helper menu will show up when the player is started without host.

### Release

Please copy the `dist/stars-player/browser/index_packed.html` file locally, rename it to `iqb-player-stars-<version>.html`
and load it as artefact into the release.

For more information about the Stars Player, see the [documentation](https://iqb-berlin.github.io/tba-info/tasks/design/stars/).
