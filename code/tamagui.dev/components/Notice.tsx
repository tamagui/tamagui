import { H3, Paragraph, XStack, YStack, styled } from 'tamagui'

import { unwrapText } from '~/helpers/unwrapText'

export const Notice = ({
  children,
  theme = 'yellow',
  disableUnwrap,
  title,
  ...props
}: any) => {
  return (
    <NoticeFrame theme={theme} {...props}>
      {title && (
        <H3 size="$5" mb={-10} mt={5}>
          {title}
        </H3>
      )}
      <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
        {disableUnwrap ? children : unwrapText(children)}
      </Paragraph>
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
  space: '$3',
  my: '$4',
  pos: 'relative',
})
