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
    <YStack cur={href ? 'pointer' : 'default'} f={1} p="$3.5" br="$4" gap="$1">
      <XStack jc="center" ai="center" gap="$2">
        <H2 ff="$mono" fow="600" size="$4" ls={1}>
          {title}
        </H2>
        <YStack mr={-7} scale={0.7} y={0.5}>
          {icon}
        </YStack>
      </XStack>

      <Paragraph ff="$mono" px="$2" theme="alt1" f={1} size="$4" lh="$3" ls={-0.5}>
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
      onPressIn={() => {
        purchaseModal.show = false
      }}
    >
      {content}
    </Link>
  )
}
