import { Figma } from '@tamagui/lucide-icons'
import { Link } from '~/link'
import { Theme, Button } from 'tamagui'
import { GithubIcon } from './GithubIcon'

export const GithubButton = ({ circular }: { circular?: boolean }) => (
  <Theme name="gray">
    <Link prefetch={false} href="https://github.com/tamagui/tamagui" target="_blank">
      <Button
        bc="$color6"
        size="$3"
        br="$10"
        elevation="$0.5"
        icon={<GithubIcon width={22} />}
        circular={circular}
        fontFamily="$silkscreen"
        fontSize={12}
      >
        {circular ? '' : 'Github'}
      </Button>
    </Link>
  </Theme>
)
