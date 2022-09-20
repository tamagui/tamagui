import React from 'react'
import { H3, ThemeReset } from 'tamagui'

export const SubTitle = ({ children, ...props }) => {
  if (!children) {
    return null
  }

  // takes the text even if it's wrapped in `<p>`
  // https://github.com/wooorm/xdm/issues/47
  const childText = typeof children === 'string' ? children : children.props.children
  return (
    <ThemeReset>
      <H3
        pos="relative"
        width="max-content"
        size="$8"
        theme="alt2"
        fontFamily="$body"
        fontWeight="300"
        tag="p"
        maxWidth="100%"
        mb="$2"
        mt="$0"
        {...props}
      >
        {childText}
      </H3>
    </ThemeReset>
  )
}
