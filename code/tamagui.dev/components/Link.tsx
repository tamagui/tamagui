import {
  router,
  useLinkTo,
  usePathname,
  type Href,
  type LinkProps as OneLinkProps,
} from 'one'
import { getDocsLinkHref, getDocsSyntax } from '~/features/docs/docsVersion'
import type { ViewProps } from 'tamagui'
import { Paragraph, Text } from 'tamagui'
import { Button, type ButtonProps } from './Button'

export type LinkProps = ViewProps &
  OneLinkProps<any> & {
    // for animating/doing something right before nav
    delayNavigate?: boolean
  }

export const Link = ({ href, replace, asChild, delayNavigate, ...props }: LinkProps) => {
  const pathname = usePathname()
  const resolvedHref =
    typeof href === 'string' ? getDocsLinkHref(href, getDocsSyntax(pathname)) : href
  const linkProps = useLinkTo({ href: resolvedHref as any, replace: !!replace })

  return (
    <Text
      render="a"
      // always except-style
      asChild={asChild ? 'except-style' : false}
      className="t_Link"
      cursor="pointer"
      {...props}
      {...linkProps}
      {...(delayNavigate && {
        onPress(e) {
          e.preventDefault()
          setTimeout(() => {
            router.navigate(resolvedHref as Href)
          }, 100)
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
  const pathname = usePathname()
  const resolvedHref =
    typeof href === 'string' ? getDocsLinkHref(href, getDocsSyntax(pathname)) : href
  const linkProps = useLinkTo({ href: resolvedHref as any, replace: !!replace })

  return (
    <Paragraph
      render="a"
      cursor="pointer"
      color="color hover:color"
      outlineColor="hover:red"
      {...props}
      {...(linkProps as any)}
      {...(delayNavigate && {
        onPress(e) {
          e.preventDefault()
          setTimeout(() => {
            router.navigate(resolvedHref as Href)
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
    <Link
      asChild
      {...{
        href,
        rel,
        target,
        replace,
      }}
    >
      <Button render="a" {...props}>
        {children}
      </Button>
    </Link>
  )
}
