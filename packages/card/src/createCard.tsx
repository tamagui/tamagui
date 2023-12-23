import { withStaticProperties } from '@tamagui/helpers'

import { CardBackground, CardFooter, CardFrame, CardHeader } from './Card'

export function createCard<
  A extends typeof CardFrame,
  B extends typeof CardHeader,
  C extends typeof CardFooter,
  D extends typeof CardBackground
>(props: { Frame: A; Header: B; Footer: C; Background: D }) {
  return withStaticProperties(props.Frame, {
    Header: props.Header,
    Footer: props.Footer,
    Background: props.Background,
  })
}
