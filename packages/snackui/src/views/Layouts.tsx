import { createComponent } from '../createComponent'
import { isWeb } from '../platform'
import { defaults } from './Stacks'

export const Section = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'section',
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'summary',
    }),
  },
})

export const Article = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'article',
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'article',
    }),
  },
})

export const Main = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'main',
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'main',
    }),
  },
})

export const Header = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'header',
    flexDirection: 'column',
    accessibilityRole: isWeb ? 'banner' : 'header',
  },
})

export const Aside = createComponent({
  defaultProps: {
    ...defaults,
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'complementary',
    }),
  },
})

export const Footer = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'footer',
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'contentinfo',
    }),
  },
})

export const Nav = createComponent({
  defaultProps: {
    ...defaults,
    // as: 'nav',
    flexDirection: 'column',
    ...(isWeb && {
      accessibilityRole: 'navigation',
    }),
  },
})
