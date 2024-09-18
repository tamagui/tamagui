## @tamagui/build

A small, opinionated build script for libraries that target both React Native and React web.

It has a few features that make it useful for "universal" libraries:

- uses tsc to output declaration files to `./types`
- esbuild to output `dist/esm` and `dist/cjs` for ESModules and CommonJS
- outputs `.js` and `.mjs` files in `dist/esm`
  - in `.mjs`, adds path-specific imports to non-specific imports
- removes hanging imports that esbuild leaves (see `pkgRemoveSideEffects`)
- outputs `.native.js` and regular `.js` files for all output files, so React Native always loads separate files from web. In the `native` specific files,
  - swc is sued to transform to es5
  - `process.env.TAMAGUI_TARGET` is defined `native` (otherwise `web`)
- on non-native files:
  - imports of `react-native` are transformed to `react-native-web`

It assumes your package.json looks something like this:

```
{
  "source": "src/index.tsx",
  "types": "./types/index.d.ts",
  "main": "dist/cjs",
  "module": "dist/esm",
  "removeSideEffects": "true",
  "scripts": {
    "build": "tamagui-build",
    "watch": "tamagui-build --watch",
    "clean": "tamagui-build clean"
  },
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "react-native-import": "./dist/esm/index.native.js",
      "react-native": "./dist/cjs/index.native.js",
      "types": "./types/index.d.ts",
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.js"
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
  - `tamagui build .` second argument sets baseUrl to tsc
  - `--bundle-modules` - inline node_modules
  - `--declaration-root` - sets tsc flag `--declarationDir ./`
  - `--ignore-base-url` - if not set, tsc is passed `--baseUrl .`
  - `--skip-mjs` - don't output mjs files
- `tamagui-build --watch` - watches for changes and does the above
- `tamagui-build clean` - cleans dist, types, node_modules folders

