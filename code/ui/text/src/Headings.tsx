import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { Paragraph } from './Paragraph'

export const Heading = styled(Paragraph, {
  render: 'span',
  displayName: 'Heading',
  role: 'heading',
  fontFamily: 'heading',
  margin: 0,
  size: '8',
})

export type HeadingProps = GetProps<typeof Heading>

export const H1 = styled(Heading, {
  displayName: 'H1',
  render: 'h1',

  variants: {
    unstyled: {
      false: {
        size: '10',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const H2 = styled(Heading, {
  displayName: 'H2',
  render: 'h2',

  variants: {
    unstyled: {
      false: {
        size: '9',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const H3 = styled(Heading, {
  displayName: 'H3',
  render: 'h3',

  variants: {
    unstyled: {
      false: {
        size: '8',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const H4 = styled(Heading, {
  displayName: 'H4',
  render: 'h4',

  variants: {
    unstyled: {
      false: {
        size: '7',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const H5 = styled(Heading, {
  displayName: 'H5',
  render: 'h5',

  variants: {
    unstyled: {
      false: {
        size: '6',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const H6 = styled(Heading, {
  displayName: 'H6',
  render: 'h6',

  variants: {
    unstyled: {
      false: {
        size: '5',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})
