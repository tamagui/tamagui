import { isWeb } from '@tamagui/constants'
import { styled } from '@tamagui/core'
import type { SizableTextProps } from '@tamagui/text'
import { SizableText } from '@tamagui/text'
import { Linking } from 'react-native'

export interface AnchorExtraProps {
  href?: string
  target?: string
  rel?: string
}

export type AnchorProps = SizableTextProps & AnchorExtraProps

const AnchorFrame = styled(SizableText, {
  name: 'Anchor',
  render: 'a',
  role: 'link',
})

export const Anchor = AnchorFrame.styleable<AnchorExtraProps>(
  ({ href, target, rel, ...props }, ref) => {
    return (
      <AnchorFrame
        {...props}
        {...(isWeb
          ? {
              href,
              target,
              rel,
            }
          : {
              onPress: (event) => {
                props.onPress?.(event)
                if (href !== undefined) {
                  Linking.openURL(href)
                }
              },
            })}
        ref={ref as any}
      />
    )
  }
)
