import type { ViewProps } from 'tamagui'
import { Badge } from './Badge'

const badgeStatuses = {
  stable: {
    theme: 'green',
    text: 'Stable',
  },
  'mostly-stable': {
    theme: 'blue',
    text: 'Mostly Stable',
  },
  developing: {
    theme: 'purple',
    text: 'Developing',
  },
  early: {
    theme: 'red',
    text: 'Early',
  },
  beta: {
    theme: 'pink',
    text: 'Beta',
  },
} as const

export const Status = ({
  is,
  ...rest
}: ViewProps & { is: keyof typeof badgeStatuses }) => {
  const info = badgeStatuses[is]
  return (
    <Badge dsp="inline-flex" y={-2} mx={6} variant={info.theme} {...rest}>
      {info.text}
    </Badge>
  )
}
