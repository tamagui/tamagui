import { Paragraph, styled } from 'tamagui'

export const HeadAnchor = styled(Paragraph, {
  render: 'a',
  fontFamily: '$silkscreen',
  px: '$4',
  py: '$4',
  cursor: 'pointer',
  fontSize: 14,
  color: '$color11',
  tabIndex: -1,

  hoverStyle: {
    color: '$color',
    rounded: '$3',
  },

  pressStyle: {
    opacity: 0.25,
  },

  variants: {
    grid: {
      true: {
        fow: '200',
        ls: 1,
        textTransform: 'unset',
        w: '100%',
        f: 1,
        p: '$2',
        px: '$4',

        hoverStyle: {
          backgroundColor:
            'color-mix(in srgb, var(--color8) 10%, transparent 50%)' as any,
        },
      },
    },

    half: {
      true: {
        maxWidth: '48.5%',
        overflow: 'hidden',
      },
    },
  } as const,
})
