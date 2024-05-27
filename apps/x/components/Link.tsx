import type { ViewProps } from 'react-native'
import { Paragraph } from 'tamagui'
import { Link as RouterLink, type LinkProps as VXSLinkProps } from 'vxs'

export type LinkProps = ViewProps & VXSLinkProps

export const Link = (props: LinkProps) => {
  return <RouterLink {...props} />
}

export const ParagraphLink = ({
  href = '',
  replace,
  onPress,
  children,
  ...props
}: LinkProps) => {
  return (
    <Link {...{ href, replace, onPress }} asChild>
      <Paragraph
        cursor="pointer"
        tag="a"
        color="$color"
        hoverStyle={{ color: '$color', outlineColor: 'red' }}
        {...props}
      >
        {children}
      </Paragraph>
    </Link>
  )
}
