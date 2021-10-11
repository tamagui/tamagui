import { Community } from '@components/Community'
import { FeaturesGrid } from '@components/FeaturesGrid'
import { Header } from '@components/Header'
import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Box, VStack, Divider } from 'snackui'
import React from 'react'

const variantsCode = `const Button = styled('button', {
  // base styles

  variants: {
    color: {
      gray: {
        backgroundColor: 'gainsboro',
      },
      blue: {
        backgroundColor: 'dodgerblue',
      },
    },
    size: {
      md: {
        height: '25px',
      },
      lg: {
        height: '35px',
      }
    }
  },

  compoundVariants: [{
    color: 'blue',
    size: 'lg',
    css: {
      backgroundColor: 'purple',
    }
  }],

  defaultVariants: {
    color: 'gray',
    size: 'md',
  }
});`

const variantsCodeHighlights = {
  one: '4-21',
  two: '23-29',
  three: '31-34',
}

const themingCode = `const { createTheme } = createStitches({
  theme: {
    fonts: {},
    space: {},
    sizes: {},
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    radii: {},
    zIndices: {},
    colors: {
      gray100: 'hsl(206 14% 96%)',
      gray200: 'hsl(206 12% 90%)',
      gray300: 'hsl(206 6% 56%)',
      gray400: 'hsl(206 6% 44%)',
      violet100: 'hsl(252 87% 96%)',
      violet200: 'hsl(252 83% 87%)',
      violet300: 'hsl(252 62% 54%)',
      violet400: 'hsl(250 55% 48%)',

      // token aliases
      background: '$gray100',
      line: '$gray200',
      text: '$gray400',
      accent: '$violet300',
    }
  }
});

const darkTheme = createTheme({
  colors: {
    gray100: 'hsl(201 6% 12%)',
    gray200: 'hsl(203 6% 25%)',
    gray300: 'hsl(206 6% 44%)',
    gray400: 'hsl(205 5% 53%)',
    violet100: 'hsl(250 34% 16%)',
    violet200: 'hsl(251 43% 31%)',
    violet300: 'hsl(252 58% 50%)',
    violet400: 'hsl(250 100% 76%)',

    // token aliases
    background: '$gray100',
    line: '$gray200',
    text: '$gray400',
    accent: '$violet300',
  },
});`

const themingCodeHighlights = {
  one: '3-20',
  two: '23-26',
  three: '31-48',
}

const tokensCode = `const Button = styled("button", {
  color: '$violet400',
  paddingLeft: '$4',
  paddingRight: '$4',
  height: '$6',
  fontSize: '$3',
  border: '1px solid $pink500',

  height: '$space$6',
  paddingLeft: '$sizes$4',
  paddingRight: '$sizes$4',
});`

const tokensCodeHighlights = {
  one: '2-7',
  two: '9-11',
}

const utilsCode = `export const { styled, css } = createStitches({
  utils: {
    pt: (value) => ({
      paddingTop: value,
    }),
    pr: (value) => ({
      paddingRight: value,
    }),
    pb: (value) => ({
      paddingBottom: value,
    }),
    pl: (value) => ({
      paddingLeft: value,
    }),

    px: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    size: (value) => ({
      width: value,
      height: value,
    }),

    linearGradient: (value) => ({
      backgroundImage: \`linear-gradient(\${value})\`,
    }),
  },
});`

const utilsCodeHighlights = {
  one: '1-14',
  two: '16-27',
  three: '29-31',
}

const demoCode3 = `const { theme } = createStitches({
  theme: {
    fonts: {},
    space: {},
    sizes: {},
    fontSizes: {},
    radii: {},
    zIndices: {},
    colors: {
      gray100: 'hsl(0 0% 98.8%)',
      gray200: 'hsl(0 0% 96.0%)',
      gray300: 'hsl(0 0% 93.7%)',
      gray400: 'hsl(0 0% 92.0%)',

      slate100: 'hsl(206 20% 98.8%)',
      slate200: 'hsl(206 14% 96.0%)',
      slate300: 'hsl(206 13% 93.7%)',
      slate400: 'hsl(206 12% 92.0%)',

      panel: '$slate200',
    }
  }
});`

const code3Highlights = {
  one: '1-23',
  two: '20',
}

const demoCode4 = `const { theme } = createStitches({
  theme: {
    fonts: {},
    space: {},
    sizes: {},
    fontSizes: {},
    radii: {},
    zIndices: {},
  }
});`

export default function Home() {
  const [variantsCodeActiveHighlight, setVariantsCodeActiveHighlight] = React.useState('one')
  const [themingCodeActiveHighlight, setThemingCodeActiveHighlight] = React.useState('one')
  const [utilsCodeActiveHighlight, setUtilsCodeActiveHighlight] = React.useState('one')
  const [tokensActiveHighlight, setTokensCodeActiveHighlight] = React.useState('one')

  return (
    <VStack>
      <TitleAndMetaTags title="Stitches — CSS-in-JS with near-zero runtime" />
      <Header />
      <Hero />

      <FeaturesGrid />

      <VStack css={{ justifyContent: 'center' }}>
        <Divider size="2" />
      </VStack>

      <Community />
    </VStack>
  )
}
