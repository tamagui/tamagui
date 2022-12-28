import { Heart } from '@tamagui/lucide-icons'
import { Button } from 'tamagui'

import { NextLink } from './NextLink'

export const SponsorButton = () => {
  return (
    <NextLink target="_blank" href="https://github.com/sponsors/natew">
      <Button
        theme="red"
        icon={<Heart style={{ marginBottom: -0.5 }} size={18} color="var(--red10)" />}
        als="center"
        elevation="$4"
        borderWidth={1}
        borderColor="$color5"
        size="$5"
        fontFamily="$silkscreen"
        bc="$color1"
        br="$10"
      >
        Sponsor
      </Button>
    </NextLink>
  )
}
