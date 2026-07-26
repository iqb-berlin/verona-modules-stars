[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-modules-stars?style=flat-square)

# IQB STARS Modules

Version: 0.7.0

This repository contains the STARS Verona player and the STARS editor. Both applications are Angular applications and can be developed separately or together. The build tools can also package each application into a single HTML file for Verona delivery.

For more information about STARS tasks, see the [documentation](https://iqb-berlin.github.io/tba-info/tasks/design/stars/).

## Prerequisites

This project requires **Node.js 24.15.0 or newer** (Angular 22 also supports Node 22.22.3+ or 26+).
If you use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), run `nvm use` or `fnm use` in the project root; the required version is defined in `.nvmrc`.

## Project Structure

```text
projects/
  player/  STARS Verona player
  editor/  STARS editor with JSON and live preview
  shared/  Shared unit definition, response and Verona models
  tools/   Single-file HTML packaging and bundled editor tooling
```

## Development

Install the locked dependencies after cloning the repository:

```sh
npm ci
```

Use `npm install` only when intentionally updating dependencies and the lockfile.

Start the player:

```sh
npm run start:player
```

The player runs at `http://localhost:4200/`. When started without a Verona host, it shows a helper menu for loading unit definitions. Example unit definitions can be found in `projects/player/test/unitdata`.

Start the editor:

```sh
npm run start:editor
```

The editor runs at `http://localhost:4201/`.

Start player and editor together:

```sh
npm run start:all
```

## Live Preview

The editor contains a live preview that starts the STARS player inside an iframe and sends the current unit definition through the Verona player API.

In development, the preview uses `environment.playerUrl`, which points to the local player by default. You can override the player URL from the browser address bar:

```text
http://localhost:4201/?playerUrl=http://localhost:4200
```

For local development, use `npm run start:all` so that the editor and its embedded
player preview are started together. A player opened separately in another tab is
independent and is not synchronized with the editor.

The bundled editor build embeds the packed player HTML as base64. This allows `dist/stars-editor/browser/index_packed.html` to run the live preview without a separate player server.

## Build

Build the player:

```sh
npm run build
```

This creates the production player build in `dist/stars-player/browser/` and runs the postbuild packer. The packed player is written to:

```text
dist/stars-player/browser/index_packed.html
```

Build the editor:

```sh
npm run build:editor
```

This creates the production editor build in `dist/stars-editor/browser/` and runs the editor postbuild packer. The packed editor is written to:

```text
dist/stars-editor/browser/index_packed.html
```

Build the editor with an embedded player:

```sh
npm run build:editor-bundled
```

This command always rebuilds the player first, packs it, embeds it into the editor production environment, builds the editor, packs the editor, and then restores the original editor environment file.

## Checks

Validate example unit definitions:

```sh
npm run validate-data
```

Run the editor architecture regression checks:

```sh
npm run test:editor-architecture
```

These checks cover editor definition import, definition export and Verona variable metadata generation.

Run the Cypress end-to-end workflow:

```sh
npm test
```

Useful build checks before release or review:

```sh
npm run build:editor
npm run build:editor-bundled
```

## Editor Architecture

The editor keeps UI state in `EditorStateService` using Angular signals. Components update state through service methods instead of writing to signals directly.

Definition handling is split into small services:

- `EditorDefinitionBuilderService` builds a `UnitDefinition` from the editor state snapshot.
- `EditorDefinitionLoaderService` parses and normalizes imported unit definitions.
- `EditorVariableMetadataBuilderService` builds Verona variable metadata.
- `EditorInteractionAdapterRegistry` provides defaults, normalization and variable metadata behavior per interaction type.

The editor's Verona host communication is handled by `EditorVeronaSubscriptionService` and `EditorVeronaPostService`. Incoming `voeStartCommand` messages are accepted from the parent frame, and outgoing definition changes are sent back with the current session context.

## Release

For a player release, use:

```text
dist/stars-player/browser/index_packed.html
```

Rename the file to `iqb-player-stars-<version>.html` and attach it to the release.

For an editor release, use:

```text
dist/stars-editor/browser/index_packed.html
```

When the editor should include live preview without a separate player server, build it with:

```sh
npm run build:editor-bundled
```
