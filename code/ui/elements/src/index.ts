import { View, styled } from '@tamagui/core'

export const Section = styled(View, {
  displayName: 'Section',
  render: 'section',
  flexDirection: 'column',
  role: 'region',
})

export const Article = styled(View, {
  displayName: 'Article',
  render: 'article',
  flexDirection: 'column',
})

export const Main = styled(View, {
  displayName: 'Main',
  render: 'main',
  flexDirection: 'column',
})

export const Header = styled(View, {
  displayName: 'Header',
  render: 'header',
  role: 'banner',
  flexDirection: 'column',
})

export const Aside = styled(View, {
  displayName: 'Aside',
  render: 'aside',
  flexDirection: 'column',
  // accessibilityRole: 'complementary',
})

export const Footer = styled(View, {
  displayName: 'Footer',
  render: 'footer',
  flexDirection: 'column',
  // accessibilityRole: 'contentinfo',
})

export const Nav = styled(View, {
  displayName: 'Nav',
  render: 'nav',
  flexDirection: 'column',
  // accessibilityRole: 'navigation',
})
