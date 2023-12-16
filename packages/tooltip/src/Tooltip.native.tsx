import { withStaticProperties } from '@tamagui/helpers'

// no output on native for now
// could have an option to long-press or similar to show in a context menu/drawer

const RenderChildren = (props: any) => {
  return props.children
}

const RenderNull = (props: any) => {
  return null
}

export const Tooltip = withStaticProperties(RenderChildren, {
  Anchor: RenderChildren,
  Arrow: RenderNull,
  Close: RenderNull,
  Content: RenderNull,
  Trigger: RenderChildren,
})
