export const docsRoutes = [
  // top area - always visible, no accordion
  {
    section: 'core',
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'CLI', route: '/docs/guides/cli' },
      {
        title: 'Releases',
        route: 'https://github.com/tamagui/tamagui/releases',
      },
    ],
  },

  // Configuration section
  {
    section: 'core',
    title: 'Configuration',
    pages: [
      { title: 'Configuration', route: '/docs/core/configuration' },
      { title: 'Config v5', route: '/docs/core/config-v5' },
      { title: 'Tokens', route: '/docs/core/tokens' },
      { title: 'Themes', route: '/docs/intro/themes' },
    ],
  },

  // Styling section
  {
    section: 'core',
    title: 'Styling',
    pages: [
      { title: 'Styling', route: '/docs/intro/styles' },
      { title: 'styled()', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
      { title: 'createStyledContext', route: '/docs/core/create-styled-context' },
    ],
  },

  // Components section
  {
    section: 'core',
    title: 'Components',
    pages: [
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'View & Text', route: '/docs/core/view-and-text' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'FontLanguage', route: '/docs/core/font-language' },
    ],
  },

  // Hooks section
  {
    section: 'core',
    title: 'Hooks',
    pages: [
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
    ],
  },

  // Animations section
  {
    title: 'Animations',
    section: 'core',
    pages: [
      { title: 'Overview', route: '/docs/core/animations' },
      { title: 'AnimatePresence', route: '/docs/core/animate-presence' },
      { title: 'Animation Drivers', route: '/docs/core/animation-drivers' },
    ],
  },

  // Compiler section
  {
    section: 'core',
    title: 'Compiler',
    pages: [
      { title: 'Installation', route: '/docs/intro/compiler-install' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
      { title: 'Background', route: '/docs/intro/why-a-compiler' },
    ],
  },

  // Bundlers section
  {
    title: 'Bundlers',
    section: 'core',
    pages: [
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
      { title: 'Vite', route: '/docs/guides/vite' },
      { title: 'One', route: '/docs/guides/one' },
      { title: 'Webpack', route: '/docs/guides/webpack' },
      { title: 'Metro', route: '/docs/guides/metro' },
    ],
  },

  // Guides section
  {
    title: 'Guides',
    section: 'core',
    pages: [
      { title: 'Creating Custom Themes', route: '/docs/guides/theme-builder' },
      {
        title: 'How to Build a Button',
        route: '/docs/guides/how-to-build-a-button',
      },
      { title: 'Developing', route: '/docs/guides/developing' },
      { title: 'create-tamagui', route: '/docs/guides/create-tamagui-app' },
      { title: 'Server Rendering', route: '/docs/core/server-rendering' },
      { title: 'Extras', route: '/docs/core/exports' },
    ],
  },

  // UI:

  {
    section: 'ui',
    // title: 'tamagui',
    pages: [
      { title: 'Install', route: '/ui/intro' },
      { title: 'Stacks', route: '/ui/stacks' },
      { title: 'Headings', route: '/ui/headings' },
      { title: 'Text', route: '/ui/text' },
      { title: 'Native', route: '/ui/native' },
    ],
  },

  {
    section: 'ui',
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/ui/button' },
      { title: 'Input & TextArea', route: '/ui/inputs' },
      { title: 'Select', route: '/ui/select' },
      { title: 'RadioGroup', route: '/ui/radio-group' },
      { title: 'Checkbox', route: '/ui/checkbox' },
      { title: 'Label', route: '/ui/label' },
      { title: 'Progress', route: '/ui/progress' },
      { title: 'Slider', route: '/ui/slider' },
      { title: 'Switch', route: '/ui/switch' },
      { title: 'ToggleGroup', route: '/ui/toggle-group' },
      { title: 'Form', route: '/ui/form' },
    ],
  },

  {
    section: 'ui',
    label: 'Menus',
    pages: [
      { title: 'Menu', route: '/ui/menu' },
      { title: 'ContextMenu', route: '/ui/context-menu' },
    ],
  },

  {
    section: 'ui',
    label: 'Panels',
    pages: [
      { title: 'AlertDialog', route: '/ui/alert-dialog' },
      { title: 'Dialog', route: '/ui/dialog' },
      { title: 'Popover', route: '/ui/popover' },
      { title: 'Sheet', route: '/ui/sheet' },
      { title: 'Tooltip', route: '/ui/tooltip' },
      { title: 'Toast', route: '/ui/toast' },
    ],
  },

  {
    section: 'ui',
    label: 'Organize',
    pages: [
      { title: 'Accordion', route: '/ui/accordion' },
      { title: 'Group', route: '/ui/group' },
      { title: 'Tabs', route: '/ui/tabs' },
    ],
  },

  {
    section: 'ui',
    label: 'Content',
    pages: [
      { title: 'Avatar', route: '/ui/avatar' },
      { title: 'Card', route: '/ui/card' },
      { title: 'Image', route: '/ui/image' },
      { title: 'ListItem', route: '/ui/list-item' },
    ],
  },

  {
    label: 'Visual',
    section: 'ui',
    pages: [
      { title: 'LinearGradient', route: '/ui/linear-gradient' },
      { title: 'Separator', route: '/ui/separator' },
      { title: 'Square & Circle', route: '/ui/shapes' },
    ],
  },

  {
    label: 'Etc',
    section: 'ui',
    pages: [
      { title: 'Lucide Icons', route: '/ui/lucide-icons' },
      { title: 'FocusScope', route: '/ui/focus-scope' },
      { title: 'Anchor', route: '/ui/anchor' },
      { title: 'HTML Elements', route: '/ui/html-elements' },
      { title: 'ScrollView', route: '/ui/scroll-view' },
      { title: 'Spinner', route: '/ui/spinner' },
      { title: 'Unspaced', route: '/ui/unspaced' },
      { title: 'VisuallyHidden', route: '/ui/visually-hidden' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages || [])
export const allNotPending = allDocsRoutes.filter((x) => !x['pending'])
