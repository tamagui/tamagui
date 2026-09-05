import { H3, Paragraph, XStack, YStack, styled } from 'tamagui'
import { AlertTriangle, Info, CheckCircle } from '@tamagui/lucide-icons-2'

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
  title,
  ...props
}: {
  children: React.ReactNode
  theme?: NoticeTheme
  title?: string
} & any) => {
  const IconComponent = getIcon(theme)

  return (
    <NoticeFrame theme={theme} {...props}>
      <XStack gap="3">
        <YStack mt={5} width={20} height={20}>
          <IconComponent size={20} color="color10" />
        </YStack>
        <YStack flex={1}>
          {title && (
            <H3 size="5" mb={-10} mt={5}>
              {title}
            </H3>
          )}
          {/* a div, so mdx block content (paragraphs, code fences, lists) can
              nest inside it while single-line inline notices still pick up the
              type below. `paragraph-parent` folds nested mdx paragraphs into
              this size, see app.css */}
          <Paragraph
            render="div"
            py="2"
            color="color11"
            mt={-3}
            mb={-3}
            className="paragraph-parent"
            size="5"
          >
            {children}
          </Paragraph>
        </YStack>
      </XStack>
    </NoticeFrame>
  )
}

export const NoticeFrame = styled(YStack, {
  className: 'no-opacity-fade',
  borderWidth: 1,
  borderColor: 'border-color',
  paddingRight: '4',
  paddingLeft: '4',
  py: '3',
  bg: 'background',
  rounded: '4',
  gap: '3',
  my: '4',
  position: 'relative',
})
