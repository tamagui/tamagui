import { Stack, StackProps, styled } from '@tamagui/core'

export const Section = styled(Stack, {
  tag: 'section',
  flexDirection: 'column',
  accessibilityRole: 'summary',
})

export const Article = styled(Stack, {
  tag: 'article',
  flexDirection: 'column',
})

export const Main = styled(Stack, {
  tag: 'main',
  flexDirection: 'column',
})

export const Header = styled(Stack, {
  tag: 'header',
  accessibilityRole: 'header',
  flexDirection: 'column',
})

export const Aside = styled(Stack, {
  tag: 'aside',
  flexDirection: 'column',
  // accessibilityRole: 'complementary',
})

export const Footer = styled(Stack, {
  tag: 'footer',
  flexDirection: 'column',
  // accessibilityRole: 'contentinfo',
})

export const Nav = styled(Stack, {
  tag: 'nav',
  flexDirection: 'column',
  // accessibilityRole: 'navigation',
})
