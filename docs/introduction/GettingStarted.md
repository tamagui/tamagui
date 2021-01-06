---
id: getting-started
title: Getting Started
description: 'Introduction > Getting Started'
hide_title: true
---

# Get started

SnackUI is a UI kit for react native and react native web that builds on the ideas of [JSXStyle](https://github.com/jsxstyle/jsxstyle) and SwiftUI.

## Installation

Add snackui to your project:

```bash
yarn add snackui @snackui/static @snackui/babel-plugin
```

You'll likely want to gitignore the outputted style files, though it's not necessary. We originally kept CSS in-memory, but ran into various issues, but would support re-implementing it if anyone knows a cleaner way. In your `.gitignore` add this:

```
*__snack.css
```

### Babel - Native / Simple extraction (experimental)

This is useful for Native apps or if you're not using Webpack.

For a simpler setup you can just add `@snackui/babel-plugin` as a babel plugin to your babel config to get extraction just to StyleSheet.create(). This isn't as performant as going to CSS, but works with anything that supports babel.

You can technically just use the babel plugin, but if you want much better flattening and CSS extraction, read on.

### Webpack - CSS extraction

To extract to CSS, SnackUI supports Webpack for now (v4 and v5). Add the loader to your webpack config after `babel-loader`. Note, **don't use the babel plugin if you are doing this**, you only need the loader for Webpack.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: require.resolve('@snackui/static/loader'),
            options: {
              // use this to add files to be statically evaluated
              // default:
              evaluateImportsWhitelist: ['constants.js', 'colors.js'],
              // exclude files from processing
              // default null
              exclude: /node_modules/,
              // attempts to statically follow variables to compile
              // default true
              evaluateVars: true

            },
          },
        ].filter(Boolean),
      },
    ],
  },
}
```

#### Caveat

react-native-web is currently taking a hard stance against supporting className and removed support for it in v0.14. We've opened an issue, but received pushback. We are going to try and work with them to see if there's a way they can enable a workaround now that we've published SnackUI. You'll have to use `patch-package` to restore className support for now.

- Example [patch for react-native-web experimental](docs/react-native-web+0.0.0-466063b7e.patch) (includes a extra patch for faster Text styles)
