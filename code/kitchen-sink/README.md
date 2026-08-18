NOTE:

The v3 bundle CI gate compares the production JS and CSS sizes with
`bundle-size-baseline.json`. For an intentional size change, run
`bun run bundle:update-baseline` and commit the baseline diff.

- yarn ios fails unless you add to package.json:

```
"installConfig": {
    "hoistingLimits": "dependencies"
  },
```

- but metro fails to build js unless you remove this (and make sure `config.resolver.nodeModulesPaths` is set to monorepo root in metro.config).
