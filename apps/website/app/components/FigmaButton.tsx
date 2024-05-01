import { Figma } from '@tamagui/lucide-icons'
import { Link } from '~/link'
import { Theme, Button, TooltipSimple } from 'tamagui'

export const FigmaButton = ({ circular }: { circular?: boolean }) => (
  <Theme name="gray">
    <Link
      prefetch={false}
      href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1"
      target="_blank"
    >
      <TooltipSimple label="Figma" disabled={!circular}>
        <Button
          bc="$color6"
          size="$3"
          br="$10"
          elevation="$0.5"
          icon={Figma}
          circular={circular}
          fontFamily="$silkscreen"
          fontSize={12}
        >
          {circular ? '' : 'Figma'}
        </Button>
      </TooltipSimple>
    </Link>
  </Theme>
)
