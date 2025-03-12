import { type ViewProps, Button, Paragraph, Text, type ButtonProps } from 'tamagui'
import { router, useLinkTo, type LinkProps as OneLinkProps } from 'one'

export type LinkProps = ViewProps &
  OneLinkProps<any> & {
    // for animating/doing something right before nav
    delayNavigate?: boolean
  }

export const Link = ({ href, replace, asChild, delayNavigate, ...props }: LinkProps) => {
  const linkProps = useLinkTo({ href: href as any, replace: !!replace })

  return (
    <Text
      tag="a"
      // always except-style
      asChild={asChild ? 'except-style' : false}
      className="t_Link"
      cursor="pointer"
      color="inherit"
      // @ts-expect-error
      fontSize="inherit"
      // @ts-expect-error
      lineHeight="inherit"
      {...props}
      {...linkProps}
      {...(delayNavigate && {
        onPress(e) {
          e.preventDefault()
          setTimeout(() => {
            router.navigate(href)
          }, 16)
          props.onPress?.(e)
        },
      })}
    />
  )
}

export const ParagraphLink = ({
  href = '' as any,
  replace,
  delayNavigate,
  onPress,
  children,
  ...props
}: LinkProps) => {
  const linkProps = useLinkTo({ href: href as string, replace: !!replace })

  return (
    <Paragraph
      tag="a"
      cursor="pointer"
      color="$color"
      hoverStyle={{ color: '$color', outlineColor: 'red' }}
      {...props}
      {...(linkProps as any)}
      {...(delayNavigate && {
        onPress(e) {
          e.preventDefault()
          setTimeout(() => {
            router.navigate(href)
          }, 16)
          onPress?.(e)
        },
      })}
    >
      {children}
    </Paragraph>
  )
}

export type ButtonLinkProps = Pick<LinkProps, 'href' | 'replace' | 'target' | 'rel'> &
  ButtonProps

export const ButtonLink = ({
  href = '' as any,
  rel,
  target,
  replace = false,
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    // @ts-expect-error
    <Link
      asChild
      {...{
        href,
        rel,
        target,
        replace,
      }}
    >
      <Button tag="a" {...props}>
        {children}
      </Button>
    </Link>
  )
}
