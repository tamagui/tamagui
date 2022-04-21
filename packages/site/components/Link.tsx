import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { Paragraph, SizableText, Text, TextProps } from 'tamagui'

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
  const allChildrenStrings = React.Children.toArray(children).every((x) => typeof x === 'string')
  return (
    <NextLink passHref {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <SizableText
        cursor="pointer"
        tag="a"
        color="$color"
        hoverStyle={{ color: '$color' }}
        {...props}
      >
        {allChildrenStrings ? children : children}
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
  const allChildrenStrings = React.Children.toArray(children).every((x) => typeof x === 'string')
  return (
    <NextLink passHref {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <Paragraph
        className="paragraph-link"
        cursor="pointer"
        tag="a"
        color="$color"
        hoverStyle={{ color: '$color' }}
        {...props}
      >
        {allChildrenStrings ? children : children}
      </Paragraph>
    </NextLink>
  )
}
