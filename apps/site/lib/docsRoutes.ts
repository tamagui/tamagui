import { DocsRoute } from 'types'

export const docsRoutes: DocsRoute[] = [
  {
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Releases', route: 'https://github.com/tamagui/tamagui/releases' },
    ],
  },

  {
    type: 'hr',
    title: 'Guides',
  },
  {
    pages: [{ title: 'Overview', route: '/docs/guides/overview' }],
  },
  {
    label: 'Setting up a pre-existing project',
    pages: [
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
      { title: 'Vite', route: '/docs/guides/vite' },
    ],
  },
  {
    label: 'Design Systems',
    pages: [
      { title: 'Introduction', route: '/docs/guides/design-systems' },
      { title: 'Building a button', route: '/docs/guides/how-to-build-a-button' },
      { title: 'Creating a custom theme', route: '/docs/guides/creating-custom-themes' },
    ],
  },
  {
    label: 'Developing with Tamagui',
    pages: [{ title: 'Developing', route: '/docs/guides/developing' }],
  },

  {
    type: 'hr',
    title: 'Core',
  },

  {
    pages: [
      { title: 'Configuration', route: '/docs/core/configuration' },
      { title: 'Stack & Text', route: '/docs/core/stack-and-text' },
      { title: 'Animations', route: '/docs/core/animations' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'FontLanguage', route: '/docs/core/font-language' },
      { title: 'Extras', route: '/docs/core/exports' },
    ],
  },

  {
    type: 'hr',
    title: 'Components',
  },
  {
    pages: [{ title: 'Overview', route: '/docs/components/overview' }],
  },
  {
    label: 'Basic',
    pages: [
      { title: 'Stacks', route: '/docs/components/stacks' },
      { title: 'Headings', route: '/docs/components/headings' },
      { title: 'Text', route: '/docs/components/text' },
    ],
  },
  {
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/docs/components/button' },
      { title: 'Checkbox', route: '/docs/components/checkbox' },
      { title: 'Form', route: '/docs/components/form' },
      { title: 'Input & TextArea', route: '/docs/components/inputs' },
      { title: 'Label', route: '/docs/components/label' },
      { title: 'Progress', route: '/docs/components/progress' },
      { title: 'RadioGroup', route: '/docs/components/radio-group' },
      { title: 'Select', route: '/docs/components/select' },
      { title: 'Slider', route: '/docs/components/slider' },
      { title: 'Switch', route: '/docs/components/switch' },
      { title: 'ToggleGroup', route: '/docs/components/toggle-group' },
    ],
  },
  {
    label: 'Panels',
    pages: [
      { title: 'AlertDialog', route: '/docs/components/alert-dialog' },
      { title: 'Dialog', route: '/docs/components/dialog' },
      { title: 'Popover', route: '/docs/components/popover' },
      { title: 'Sheet', route: '/docs/components/sheet' },
      { title: 'Tooltip', route: '/docs/components/tooltip' },
      { title: 'Toast', route: '/docs/components/toast' },
    ],
  },
  {
    label: 'Organize',
    pages: [
      { title: 'Accordion', route: '/docs/components/accordion' },
      { title: 'Group', route: '/docs/components/group' },
      { title: 'Tabs', route: '/docs/components/tabs' },
    ],
  },
  {
    label: 'Content',
    pages: [
      { title: 'Avatar', route: '/docs/components/avatar' },
      { title: 'Card', route: '/docs/components/card' },
      { title: 'Image', route: '/docs/components/image' },
      { title: 'ListItem', route: '/docs/components/list-item' },
    ],
  },
  {
    label: 'Visual',
    pages: [
      { title: 'LinearGradient', route: '/docs/components/linear-gradient' },
      { title: 'Separator', route: '/docs/components/separator' },
      { title: 'Square & Circle', route: '/docs/components/shapes' },
    ],
  },
  {
    label: 'Etc',
    pages: [
      { title: 'Anchor', route: '/docs/components/anchor' },
      { title: 'HTML Elements', route: '/docs/components/html-elements' },
      { title: 'ScrollView', route: '/docs/components/scroll-view' },
      { title: 'Spinner', route: '/docs/components/spinner' },
      { title: 'Unspaced', route: '/docs/components/unspaced' },
      { title: 'VisuallyHidden', route: '/docs/components/visually-hidden' },
    ],
  },

  {
    type: 'hr',
    title: 'Compiler',
  },

  {
    pages: [
      { title: 'About', route: '/docs/intro/why-a-compiler' },
      { title: 'Install', route: '/docs/intro/compiler-install' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
    ],
  },

  {
    type: 'hr',
    title: 'Theme',
  },
  {
    pages: [
      { title: 'Overview', route: '/docs/theme/overview' },
      { title: 'Theming', route: '/docs/theme/theming' },
      { title: 'useTheme', route: '/docs/theme/use-theme' },
      { title: 'Colors', route: '/docs/theme/colors' },
      { title: 'Tokens', route: '/docs/theme/tokens' },
    ],
  },

  {
    type: 'hr',
    title: 'Styling',
  },
  {
    pages: [
      { title: 'Overview', route: '/docs/styling/overview' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'styled', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
    ],
  },

  {
    type: 'hr',
    title: 'Extras',
  },
  {
    pages: [
      { title: 'Overview', route: '/docs/extras/overview' },
      { title: 'Lucide Icons', route: '/docs/components/lucide-icons' },
    ],
  },

  {
    type: 'hr',
    title: 'Community',
  },
  {
    pages: [
      { title: `Community`, route: '/community' },
      { title: `Blog`, route: '/blog' },
      { title: `GitHub`, route: 'https://github.com/tamagui/tamagui' },
      { title: `Twitter`, route: 'https://twitter.com/tamagui_js' },
      { title: `Discord`, route: 'https://discord.gg/4qh6tdcVDa' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => {
  switch (x.type) {
    case undefined:
      return x.pages
    default:
      return []
  }
})
