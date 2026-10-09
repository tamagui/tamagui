import {
  router,
  useLinkTo,
  usePathname,
  type Href,
  type LinkProps as OneLinkProps,
} from 'one'
import { getDocsLinkHref } from '~/features/docs/docsVersion'
import type { ComponentProps } from 'react'
import type { TextProps } from 'tamagui'
import { Paragraph, Text } from 'tamagui'
import { Button, type ButtonProps } from './Button'

export type LinkProps = TextProps &
  OneLinkProps<any> & {
    // for animating/doing something right before nav
    delayNavigate?: boolean
  }

export const Link = ({ href, replace, asChild, delayNavigate, ...props }: LinkProps) => {
  const pathname = usePathname()
  const resolvedHref = typeof href === 'string' ? getDocsLinkHref(href, pathname) : href
  const linkProps = useLinkTo({ href: resolvedHref as any, replace: !!replace })
  // the view props accept wider css values than the text declares (raw
  // font-style keywords, any-number weights); the text renders them all, so
  // thread the spread through its own prop type instead of narrowing callers
  const textProps = props as ComponentProps<typeof Text>

  return (
    <Text
      render="a"
      // always except-style
      asChild={asChild ? 'except-style' : false}
      className="t_Link"
      cursor="pointer"
      {...textProps}
      {...linkProps}
      onPress={
        typeof resolvedHref === 'string' && resolvedHref.includes('#')
          ? undefined
          : linkProps.onPress
      }
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
  const resolvedHref = typeof href === 'string' ? getDocsLinkHref(href, pathname) : href
  const linkProps = useLinkTo({ href: resolvedHref as any, replace: !!replace })

  return (
    <Paragraph
      render="a"
      cursor="pointer"
      color="color hover:color"
      outlineColor="hover:red"
      {...props}
      {...(linkProps as any)}
      onPress={
        typeof resolvedHref === 'string' && resolvedHref.includes('#')
          ? undefined
          : linkProps.onPress
      }
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
