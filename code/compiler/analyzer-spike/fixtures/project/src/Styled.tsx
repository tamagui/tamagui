import { styled, View } from '@tamagui/tailwind'

export const StyledFrame = styled(View, 'fixture-base', {
  padding: 8,
  variants: {
    size: {
      large: { padding: 16 },
    },
  },
  defaultVariants: { size: 'large' },
  compoundVariants: [{ size: 'large', gap: 4 }],
})

export const StyledUse = () => <StyledFrame id="styled" />
