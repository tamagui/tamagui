import { props } from './types'

const valid: typeof props = {
  scrollEnabled: true,
  contentContainerStyle: { minWidth: '100%' },
}
// @ts-expect-error scrollEnabled requires a boolean
const wrongValue: typeof props = { scrollEnabled: 'yes' }
// @ts-expect-error plain content styles use React Native property names
const shorthand: typeof props = { contentContainerStyle: { miw: '100%' } }
// @ts-expect-error native scroll props have no arbitrary property
const unknownProp: typeof props = { madeUpProp: true }
