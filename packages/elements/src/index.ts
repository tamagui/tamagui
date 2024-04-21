import { View, styled } from '@tamagui/core'

export const Section = styled(
  View,
  {
    tag: 'section',
    flexDirection: 'column',
    accessibilityRole: 'summary',
  },
  {
    name: 'Section',
  }
)

export const Article = styled(
  View,
  {
    tag: 'article',
    flexDirection: 'column',
  },
  {
    name: 'Article',
  }
)

export const Main = styled(
  View,
  {
    tag: 'main',
    flexDirection: 'column',
  },
  {
    name: 'Main',
  }
)

export const Header = styled(
  View,
  {
    tag: 'header',
    accessibilityRole: 'header',
    flexDirection: 'column',
  },
  {
    name: 'Header',
  }
)

export const Aside = styled(
  View,
  {
    tag: 'aside',
    flexDirection: 'column',
    // accessibilityRole: 'complementary',
  },
  {
    name: 'Aside',
  }
)

export const Footer = styled(
  View,
  {
    tag: 'footer',
    flexDirection: 'column',
    // accessibilityRole: 'contentinfo',
  },
  {
    name: 'Footer',
  }
)

export const Nav = styled(
  View,
  {
    tag: 'nav',
    flexDirection: 'column',
    // accessibilityRole: 'navigation',
  },
  {
    name: 'Nav',
  }
)
