import type { MetaFunction } from 'react-router'
import { styled, Text, type ThemeName, View } from 'tamagui'
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
  render: 'section',
  p: '6 sm:4 md:6 lg:8',
  gap: '6',
  maxW: 'md:600px',
})

const ButtonOuter = styled(View, {
  render: 'button',
  bg: 'background',
  rounded: '4',
  cursor: 'pointer',
  p: '4',
  maxW: 'fit-content' as any,
  display: 'unset',
  opacity: 'hover:0.9 press:0.8',
})

const ButtonText = styled(Text, {
  fontWeight: 'bold',
  text: 'center',
  render: 'span',
})

export default function Index() {
  const [theme, setTheme] = useState<ThemeName>('light')
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return (
    <View theme={theme} flexDirection="column" gap={16} bg="background" minH="100vh">
      <View render="header" p="6" borderBottomWidth={1} borderBottomColor="border-color">
        <Text render="h1" fontSize="24px lg:32px">
          Welcome to Tamagui with Remix
        </Text>
      </View>
      <Section>
        <Text render="h2" fontSize="24px lg:32px">
          Introduction
        </Text>
        <Text>
          This is a demo page to showcase how Tamagui works seamlessly with Remix.
        </Text>
      </Section>
      <Section>
        <Text render="h2" fontSize="24px lg:32px">
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
        <Text render="h2" fontSize="24px lg:32px">
          Works with themes
        </Text>
        <Text>
          Tamagui&apos;s styling system is designed to work with Remix out of the box.
          Server-render initial styles and themes.
        </Text>
        <ButtonOuter onPress={toggleTheme} theme="accent">
          <ButtonText>Toggle Theme</ButtonText>
        </ButtonOuter>
      </Section>
      <Section>
        <Text render="h2" fontSize="24px lg:32px">
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
      <View render="footer" p="6" justify="center" mt="auto" pt={100}>
        <Text render="p" fontSize="16px lg:3">
          &copy; {new Date().getFullYear()} Tamagui with Remix.
        </Text>
      </View>
    </View>
  )
}
