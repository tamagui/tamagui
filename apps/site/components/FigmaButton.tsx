import { Figma } from '@tamagui/lucide-icons'
import Link from 'next/link'
import { Theme, Button } from 'tamagui'

export const FigmaButton = () => (
  <Theme name="gray">
    <Link
      prefetch={false}
      href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1"
      target="_blank"
    >
      <Button
        bc="$color6"
        size="$3"
        br="$10"
        elevation="$1"
        icon={Figma}
        fontFamily="$silkscreen"
      >
        Figma
      </Button>
    </Link>
  </Theme>
)
