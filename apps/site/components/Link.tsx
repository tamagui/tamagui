import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { Paragraph, SizableText, TextProps } from 'tamagui'
import { Button, ButtonProps } from 'tamagui'

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
  return (
    <NextLink {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <SizableText cursor="pointer" tag="span" {...props}>
        {children}
      </SizableText>
    </NextLink>
  )
}

export const ParagraphLink = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: LinkProps) => {
  const allChildrenStrings = React.Children.toArray(children).every(
    (x) => typeof x === 'string'
  )
  return (
    <NextLink {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <Paragraph
        className="paragraph-link"
        cursor="pointer"
        tag="span"
        color="$color"
        hoverStyle={{ color: '$color' }}
        {...props}
      >
        {allChildrenStrings ? children : children}
      </Paragraph>
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
