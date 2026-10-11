# Tamagui with Next.js Turbopack

Turbopack cannot host Tamagui's graph-aware compiler or emit its virtual CSS.
This fixture uses the supported v3 path: the Tamagui CLI precompiles the source
tree, runs Next.js, then restores the source and generated CSS on exit.

```json
{
  "scripts": {
    "dev": "tamagui build --target web ./src -- next dev --turbopack",
    "build": "tamagui build --target web ./src -- next build"
  }
}
```

The generated CSS is imported as a normal file, so Turbopack does not need a
Tamagui loader or plugin. This fixture intentionally has no dependency on
`@tamagui/next-plugin`.
