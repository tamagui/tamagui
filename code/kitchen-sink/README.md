NOTE:

This app is a test harness, not a product, so its bundle size is not gated.
Adding usecases grows it and that is fine. Client bundle size is measured where
it means something: `code/starters/zero-runtime` builds a contract-compliant app
six ways and gates the gzip of each against `size-baseline.json`.

- yarn ios fails unless you add to package.json:

```
"installConfig": {
    "hoistingLimits": "dependencies"
  },
```

- but metro fails to build js unless you remove this (and make sure `config.resolver.nodeModulesPaths` is set to monorepo root in metro.config).
