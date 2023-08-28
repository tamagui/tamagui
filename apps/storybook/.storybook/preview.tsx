import { themes } from '@my/ui/src/themes/theme'
import { Preview } from '@storybook/react'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import 'raf/polyfill' 
import { StorybookDecorator } from './decorator'

const themeData = [
  new Set<string>(), // light/dark
  new Set<string>(), // color
  new Set<string>(), // alt1/alt2
  // new Set<string>(), // component
]
for (const themeKey of Object.keys(themes)) {
  themeKey.split('_').forEach((fragment, idx) => {
    if (fragment[0].toLowerCase() === fragment[0]) themeData[idx].add(fragment)
  })
}

const preview: Preview = {
  globalTypes: {
    theme1: {
      name: 'Theme',
      description: 'Theme for your components',
      defaultValue: [...themeData[0]][1],
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [...themeData[0]].map((value) => ({
          icon: value === 'light' ? 'sun' : value === 'dark' ? 'moon' : undefined,
          value,
          title: value[0].toUpperCase() + value.slice(1),
        })),
      },
    },
    theme2: {
      name: 'Theme',
      description: 'Theme for your components',
      defaultValue: null,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: null, title: 'None' },
          ...[...themeData[1]].map((value) => ({
            value,
            title: value[0].toUpperCase() + value.slice(1),
          })),
        ],
      },
    },

    theme3: {
      name: 'Theme',
      description: 'Theme for your components',
      defaultValue: null,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: null, title: 'None' },
          ...[...themeData[2]].map((value) => ({
            value,
            title: value[0].toUpperCase() + value.slice(1),
          })),
        ],
      },
    },
    // inverseTheme: {
    //   name: 'Inverse Theme',
    //   defaultValue: false,
    //   toolbar: {
    //     dynamicTitle: true,
    //     items: [
    //       { value: false, title: 'None' },
    //       { value: true, title: 'Inverse' },
    //     ],
    //   },
    // },
  },
  decorators: [StorybookDecorator],
}

export default preview
