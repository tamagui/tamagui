# `@tamagui/next-plugin`

This package is the legacy webpack compatibility adapter. It requires Next.js
to run with webpack and is not part of Tamagui's v3 compiler path.

For Next.js with Turbopack, use the restore-safe CLI precompile wrapper:

```json
{
  "scripts": {
    "dev": "tamagui build --target web ./src -- next dev --turbopack",
    "build": "tamagui build --target web ./src -- next build"
  }
}
```
