import { Stack, styled } from '@tamagui/core'

export const Section = styled(Stack, {
  name: 'Section',
  tag: 'section',
  flexDirection: 'column',
  accessibilityRole: 'summary',
})

export const Article = styled(Stack, {
  name: 'Article',
  tag: 'article',
  flexDirection: 'column',
})

export const Main = styled(Stack, {
  name: 'Main',
  tag: 'main',
  flexDirection: 'column',
})

export const Header = styled(Stack, {
  name: 'Header',
  tag: 'header',
  accessibilityRole: 'header',
  flexDirection: 'column',
})

export const Aside = styled(Stack, {
  name: 'Aside',
  tag: 'aside',
  flexDirection: 'column',
  // accessibilityRole: 'complementary',
})

export const Footer = styled(Stack, {
  name: 'Footer',
  tag: 'footer',
  flexDirection: 'column',
  // accessibilityRole: 'contentinfo',
})

export const Nav = styled(Stack, {
  name: 'Nav',
  tag: 'nav',
  flexDirection: 'column',
  // accessibilityRole: 'navigation',
})
