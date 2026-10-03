import { createStyledHOC, styled } from '@tamagui/core'
import type { SizableTextProps } from '@tamagui/text'
import { SizableText } from '@tamagui/text'

export interface AnchorExtraProps {
  href?: string
  target?: string
  rel?: string
}

export type AnchorProps = SizableTextProps & AnchorExtraProps

const AnchorFrame = styled(SizableText, {
  displayName: 'Anchor',
  className: 'tm-anchor',
  render: 'a',
  role: 'link',
})

export const Anchor = createStyledHOC(
  AnchorFrame,
  ({ href, target, rel, ...props }: AnchorProps, ref) => {
    // the frame renders an `a`, but `styled` types it from SizableText, which
    // does not carry the anchor attributes
    const anchorAttributes = { href, target, rel } as AnchorProps
    return <AnchorFrame {...props} {...anchorAttributes} ref={ref as any} />
  }
)
