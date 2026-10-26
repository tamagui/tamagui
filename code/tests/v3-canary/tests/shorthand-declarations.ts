import { spawnSync } from 'node:child_process'
import { mkdtempSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// emit without an app config, then consume the declarations with each setting.
// a source-only test cannot catch conditionals evaluated during library emit.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const fixture = mkdtempSync(join(tmpdir(), 'tamagui-shorthand-declarations-'))
symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
const compiler = join(dirname(require.resolve('typescript/package.json')), 'bin/tsc')
const options = {
  strict: true,
  skipLibCheck: true,
  target: 'ESNext',
  module: 'Preserve',
  moduleResolution: 'Bundler',
  jsx: 'react-jsx',
  types: ['react', 'node'],
}

function write(path: string, value: string | object) {
  writeFileSync(
    join(fixture, path),
    typeof value === 'string' ? value : JSON.stringify(value)
  )
}

function compile(project: string) {
  const result = spawnSync(process.execPath, [compiler, '-p', join(fixture, project)], {
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error(`${project} failed (${fixture})\n${result.stdout}\n${result.stderr}`)
  }
}

write(
  'library.tsx',
  `
import { createRefComponent, createStyledHOC, styled, View, withStaticProperties } from 'tamagui'
import { memo } from 'react'
export const Stack = styled(View, {
  variants: { tone: { quiet: { opacity: 0.5 }, loud: { opacity: 1 } } } as const,
})
export const Compound = withStaticProperties(Stack, { Child: Stack })
export const Hoc = createStyledHOC(Stack, (_props: { intent?: 'safe' | 'danger' }) => null)
export const Restyled = styled(Hoc, {})
export const Override = createStyledHOC(Stack, (_props: { alignItems?: 'custom' }) => null)
const RefComponent = createRefComponent<HTMLElement, import('tamagui').GetProps<typeof Hoc>>(() => null)
export const Memo: typeof RefComponent = memo(RefComponent)
`
)
write('library.json', {
  compilerOptions: {
    ...options,
    declaration: true,
    emitDeclarationOnly: true,
    outDir: 'emitted',
  },
  files: ['library.tsx'],
})
compile('library.json')

const components: [string, string?][] = [
  ['View'],
  ['Text'],
  ['YStack'],
  ['XStack'],
  ['ZStack'],
  ['Button'],
  ['Card'],
  ['Card.Header'],
  ['Card.Footer'],
  ['Card.Background'],
  ['Dialog.Trigger'],
  ['Dialog.Overlay'],
  ['Dialog.Content'],
  ['Dialog.Title'],
  ['Dialog.Description'],
  ['Dialog.Close'],
  ['Select.Trigger'],
  ['Select.Value'],
  ['Select.Item', 'value="a"'],
  ['Select.ItemText'],
  ['Select.Label'],
  ['Select.Group'],
  ['Select.Viewport'],
  ['Select.ScrollUpButton'],
  ['Select.ScrollDownButton'],
  ['Tabs'],
  ['Tabs.List'],
  ['Tabs.Tab', 'value="a"'],
  ['Tabs.Content', 'value="a"'],
  ['Switch'],
  ['Switch.Thumb'],
  ['Checkbox'],
  ['Checkbox.Indicator'],
  ['RadioGroup'],
  ['RadioGroup.Item', 'value="a"'],
  ['RadioGroup.Indicator'],
  ['Group'],
  ['Progress'],
  ['Progress.Indicator'],
  ['ToggleGroup.Item', 'value="a"'],
  ['Sheet.Handle'],
  ['Sheet.Overlay'],
  ['Sheet.Container'],
  ['Sheet.Background'],
  ['Sheet.ScrollView'],
  ['ScrollView'],
  ['Popover.Trigger'],
  ['Popover.Anchor'],
  ['Stack'],
  ['Compound'],
  ['Compound.Child'],
  ['Hoc'],
  ['Restyled'],
  ['Memo'],
]
const imports = [
  ...new Set(components.map(([component]) => component.split('.')[0])),
].filter(
  (component) => !['Stack', 'Compound', 'Hoc', 'Restyled', 'Memo'].includes(component)
)
const header = `
import type * as React from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps as NativeScrollViewProps } from 'react-native'
import type { Combined, GetProps } from 'tamagui'
import type { Combined as WebCombined } from '@tamagui/web'
import { ${imports.join(', ')}, createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v6'
import { Stack, Compound, Hoc, Restyled, Override, Memo } from './emitted/library'
`

for (const mode of ['strict', 'permissive', 'style-shorthands'] as const) {
  const config = `
const config = createTamagui({ ...defaultConfig, settings: { ...defaultConfig.settings,
  onlyAllowShorthands: ${mode === 'strict'}, onlyShorthandStyleProps: ${mode === 'style-shorthands'} } })
type Config = typeof config
declare module 'tamagui' { interface TamaguiCustomConfig extends Config {} }
`
  const cases = components
    .map(
      ([component, props = ''], index) => `
export const short${index} = <${component} ${props} p="2" />
${mode === 'strict' ? '// @ts-expect-error padding must use p in a strict consumer' : ''}
export const long${index} = <${component} ${props} padding="2" />
${mode === 'style-shorthands' ? '// @ts-expect-error borderWidth must use border in a style-shorthand consumer' : ''}
export const border${index} = <${component} ${props} borderWidth={1} />
`
    )
    .join('\n')
  write(
    `${mode}.tsx`,
    `${header}\n${config}\n${cases}
export const combined: Combined<{ left: number }, { right: number }> = { left: 1, right: 2 }
export const webCombined: WebCombined<{ left: number }, { right: number }> = combined
// @ts-expect-error both owners of a compound type are required
export const missingStatic: Combined<{ left: number }, { right: number }> = { left: 1 }
export const custom = <Restyled intent="safe" />
export const variant = <Compound tone="quiet" />
// @ts-expect-error declared variant values survive the library declaration boundary
export const invalidVariant = <Compound tone="other" />
// @ts-expect-error custom values are still checked
export const invalidCustom = <Restyled intent="other" />
export const override = <Override alignItems="custom" />
// @ts-expect-error an explicit own prop overrides the inherited css value
export const invalidOverride = <Override alignItems="center" />
declare const stackScrollProps: Omit<GetProps<typeof YStack>, 'onScroll'>
export const stackScroll = <ScrollView {...stackScrollProps} />
export const inheritedPointerEvents = <ScrollView pointerEvents="unset" />
export const sheetStackScroll = <Sheet.ScrollView {...stackScrollProps} />
export const sheetInheritedPointerEvents = <Sheet.ScrollView pointerEvents="unset" />
// @ts-expect-error pointer event values remain checked
export const invalidPointerEvents = <ScrollView pointerEvents="invalid" />
export const supportedScroll = <ScrollView horizontal keyboardDismissMode="on-drag" onScroll={(event) => event.nativeEvent.contentOffset.y} />
declare const nativeScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
declare const nativeScrollProps: Pick<NativeScrollViewProps,
  | 'StickyHeaderComponent'
  | 'alwaysBounceHorizontal'
  | 'alwaysBounceVertical'
  | 'automaticallyAdjustContentInsets'
  | 'automaticallyAdjustKeyboardInsets'
  | 'automaticallyAdjustsScrollIndicatorInsets'
  | 'bouncesZoom'
  | 'canCancelContentTouches'
  | 'experimental_endDraggingSensitivityMultiplier'
  | 'focusable'
  | 'innerViewRef'
  | 'onKeyboardDidHide'
  | 'onKeyboardDidShow'
  | 'onKeyboardWillHide'
  | 'onKeyboardWillShow'
  | 'persistentScrollbar'
  | 'scrollViewRef'
  | 'scrollsChildToFocus'
  | 'scrollsToTop'
  | 'stickyHeaderHiddenOnScroll'
  | 'zoomScale'
>
export const nativeScrollContract: Pick<GetProps<typeof ScrollView>, keyof typeof nativeScrollProps> = nativeScrollProps
export const nativeSheetScrollContract: Pick<GetProps<typeof Sheet.ScrollView>, keyof typeof nativeScrollProps> = nativeScrollProps
// @ts-expect-error native prop values remain checked on direct JSX
export const invalidNativeScroll = <ScrollView alwaysBounceHorizontal="yes" />
// @ts-expect-error native prop values remain checked through the sheet wrapper
export const invalidNativeSheetScroll = <Sheet.ScrollView zoomScale="yes" />
declare const pointer: (event: React.PointerEvent<HTMLDivElement>) => void
declare const focus: (event: React.FocusEvent<HTMLDivElement>) => void
declare const keyboard: (event: React.KeyboardEvent<HTMLDivElement>) => void
declare const click: (event: React.MouseEvent<HTMLDivElement>) => void
export const webScrollHandlers = <ScrollView onPointerDown={pointer} onFocus={focus} onBlur={focus} onKeyDown={keyboard} onClick={click} />
export const webSheetScrollHandlers = <Sheet.ScrollView onPointerDown={pointer} onFocus={focus} onBlur={focus} onKeyDown={keyboard} onClick={click} />
export const nativeScrollView = <ScrollView {...nativeScrollProps} onScroll={nativeScroll} onMomentumScrollEnd={nativeScroll} />
export const nativeSheetScroll = <Sheet.ScrollView {...nativeScrollProps} onScroll={nativeScroll} onMomentumScrollEnd={nativeScroll} />
// @ts-expect-error scroll views do not accept arbitrary props
export const invalidScroll = <ScrollView madeUpProp />
// @ts-expect-error sheet scroll views also reject arbitrary props
export const invalidSheetScroll = <Sheet.ScrollView madeUpProp />
// @ts-expect-error platform callback variance does not admit unrelated events
export const invalidScrollEvent = <ScrollView onScroll={(event: { unrelated: string }) => event.unrelated} />
`
  )
  write(`${mode}.json`, {
    compilerOptions: { ...options, noEmit: true },
    files: [`${mode}.tsx`],
  })
  compile(`${mode}.json`)
}

console.info(
  `passed ${components.length} declaration consumers in three settings (${fixture})`
)
