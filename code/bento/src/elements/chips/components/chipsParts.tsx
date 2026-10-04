import { type ComponentSize, resolveSizing } from '@tamagui/core'
import type { ColorTokens } from 'tamagui'
import {
  createStyledContext,
  createStyledHOC,
  styled,
  Text,
  useGetThemedIcon,
  View,
  withStaticProperties,
} from 'tamagui'

const ChipContext = createStyledContext({
  size: 'md' as ComponentSize,
})

const chipFrameSize = {
  xs: { paddingInline: '1.5', paddingBlock: '0.5', gap: '1' },
  sm: { paddingInline: '2', paddingBlock: '0.5', gap: '1' },
  md: { paddingInline: '2.5', paddingBlock: '1', gap: '1.5' },
  lg: { paddingInline: '3', paddingBlock: '1', gap: '1.5' },
  xl: { paddingInline: '4', paddingBlock: '1.5', gap: '2' },
} as const

const chipTextSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'xs', lineHeight: 'xs' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'sm', lineHeight: 'sm' },
  xl: { fontSize: 'base', lineHeight: 'base' },
} as const

const ChipImpl = styled(View, {
  name: 'Chip',
  flexDirection: 'row',
  context: ChipContext,
  borderRadius: 'md',
  backgroundColor: 'color-6',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    circular: {
      true: {
        borderRadius: 'full',
      },
    },
    size: {
      ...chipFrameSize,
      true: chipFrameSize.md,
    },
    pressable: {
      true: {
        cursor: 'pointer',
        backgroundColor: 'color-6 hover:color-7 press:color-8',
        outlineColor: 'focus-visible:outline-color',
        outlineStyle: 'focus-visible:solid',
        outlineWidth: 'focus-visible:2px',
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

const ChipText = styled(Text, {
  name: 'ChipText',
  context: ChipContext,
  fontFamily: 'body',
  fontWeight: '500',
  color: 'color',
  variants: {
    size: {
      ...chipTextSize,
      true: chipTextSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

type ChipIconProps = {
  color?: ColorTokens | string
  scaleIcon?: number
  size?: ComponentSize
  children: React.ReactNode
}

const ChipIconFrame = styled(View, {
  name: 'ChipIcon',
  context: ChipContext,
})

const ChipIcon = createStyledHOC(ChipIconFrame, (props: ChipIconProps, ref) => {
  const { children, scaleIcon = 0.85, size, color, ...rest } = props
  const chipContext = ChipContext.useStyledContext()
  const getThemedIcon = useGetThemedIcon({
    size: resolveSizing(size || chipContext.size).icon * scaleIcon,
    color: color as any,
  })
  return (
    <ChipIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </ChipIconFrame>
  )
})

const ChipButton = styled(View, {
  name: 'ChipButton',
  context: ChipContext,
  tabIndex: 0,
  role: 'button',
  cursor: 'pointer',
  borderRadius: 'full',
  padding: '0.5',
  backgroundColor:
    'transparent hover:background-hover press:background-press focus:background-focus',
  justifyContent: 'center',
  alignItems: 'center',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<ComponentSize>(),
    alignRight: {
      true: { marginRight: '-1' },
    },
    alignLeft: {
      true: { marginLeft: '-1' },
    },
  } as const,
})

export const Chip = withStaticProperties(ChipImpl, {
  Text: ChipText,
  Icon: ChipIcon,
  Button: ChipButton,
})
