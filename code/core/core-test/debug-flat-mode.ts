import config from '../config-default'
import { View, createTamagui, getSplitStyles, getDefaultProps } from '../web/src'
import { defaultComponentState } from '../web/src/defaultComponentState'

const defaultConfig = config.getDefaultTamaguiConfig()
createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleMode: 'flat',
  },
})

const emptyObj = {} as any
const styleProps = {
  mediaState: undefined,
  isAnimated: false,
  resolveValues: 'auto',
}

const result = getSplitStyles(
  { '$bg': 'red' },
  View.staticConfig,
  emptyObj,
  '',
  defaultComponentState,
  styleProps,
  emptyObj,
  {
    animationDriver: {},
    groups: { state: {} },
  } as any,
  undefined,
  undefined,
  true
)

console.log('Result for $bg="red":')
console.log('style:', JSON.stringify(result?.style, null, 2))
console.log('classNames:', JSON.stringify(result?.classNames, null, 2))
console.log('viewProps:', JSON.stringify(result?.viewProps, null, 2))
console.log('rulesToInsert:', result?.rulesToInsert?.length || 0, 'rules')
