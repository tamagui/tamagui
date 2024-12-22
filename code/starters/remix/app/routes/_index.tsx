import type { MetaFunction } from '@remix-run/node'
import { styled, Text, View } from '@tamagui/web'
import { useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Tamagui with Remix' },
    {
      name: 'description',
      content: 'A demo showcasing Tamagui working with Remix.',
    },
  ]
}

const Section = styled(View, {
  tag: 'section',
  padding: '$large',
  gap: '$large',
  $smallScreen: {
    padding: '$medium',
  },
  $mediumScreen: {
    padding: '$large',
    maxWidth: 600,
  },
  $largeScreen: {
    padding: '$extraLarge',
  },
})

const ButtonOuter = styled(View, {
  tag: 'button',
  themeInverse: true,
  backgroundColor: '$background',
  borderRadius: '$medium',
  cursor: 'pointer',
  padding: '$medium',
  maxWidth: 'fit-content',
  display: 'unset',
  pressStyle: {
    opacity: 0.8,
  },
  hoverStyle: {
    opacity: 0.9,
  },
})

const ButtonText = styled(Text, {
  fontWeight: 'bold',
  textAlign: 'center',
  tag: 'span',
})

export default function Index() {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return (
    <View
      theme={theme}
      flexDirection="column"
      gap={16}
      backgroundColor="$background"
      minHeight="100vh"
    >
      <View
        tag="header"
        padding="$large"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Text
          tag="h1"
          fontSize={24}
          $largeScreen={{
            fontSize: 32,
          }}
        >
          Welcome to Tamagui with Remix
        </Text>
      </View>
      <Section>
        <Text
          tag="h2"
          fontSize={24}
          $largeScreen={{
            fontSize: 32,
          }}
        >
          Introduction
        </Text>
        <Text>
          This is a demo page to showcase how Tamagui works seamlessly with Remix.
        </Text>
      </Section>
      <Section>
        <Text
          tag="h2"
          fontSize={24}
          $largeScreen={{
            fontSize: 32,
          }}
        >
          Features
        </Text>
        <Text>
          Tamagui provides a powerful and flexible way to style your React components.
          With Tamagui, you can leverage themes to create a consistent look and feel
          across your application. Theming in Tamagui is highly customizable, allowing you
          to define colors, spacing, typography, and more. You can easily switch between
          light and dark themes, or create your own custom themes to match your brand.
        </Text>
      </Section>
      <Section>
        <Text
          tag="h2"
          fontSize={24}
          $largeScreen={{
            fontSize: 32,
          }}
        >
          Works with themes
        </Text>
        <Text>
          Tamagui&apos;s styling system is designed to work with Remix out of the box.
          Server-render initial styles and themes.
        </Text>
        <ButtonOuter onPress={toggleTheme}>
          <ButtonText>Toggle Theme</ButtonText>
        </ButtonOuter>
      </Section>
      <Section>
        <Text
          tag="h2"
          fontSize={24}
          $largeScreen={{
            fontSize: 32,
          }}
        >
          Go Native
        </Text>
        <Text>
          One of the standout features of Tamagui is its ability to seamlessly port your
          components to React Native. This means you can write your components once and
          run them on both web and mobile platforms. Tamagui&apos;s styling system is
          designed to work with React Native out of the box, so you can take advantage of
          native performance and capabilities without having to rewrite your components.
        </Text>
      </Section>
      <View
        tag="footer"
        padding="$large"
        justifyContent="center"
        marginTop="auto"
        paddingTop={100}
      >
        <Text
          tag="p"
          fontSize={16}
          $largeScreen={{
            fontSize: '$3',
          }}
        >
          © {new Date().getFullYear()} Tamagui with Remix.
        </Text>
      </View>
    </View>
  )
}
