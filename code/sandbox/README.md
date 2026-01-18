# One Project

Welcome to One!

## Developing

Run your One app in development:

```bash
bun run dev
```

## Production

To build your app for production:

### Web

```bash
bun run build:web
```

### iOS

First, you'll need to generate the native code for your app:

```bash
bun run prebuild:native
```

Afterward, follow the instructions printed in the terminal to build and upload your iOS app for distribution.
