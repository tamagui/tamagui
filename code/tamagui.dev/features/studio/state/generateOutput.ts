import type { ColorsStore } from './ColorsStore'
import type { useGlobalState } from './useGlobalState'

const generateColorConfig = (input: ColorsStore) => {
  const colors: Record<string, string> = {}

  for (const palette of Object.values(input.palettesByScheme)) {
    for (const scale of Object.values(palette.scales)) {
      let idx = 0
      for (const color of scale.colors) {
        const colorKey = [`${scale.name}${idx + 1}`]
        const key = `${colorKey}${palette.name}`
        colors[key] = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
        idx++
      }
    }
  }

  return colors
}

/**
 * generates full output snippet
 */
export const generateOutput = (globalStore: ReturnType<typeof useGlobalState>) => {
  const animations = globalStore.animations.draftAnimations

  const settings = globalStore.settings.draft
  // let configStr = JSON.stringify(settingsStore.draft, null, 2)
  // const linesArr = configStr.split('\n')
  // linesArr.splice(1, 0, '  ...baseConfig, // the rest of your config here')
  // return `const config = createTamagui(${linesArr.join('\n')})`

  return `import { config as baseConfig } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'
import { createAnimations } from '@tamagui/animations-react-native'

const animations = createAnimations({
${objToStr({ type: 'object', value: animations })}
})

export const config = createTamagui({    
${objToStr(
  { type: 'spread', value: 'baseConfig' },
  { type: 'value', value: 'animations' },
  { type: 'object', value: settings },
  {
    type: 'value',
    value: `tokens: {
${objToStr(
  { type: 'spread', value: 'baseConfig.tokens' },
  {
    type: 'value',
    value: `color: {
${objToStr({ type: 'object', value: generateColorConfig(globalStore.colors) })}
  }`,
  }
)}}`,
  }
)}
})
`
}

type ObjToStrInput =
  | { type: 'spread'; value: string }
  | { type: 'value'; value: string }
  | { type: 'object'; value: any }

// TODO: this helper could be much better
const objToStr = (...input: ObjToStrInput[]) => {
  let output: string[] = []
  for (const item of input) {
    if (item.type === 'spread') {
      output.push(`  ...${item.value},`)
    } else if (item.type === 'value') {
      output.push(`  ${item.value},`)
    } else if (item.type === 'object') {
      const lines = JSON.stringify(item.value, null, 2).split('\n')
      output.push(`${lines.slice(1, lines.length - 1).join('\n')}`)
    }
  }
  return output.join('\n')
}
