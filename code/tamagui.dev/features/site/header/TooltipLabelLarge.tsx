import type { Href } from 'one'
import { H2, Paragraph, XStack, YStack } from 'tamagui'
import { Link } from '../../../components/Link'
import { purchaseModal } from '../purchase/NewPurchaseModal'

export const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
  href,
}: { href?: string; icon: any; title: string; subtitle: string }) => {
  const content = (
    <YStack
      cursor={href ? 'pointer' : 'default'}
      flex={1}
      flexBasis="auto"
      p="$3.5"
      rounded="$4"
      gap="$1"
    >
      <XStack $gtXs={{ justify: 'center' }} items="center" gap="$2">
        <H2 fontFamily="$mono" fontWeight="600" size="$4" letterSpacing={1}>
          {title}
        </H2>
        <YStack scale={0.7} y={0.5}>
          {icon}
        </YStack>
      </XStack>

      <Paragraph
        $gtXs={{ text: 'center' }}
        fontFamily="$mono"
        color="$color10"
        flex={1}
        size="$4"
        lineHeight="$3"
        letterSpacing={-0.5}
      >
        {subtitle}
      </Paragraph>
    </YStack>
  )

  if (!href) {
    return content
  }

  return (
    <Link
      asChild
      delayNavigate
      href={href as Href}
      onPress={() => {
        purchaseModal.show = false
      }}
    >
      {content}
    </Link>
  )
}
