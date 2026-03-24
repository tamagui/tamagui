## @tamagui/build

A small, opinionated build script for libraries that target both React Native and React web.

Path-specific extensions are the only way to support both ESM and CJS properly in modern Node and across all bundlers. Some bundlers used to be flexible and configure this for you, but we found this was the only way to achieve "no config" packages that target native and web. This is even more true as React Native is now supporting package.json exports with an experimental flag.

We wanted to build packages so we didn't have to deal with all this fuss. `@tamagui/build` will build every input file out to both `.native` and `.web` output files to make this work. It then adds path-specific imports to the files that are reachable via package.json exports, but leaves plain `.js` files for older bundlers that don't support it (Metro without the experimental exports flag). It also does a few small re-writes to ensure everyting works without needing bundler configuration. This means it supports basically every possible setup - Metro in either mode, Vite, and older and newer Node versions.

Some details on how it works:

- uses tsc to output declaration files to `./types`
- esbuild to output `dist/esm` and `dist/cjs` for ESModules and CommonJS
- outputs `.js` and `.mjs` files in `dist/esm`
  - in `.mjs`, adds path-specific imports to non-specific imports
- outputs both `.js` and `.cjs` files in `dist/cjs`:
  - in `.cjs`, adds path-specific imports to non-specific imports
- strips bare imports that esbuild leaves behind, respecting the `sideEffects` field in package.json
- outputs `.native.js` and regular `.js` files for all output files, so React Native always loads separate files from web. In the `native` specific files,
  - swc is sued to transform to es5
  - `process.env.TAMAGUI_TARGET` is defined `native` (otherwise `web`)
- on non-native files:
  - on web, imports of `react-native` are transformed to `react-native-web`

It assumes your package.json looks something like this:

```
{
  "source": "src/index.tsx",
  "types": "./types/index.d.ts",
  "main": "dist/cjs",
  "module": "dist/esm",
  "type": "module",
  "scripts": {
    "build": "tamagui-build",
    "watch": "tamagui-build --watch",
    "clean": "tamagui-build clean"
  },
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "react-native": {
        "import": "./dist/esm/index.native.js",
        "require": "./dist/cjs/index.native.js"
      },
      "types": "./types/index.d.ts",
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.cjs",
      "default": "./dist/cjs/index.native.js"
    }
  },
  "devDependencies": {
    "@tamagui/build": "latest"
  },
  "tamagui": {
    "build": {
      "skipEnvToMeta": true,
      "bundle.native": "./src/index.ts",
      "bundle.native.test": "./src/index.ts"
    }
  },
}
```

### Install

`npx @tamagui/build` or install and use the CLI:

### Use

- `tamagui-build` - builds `src` folder to `dist` and `types` folders
  - normal builds clear `dist` and `types` first, so stale transformed files don't hang around
  - intermediary `.js` files are removed after `.mjs` / `.cjs` postprocessing, so published output stays lean
  - `tamagui build .` second argument sets baseUrl to tsc
  - `--bundle-modules` - inline node_modules
  - `--declaration-root` - sets tsc flag `--declarationDir ./`
  - `--ignore-base-url` - if not set, tsc is passed `--baseUrl .`
  - `--skip-mjs` - don't output mjs files
  - `--skip-native` - don't output native files
  - `--skip-sourcemaps` - don't output js or declaration sourcemaps
  - `--swap-exports` - swaps `exports.types` from `./src/*.ts` to `./types/*.d.ts` for publishing. if a command is given after `--`, runs it then swaps back. exit code is preserved.
    - `tamagui-build --swap-exports` - build and swap, stays swapped (for manual publish)
    - `tamagui-build --swap-exports -- npm publish` - build, swap, publish, swap back
- `tamagui-build --watch` - watches for changes and does the above
- `tamagui-build clean` - cleans dist, types, node_modules folders
