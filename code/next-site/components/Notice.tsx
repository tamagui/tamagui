import React from 'react'
import { Paragraph, Theme, View, XStack, styled } from 'tamagui'

import { unwrapText } from './unwrapText'
import { AlertTriangle, Info } from '@tamagui/lucide-icons'

export const Notice = ({ children, theme = 'yellow', disableUnwrap, ...props }: any) => {
  return (
    <NoticeFrame theme={theme} {...props}>
      <View theme="alt1">
        {theme === 'green' ? <Info size="$1" /> : <AlertTriangle size="$1" />}
      </View>
      <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
        {disableUnwrap ? children : unwrapText(children)}
      </Paragraph>
    </NoticeFrame>
  )
}

export const NoticeFrame = styled(XStack, {
  className: 'no-opacity-fade',
  borderWidth: 1,
  borderColor: '$borderColor',
  p: '$4',
  py: '$3',
  bg: '$background',
  br: '$4',
  space: '$3',
  my: '$4',
  ai: 'center',
  pos: 'relative',
})
