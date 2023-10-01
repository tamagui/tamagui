# Get Started

::: warning
Please note, Vern is in early alpha. We'd love your contributions!
:::

Vern is a package that lets you serve your React Native apps using Vite. This is pretty cool as Vite typically doesn't seem like it would "play well" with React Native  - React Native only supports CommonJS, even for hot reloading, whereas Vite is all-in on ESModules.

Luckily, with some effort, we've put together a variety of plugins and configuration for Vite that make this work. We run a full `build` of your app on first request using Vite's internal Rollup, and make some modifications to the CJS it exports so that its well-suited for hot reloading as React Native expects.

Today it runs many simple apps well. We'd like to get the community involved to make Vern viable for any scale of React Native app.

## Install

```bash
npm i -d vern
```

For now Vern only works programatically as it must set up not only Vite, but also Fastify (which is mostly because it re-uses great work by [Callstack's Repack](https://www.callstack.com/open-source/re-pack) in order to set up the websockets for communicating the various things React Native expects).

Create a server:

```js
import { create } from 'vern'


```
