import { Heart } from '@tamagui/lucide-icons-2'
import { TooltipSimple, YStack } from 'tamagui'
import { Button } from '~/components/Button'

import { Link } from '~/components/Link'

export const SponsorButton = (props: { tiny?: boolean }) => {
  const el = (
    <Button
      theme="red"
      icon={
        <Heart
          style={{ marginBottom: -1 }}
          size={props.tiny ? 12 : 14}
          color="var(--red10)"
        />
      }
      self="center"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      borderWidth={props.tiny ? 0 : 1}
      borderColor="border-color"
      size={props.tiny ? 'small' : 'medium'}
      rounded="5"
      circular={props.tiny ? true : false}
      variant={props.tiny ? 'quiet' : undefined}
      aria-label="Support OSS development of Tamagui"
    >
      <Button.Text>{props.tiny ? '' : 'Sponsor'}</Button.Text>
    </Button>
  )
  return (
    <Link target="_blank" href="https://github.com/sponsors/natew">
      <YStack>
        {props.tiny ? (
          <TooltipSimple delay={0} restMs={25} label="Support OSS development of Tamagui">
            {el}
          </TooltipSimple>
        ) : (
          el
        )}
      </YStack>
    </Link>
  )
}
