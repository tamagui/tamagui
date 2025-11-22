import { H3, Paragraph, XStack, YStack, styled } from 'tamagui'
import { AlertTriangle, Info, CheckCircle } from '@tamagui/lucide-icons'

import { unwrapText } from '~/helpers/unwrapText'

const getIcon = (theme: string) => {
  switch (theme) {
    case 'blue':
      return Info
    case 'green':
      return CheckCircle
    default:
      return AlertTriangle
  }
}

type NoticeTheme = 'yellow' | 'blue' | 'green'

export const Notice = ({
  children,
  theme = 'yellow',
  disableUnwrap,
  title,
  ...props
}: {
  children: React.ReactNode
  theme?: NoticeTheme
  disableUnwrap?: boolean
  title?: string
} & any) => {
  const IconComponent = getIcon(theme)

  return (
    <NoticeFrame theme={theme} {...props}>
      <XStack gap="$3">
        <IconComponent size="$1" mt={5} color="$color11" />
        <YStack f={1}>
          {title && (
            <H3 size="$5" mb={-10} mt={5}>
              {title}
            </H3>
          )}
          <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
            {disableUnwrap ? children : unwrapText(children)}
          </Paragraph>
        </YStack>
      </XStack>
    </NoticeFrame>
  )
}

export const NoticeFrame = styled(YStack, {
  className: 'no-opacity-fade',
  borderWidth: 1,
  borderColor: '$borderColor',
  p: '$4',
  py: '$3',
  bg: '$background',
  br: '$4',
  gap: '$3',
  my: '$4',
  pos: 'relative',
})
