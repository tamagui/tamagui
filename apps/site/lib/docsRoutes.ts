export const docsRoutes = [
  {
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
      { title: 'Releases', route: 'https://github.com/tamagui/tamagui/releases' },
    ],
  },

  // {
  //   type: 'hr',
  //   title: 'Static',
  // },

  // {
  //   pages: [{ title: 'Static', route: '/docs/core/static' }],
  // },

  {
    type: 'hr',
    title: 'Core',
  },

  {
    pages: [
      { title: 'Configuration', route: '/docs/core/configuration' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'styled', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
      { title: 'Animations', route: '/docs/core/animations' },
      { title: 'Stack & Text', route: '/docs/core/stack-and-text' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
      { title: 'FontLanguage', route: '/docs/core/font-language' },
      { title: 'Extras', route: '/docs/core/exports' },
    ],
  },

  {
    type: 'hr',
    title: 'Tamagui',
  },

  {
    pages: [
      { title: 'Stacks', route: '/docs/components/stacks' },
      { title: 'Headings', route: '/docs/components/headings' },
      { title: 'Paragraph', route: '/docs/components/text' },
    ],
  },

  {
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/docs/components/button' },
      { title: 'Text Inputs', route: '/docs/components/inputs' },
      { title: 'Label', route: '/docs/components/label' },
      { title: 'Progress', route: '/docs/components/progress' },
      { title: 'Select', route: '/docs/components/select' },
      { title: 'Slider', route: '/docs/components/slider' },
      { title: 'Switch', route: '/docs/components/switch' },
    ],
  },

  {
    label: 'Panels',
    pages: [
      { title: 'AlertDialog', route: '/docs/components/alert-dialog' },
      { title: 'Dialog', route: '/docs/components/dialog' },
      { title: 'Popover', route: '/docs/components/popover' },
      // { title: 'Portal', route: '/docs/components/portal' },
      { title: 'Sheet', route: '/docs/components/sheet' },
      { title: 'Tooltip', route: '/docs/components/tooltip' },
    ],
  },

  {
    label: 'Content',
    pages: [
      { title: 'Avatar', route: '/docs/components/avatar' },
      { title: 'Card', route: '/docs/components/card' },
      { title: 'Group', route: '/docs/components/group' },
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
      { title: 'Spinner', route: '/docs/components/spinner' },
      { title: 'Unspaced', route: '/docs/components/unspaced' },
      { title: 'VisuallyHidden', route: '/docs/components/visually-hidden' },
    ],
  },

  {
    type: 'hr',
    title: 'Extras',
  },

  {
    pages: [{ title: 'Feather Icons', route: '/docs/components/feather-icons' }],
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
      { title: 'Vite', route: '/docs/guides/vite' },
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
