import { View, styled } from '@tamagui/core'

export const Section = styled(View, {
  name: 'Section',
  render: 'section',
  flexDirection: 'column',
  role: 'region',
})

export const Article = styled(View, {
  name: 'Article',
  render: 'article',
  flexDirection: 'column',
})

export const Main = styled(View, {
  name: 'Main',
  render: 'main',
  flexDirection: 'column',
})

export const Header = styled(View, {
  name: 'Header',
  render: 'header',
  role: 'banner',
  flexDirection: 'column',
})

export const Aside = styled(View, {
  name: 'Aside',
  render: 'aside',
  flexDirection: 'column',
  // accessibilityRole: 'complementary',
})

export const Footer = styled(View, {
  name: 'Footer',
  render: 'footer',
  flexDirection: 'column',
  // accessibilityRole: 'contentinfo',
})

export const Nav = styled(View, {
  name: 'Nav',
  render: 'nav',
  flexDirection: 'column',
  // accessibilityRole: 'navigation',
})
