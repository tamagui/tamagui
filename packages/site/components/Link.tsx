import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { Paragraph, ParagraphProps, Theme } from 'tamagui'

export type LinkProps = Omit<NextLinkProps, 'passHref' | 'as'> &
  ParagraphProps & {
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
      <Paragraph
        cursor="pointer"
        tag="a"
        // TODO this is grabbing blue_alt it shold jsut be alt2
        theme="alt2"
        hoverStyle={{ color: '$colorHover' }}
        {...props}
      >
        {allChildrenStrings ? children : children}
      </Paragraph>
    </NextLink>
  )
}
