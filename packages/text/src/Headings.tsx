import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { Paragraph } from './Paragraph'

export const Heading = styled(
  Paragraph,
  {
    tag: 'span',
    accessibilityRole: 'header',
    fontFamily: '$heading',
    size: '$8',
    margin: 0,
  },
  {
    name: 'Heading',
  }
)

export type HeadingProps = GetProps<typeof Heading>

export const H1 = styled(
  Heading,
  {
    tag: 'h1',
    size: '$10',
  },
  {
    name: 'H1',
  }
)

export const H2 = styled(
  Heading,
  {
    tag: 'h2',
    size: '$9',
  },
  {
    name: 'H2',
  }
)

export const H3 = styled(
  Heading,
  {
    tag: 'h3',
    size: '$8',
  },
  {
    name: 'H3',
  }
)

export const H4 = styled(
  Heading,
  {
    tag: 'h4',
    size: '$7',
  },
  {
    name: 'H4',
  }
)

export const H5 = styled(
  Heading,
  {
    tag: 'h5',
    size: '$6',
  },
  {
    name: 'H5',
  }
)

export const H6 = styled(
  Heading,
  {
    tag: 'h6',
    size: '$5',
  },
  {
    name: 'H6',
  }
)
