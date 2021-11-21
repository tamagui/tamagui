import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { Paragraph, ParagraphProps } from 'tamagui'

export type LinkProps = Omit<NextLinkProps, 'passHref' | 'as'> & ParagraphProps

export const Link = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  ...props
}: LinkProps) => {
  return (
    <NextLink passHref {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <Paragraph
        cursor="pointer"
        tag="a"
        color="$color3"
        hoverStyle={{ color: '$color' }}
        {...props}
      />
    </NextLink>
  )
}
