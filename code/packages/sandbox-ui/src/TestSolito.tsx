import React from 'react'
// import { SolitoImage } from 'solito/image'
import type { LinkProps } from 'solito/link'
import { LinkCore } from 'solito/link'
import type { AnchorProps } from 'tamagui'
import { Anchor, styled } from 'tamagui'

const StyledTextLink = styled(Anchor, {
  name: 'TextLink',
})

export type TextLinkProps = Pick<LinkProps, 'href' | 'target'> & AnchorProps

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ children, href, target, ...restProps }, ref) => {
    return (
      <LinkCore
        Component={StyledTextLink}
        componentProps={restProps}
        href={href}
        ref={ref}
        target={target}
      >
        {children}
      </LinkCore>
    )
  }
)

// export const StyledSolitoImage = styled(SolitoImage, {})
