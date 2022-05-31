export const docsRoutes = [
  {
    type: 'hr',
    title: 'Get Started',
  },

  {
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Configuration', route: '/docs/intro/configuration' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
      { title: 'Releases', route: 'https://github.com/tamagui/tamagui/releases' },
    ],
  },

  {
    type: 'hr',
    title: 'Core',
  },

  {
    pages: [
      { title: 'styled', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
      { title: 'Animations', route: '/docs/core/animations' },
      { title: 'Stack & Text', route: '/docs/core/stack-and-text' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
    ],
  },

  {
    type: 'hr',
    title: 'Tamagui',
  },

  {
    label: 'Base',
    pages: [
      { title: 'Button', route: '/docs/components/button' },
      { title: 'Separator', route: '/docs/components/separator' },
      { title: 'Stacks', route: '/docs/components/stacks' },
    ],
  },

  {
    label: 'Text',
    pages: [
      { title: 'Headings', route: '/docs/components/headings' },
      { title: 'Paragraph', route: '/docs/components/text' },
    ],
  },

  {
    label: 'Forms',
    pages: [
      { title: 'Input & Textarea', route: '/docs/components/inputs' },
      { title: 'Label', route: '/docs/components/label' },
      { title: 'Progress', route: '/docs/components/progress' },
      { title: 'Slider', route: '/docs/components/slider' },
      { title: 'Switch', route: '/docs/components/switch' },
    ],
  },

  {
    label: 'Content',
    pages: [
      { title: 'Card', route: '/docs/components/card' },
      { title: 'Image', route: '/docs/components/image' },
    ],
  },

  {
    label: 'Panels',
    pages: [
      { title: 'Popover', route: '/docs/components/popover' },
      { title: 'Tooltip', route: '/docs/components/tooltip' },
    ],
  },

  {
    label: 'Misc',
    pages: [
      { title: 'Anchor', route: '/docs/components/anchor' },
      { title: 'HTML Elements', route: '/docs/components/html-elements' },
      { title: 'LinearGradient', route: '/docs/components/linear-gradient' },
      { title: 'Shapes', route: '/docs/components/shapes' },
      { title: 'Spinner', route: '/docs/components/spinner' },
      { title: 'VisuallyHidden', route: '/docs/components/visually-hidden' },
    ],
  },

  {
    type: 'hr',
    title: 'Extras',
  },

  {
    pages: [
      { title: 'Drawer', route: '/docs/components/drawer' },
      // { title: 'Menu', route: '/docs/components/menu' },
      { title: 'Feather Icons', route: '/docs/components/feather-icons' },
    ],
  },

  {
    type: 'hr',
    title: 'Guides',
  },

  {
    pages: [
      { title: 'Design Systems', route: '/docs/guides/design-systems' },
      { title: 'Developing', route: '/docs/guides/developing' },
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
      { title: 'create-tamagui-app', route: '/docs/guides/create-tamagui-app' },
    ],
  },

  {
    type: 'hr',
    title: 'Community',
  },

  {
    pages: [
      { title: `Blog`, route: '/blog' },
      { title: `GitHub`, route: 'https://github.com/tamagui/tamagui' },
      { title: `Twitter`, route: 'https://twitter.com/tamagui_js' },
      { title: `Discord`, route: 'https://discord.gg/4qh6tdcVDa' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages || [])
