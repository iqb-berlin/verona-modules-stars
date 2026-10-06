[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-modules-stars?style=flat-square)

# IQB Stars Player
version: 0.7.2

## Prerequisites

This project requires **Node.js 24.15.0 or newer** (Angular 22 also supports Node 22.22.3+ or 26+).

Check your version:

```
node -v
```

If you use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), run `nvm use` or `fnm use` in the project root — the required version is defined in `.nvmrc`.

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

### E2E test coverage

```
npm run e2e-coverage
```

Runs the whole Cypress suite headless against an instrumented build of the player and writes an Istanbul coverage report. Open `coverage/e2e/index.html` in a browser to see the coverage of every file, down to the single line. A summary is also printed at the end of the run.

The script starts the instrumented player itself (`npm run serve-coverage`, on port 4200) and stops it afterwards, so make sure nothing else (e.g. `ng serve`) is running on that port. Arguments are passed on to `cypress run`, e.g. to measure a single spec:

```
npm run e2e-coverage -- --spec "cypress/e2e/interaction-write/**"
```

Coverage is switched off for all other e2e runs (`npm test`, `npm run e2e`, `npm run cy:open`): the plain dev server carries no coverage counters, so they would only produce an empty report.

The instrumented build uses Angular's webpack builder (`@angular-devkit/build-angular`, together with `@angular-builders/custom-webpack`), while the normal build uses `@angular/build`. `@angular-devkit/build-angular` is pinned to the exact version of `@angular/build` and has to be updated together with it whenever Angular is updated, e.g.:

```
npm install --save-dev --save-exact --legacy-peer-deps @angular-devkit/build-angular@<new version>
```

Otherwise npm installs a second `@angular/build` for the coverage build or fails to resolve the dependencies.

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
