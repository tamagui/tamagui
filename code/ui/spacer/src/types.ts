import type { DebugProp, SpaceTokens, SpaceValue } from '@tamagui/web'

export type SpaceDirection = 'vertical' | 'horizontal' | 'both'

export type SpacedChildrenProps = {
  isZStack?: boolean
  children?: React.ReactNode
  space?: SpaceValue
  spaceFlex?: boolean | number
  direction?: SpaceDirection | 'unset'
  separator?: React.ReactNode
  ensureKeys?: boolean
  debug?: DebugProp
}

export type SpaceProps = {
  space?: SpaceTokens | number
  spaceDirection?: SpaceDirection
  separator?: React.ReactNode
  flex?: SpaceTokens | number | boolean
}
