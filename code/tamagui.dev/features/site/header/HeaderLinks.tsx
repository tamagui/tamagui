import { Paragraph, styled } from 'tamagui'

export const HeadAnchor = styled(Paragraph, {
  render: 'a',
  fontFamily: 'silkscreen',
  px: '4',
  py: '4',
  cursor: 'pointer',
  fontSize: 14,
  color: 'color10 hover:color12',
  rounded: 'hover:3',
  opacity: 'press:0.25',
  tabIndex: -1,
  variants: {
    grid: {
      true: {
        fow: '200',
        ls: 1,
        w: '100%',
        paddingTop: '2',
        paddingBottom: '2',
        px: '4',
        backgroundColor: 'hover:color-mix(in srgb, var(--color8) 10%, transparent 50%)',
        f: 1,
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
