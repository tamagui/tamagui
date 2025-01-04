import { withStaticProperties } from '@tamagui/helpers'
import { ButtonNestingContext, type SizableStackProps } from '@tamagui/stacks'
import { type SizableTextProps, wrapChildrenInText } from '@tamagui/text'
import type { SizeTokens, TamaguiComponentExpectingVariants } from '@tamagui/web'
import { createStyledContext, styled } from '@tamagui/web'
import { createElement, isValidElement, useContext } from 'react'

export type ButtonFrameProps = SizableStackProps & {
  iconSize?: SizeTokens
  scaleIcon?: number
}

type FrameLike<Variants extends Record<string, any>> = TamaguiComponentExpectingVariants<
  ButtonFrameProps,
  Variants
>
type TextLike<Variants extends Record<string, any>> = TamaguiComponentExpectingVariants<
  SizableTextProps,
  Variants
>

export const createButton = <
  Variants extends Record<string, any>,
  FrameC extends FrameLike<Variants> = FrameLike<Variants>,
  TextC extends TextLike<Variants> = TextLike<Variants>,
  IconC extends TextLike<Variants> = TextLike<Variants>,
>(options: {
  Frame: FrameC
  Text: TextC
  Icon: IconC
  defaultVariants?: { [Key in keyof Variants]: Variants[Key] | undefined }
  name?: string
}) => {
  const context = createStyledContext(options.defaultVariants)
  const name = options.name ?? 'Button'

  const Frame = styled(options.Frame as any, {
    context,
    name,
    // @ts-ignore
    group: name as any,
    containerType: 'normal',
    role: 'button',
    tag: 'button',
  })

  const Icon = styled(options.Icon as any, {
    name,
    context,
  })

  const Text = styled(options.Text as any, {
    name,
    context,
  })

  const ButtonComponent = Frame.styleable((propsIn: any, ref) => {
    const isNested = useContext(ButtonNestingContext)
    const { children, iconSize, icon, iconAfter, scaleIcon = 0.4, ...props } = propsIn

    const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon, i) => {
      if (!icon) return null
      const isBefore = i === 0
      return isValidElement(icon)
        ? icon
        : createElement(icon, {
            size: iconSize ?? props.size,
            ...(!iconSize &&
              typeof scaleIcon === 'number' && {
                scale: scaleIcon,
                [isBefore ? 'marginLeft' : 'marginRight']: `-${scaleIcon * 40}%`,
              }),
          })
    })

    const wrappedChildren = wrapChildrenInText(
      Text,
      { children },
      propsIn.unstyled !== true
        ? {
            unstyled: process.env.TAMAGUI_HEADLESS === '1',
            size: propsIn.size,
          }
        : undefined
    )
    return (
      <ButtonNestingContext.Provider value={true}>
        <Frame ref={ref} {...props} {...(isNested && { tag: 'span' })}>
          {themedIcon}
          {wrappedChildren}
          {themedIconAfter}
        </Frame>
      </ButtonNestingContext.Provider>
    )
  })

  return withStaticProperties(ButtonComponent as any as FrameC, {
    Apply: context.Provider,
    Frame,
    Text,
    Icon,
  })
}
