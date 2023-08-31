# Prerequisite
First install the dependencies running `yarn install`, then make sure to build the package using `yarn build` and add the package as a dependency to the package/app you want to consume it from (could be the `app` or `ui` package) like so:
```
"dependencies": {
  "@tamagui-google-fonts/ibm-plex-mono": "*"
}
```
## Usage
### Expo
  
Add this to the root of your file:
    
```ts
import { useFonts } from 'expo-font'

export default function App() {
  const [loaded] = useFonts({
    IBMPlexMonoThin: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Thin.ttf'),
    IBMPlexMonoThinItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-ThinItalic.ttf'),
    IBMPlexMonoExtraLight: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-ExtraLight.ttf'),
    IBMPlexMonoExtraLightItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-ExtraLightItalic.ttf'),
    IBMPlexMonoLight: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Light.ttf'),
    IBMPlexMonoLightItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-LightItalic.ttf'),
    IBMPlexMono: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Regular.ttf'),
    IBMPlexMonoItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Italic.ttf'),
    IBMPlexMonoMedium: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Medium.ttf'),
    IBMPlexMonoMediumItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-MediumItalic.ttf'),
    IBMPlexMonoSemiBold: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-SemiBold.ttf'),
    IBMPlexMonoSemiBoldItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-SemiBoldItalic.ttf'),
    IBMPlexMonoBold: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-Bold.ttf'),
    IBMPlexMonoBoldItalic: require('@tamagui-google-fonts/ibm-plex-mono/fonts/IBMPlexMono-BoldItalic.ttf'),
  })
// ...
```

## Web

Get the font's script (`<link>` or `@import`) and add it to `<head>` from [here](https://fonts.google.com/specimen/IBM+Plex+Mono)


## Next.js Font (next/font/google)

Import the font from `next/font/google` and give it a variable name in your `_app.tsx` like so:

```ts
import { IbmPlexMono } from 'next/font/google' // the casing might differ

const font = IbmPlexMono({
  variable: '--my-font',
})
```

Add the variable style in `_app.tsx`:

```tsx
<div className={font.variable}>
  {*/ ...rest of your _app.tsx tree */}
</div>
```

Then go to the generated font package and update `family` with the variable.

So, change it from:
```ts
return createFont({
    family: isWeb
      ? '"IBM Plex Mono", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'IBM Plex Mono',
```

To:
```ts
return createFont({
    family: isWeb
      ? 'var(--my-font)", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'IBM Plex Mono',
```


## Usage in config

```ts
import { createIbmPlexMonoFont } from '@tamagui-google-fonts/ibm-plex-mono' 

export const myFont = createIbmPlexMonoFont(
  {
    face: {
    "100": {
        "normal": "IBMPlexMonoThin",
        "italic": "IBMPlexMonoItalic"
    },
    "200": {
        "normal": "IBMPlexMonoThinItalic",
        "italic": "IBMPlexMonoMedium"
    },
    "300": {
        "normal": "IBMPlexMonoExtraLight",
        "italic": "IBMPlexMonoMediumItalic"
    },
    "400": {
        "normal": "IBMPlexMonoExtraLightItalic",
        "italic": "IBMPlexMonoSemiBold"
    },
    "500": {
        "normal": "IBMPlexMonoLight",
        "italic": "IBMPlexMonoSemiBoldItalic"
    },
    "600": {
        "normal": "IBMPlexMonoLightItalic",
        "italic": "IBMPlexMonoBold"
    },
    "700": {
        "normal": "IBMPlexMono",
        "italic": "IBMPlexMonoBoldItalic"
    }
}
        },
  {
    // customize the size and line height scaling to your own needs
    // sizeSize: (size) => Math.round(size * 1.1),
    // sizeLineHeight: (size) => size + 5,
  }
)
```

NOTE: these instructions are auto-generated and might not be accurate with some fonts since not all fonts share the same conventions. you may need to edit them out to get them to work.
