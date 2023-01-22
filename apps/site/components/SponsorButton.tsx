import { Heart } from '@tamagui/lucide-icons'
import { Button, Tooltip, TooltipSimple } from 'tamagui'

import { NextLink } from './NextLink'

export const SponsorButton = (props: { tiny?: boolean }) => {
  const el = (
    <Button
      theme="red"
      icon={
        <Heart
          style={{ marginBottom: -0.5 }}
          size={props.tiny ? 12 : 18}
          color="var(--red10)"
        />
      }
      als="center"
      elevation="$4"
      borderWidth={props.tiny ? 0 : 1}
      borderColor="$color5"
      size={props.tiny ? '$2' : '$4'}
      fontFamily="$silkscreen"
      bc="$color1"
      br="$10"
      circular={props.tiny ? true : false}
      chromeless={props.tiny ? true : false}
    >
      {props.tiny ? '' : 'Sponsor'}
    </Button>
  )
  return (
    <NextLink target="_blank" href="https://github.com/sponsors/natew">
      {props.tiny ? (
        <TooltipSimple label="Support OSS development of Tamagui">{el}</TooltipSimple>
      ) : (
        el
      )}
    </NextLink>
  )
}
