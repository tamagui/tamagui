import type { ViewProps } from 'react-native'
import { Paragraph, Text } from 'tamagui'
import { useLinkTo, type LinkProps as VXSLinkProps } from 'vxs'

export type LinkProps = ViewProps & VXSLinkProps

export const Link = ({ href, replace, ...props }: LinkProps) => {
  const linkProps = useLinkTo({ href, replace })

  return (
    <Text
      tag="a"
      cursor="pointer"
      color="inherit"
      fontSize="inherit"
      lineHeight="inherit"
      {...props}
      {...linkProps}
    />
  )
}

export const ParagraphLink = ({
  href = '',
  replace,
  onPress,
  children,
  ...props
}: LinkProps) => {
  const linkProps = useLinkTo({ href, replace })

  return (
    <Paragraph
      tag="a"
      cursor="pointer"
      color="$color"
      hoverStyle={{ color: '$color', outlineColor: 'red' }}
      {...props}
      {...linkProps}
    >
      {children}
    </Paragraph>
  )
}
