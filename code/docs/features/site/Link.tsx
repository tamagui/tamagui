import { Text } from 'tamagui'
import { useLinkTo, type Href, type LinkProps as OneLinkProps } from 'one'

export type LinkProps = OneLinkProps<Href>

export const Link = ({ href, replace, asChild, ...props }: LinkProps) => {
  const linkProps = useLinkTo({ href: href as string, replace })

  return (
    <Text
      tag="a"
      // always except-style
      asChild={asChild ? 'except-style' : false}
      className="t_Link"
      cursor="pointer"
      color="inherit"
      fontSize="inherit"
      lineHeight="inherit"
      {...props}
      {...linkProps}
    />
  )
}
