NOTE:

- yarn ios fails unless you add to package.json:

```
"installConfig": {
    "hoistingLimits": "dependencies"
  },
```

- but metro fails to build js unless you remove this (and make sure `config.resolver.nodeModulesPaths` is set to monorepo root in metro.config).
