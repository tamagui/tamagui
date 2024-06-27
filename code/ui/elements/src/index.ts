import { View, styled } from '@tamagui/core'

export const Section = styled(View, {
  name: 'Section',
  tag: 'section',
  flexDirection: 'column',
  accessibilityRole: 'summary',
})

export const Article = styled(View, {
  name: 'Article',
  tag: 'article',
  flexDirection: 'column',
})

export const Main = styled(View, {
  name: 'Main',
  tag: 'main',
  flexDirection: 'column',
})

export const Header = styled(View, {
  name: 'Header',
  tag: 'header',
  accessibilityRole: 'header',
  flexDirection: 'column',
})

export const Aside = styled(View, {
  name: 'Aside',
  tag: 'aside',
  flexDirection: 'column',
  // accessibilityRole: 'complementary',
})

export const Footer = styled(View, {
  name: 'Footer',
  tag: 'footer',
  flexDirection: 'column',
  // accessibilityRole: 'contentinfo',
})

export const Nav = styled(View, {
  name: 'Nav',
  tag: 'nav',
  flexDirection: 'column',
  // accessibilityRole: 'navigation',
})
