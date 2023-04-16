import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Button, ButtonProps, SizableText, TextProps } from 'tamagui'

export type LinkProps = Omit<NextLinkProps, 'passHref' | 'as'> &
  TextProps & {
    target?: any
    rel?: any
    title?: any
  }

export const Link = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: LinkProps) => {
  const linkProps = { href, replace, scroll, shallow, prefetch, locale }
  return (
    <NextLink {...linkProps}>
      <SizableText tag="span" {...props}>
        {children}
      </SizableText>
    </NextLink>
  )
}

export type ButtonLinkProps = Pick<
  NextLinkProps,
  'href' | 'replace' | 'scroll' | 'shallow' | 'prefetch' | 'locale'
> &
  ButtonProps & {
    target?: any
    rel?: any
    title?: any
  }

export const ButtonLink = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: ButtonLinkProps) => {
  const linkProps = { href, replace, scroll, shallow, prefetch, locale }
  return (
    <NextLink style={{ textDecoration: 'none' }} {...linkProps}>
      <Button tag="span" {...props}>
        {children}
      </Button>
    </NextLink>
  )
}
