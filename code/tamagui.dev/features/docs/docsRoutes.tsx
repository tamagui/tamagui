export const docsRoutes = [
  // top area - always visible, no accordion
  {
    section: 'core',
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Components', route: '/docs/intro/components' },
      { title: 'Styling', route: '/docs/intro/styles' },
      { title: 'Design system', route: '/docs/intro/design-system' },
      { title: 'Tailwind', route: '/docs/core/tailwind' },
      { title: 'Native', route: '/docs/core/native' },
      { title: 'CLI', route: '/docs/core/cli' },
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
      { title: 'TamaguiProvider', route: '/docs/core/tamagui-provider' },
      { title: 'Tokens', route: '/docs/core/tokens' },
      { title: 'Fonts', route: '/docs/core/fonts' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Theme component', route: '/docs/core/theme' },
      { title: 'Shorthands', route: '/docs/core/shorthands' },
      { title: 'Settings', route: '/docs/core/settings' },
    ],
  },

  {
    section: 'core',
    title: 'Config v6',
    pages: [
      { title: 'Config v6', route: '/docs/core/config-v6' },
      { title: 'Colors', route: '/docs/core/config-v6-colors' },
      { title: 'Surfaces & Levels', route: '/docs/core/surfaces' },
    ],
  },

  // Styling section
  {
    section: 'core',
    title: 'Styling',
    pages: [
      { title: 'Style props', route: '/docs/core/style-props' },
      { title: 'styled()', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
      { title: 'style()', route: '/docs/core/style-pieces' },
      { title: 'createStyledContext()', route: '/docs/core/create-styled-context' },
    ],
  },

  // Components section
  {
    section: 'core',
    title: 'Components',
    pages: [
      { title: 'View & Text', route: '/docs/core/view-and-text' },
      { title: 'HTML primitives', route: '/docs/core/html-primitives' },
    ],
  },

  // exports section
  {
    section: 'core',
    title: 'Exports',
    pages: [
      { title: 'Overview', route: '/docs/core/exports' },
      { title: 'Constants', route: '/docs/core/exports#constants' },
      { title: 'Helpers', route: '/docs/core/exports#helpers' },
      { title: 'Hooks', route: '/docs/core/exports#hooks' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
      { title: 'Components', route: '/docs/core/exports#components' },
      { title: 'Type Helpers', route: '/docs/core/exports#type-helpers' },
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
      { title: 'Compiler tiers', route: '/docs/core/compiler-tiers' },
      { title: 'Zero-runtime mode', route: '/docs/guides/zero-runtime' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
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
      { title: 'Upgrading to v3', route: '/docs/guides/how-to-upgrade' },
      { title: 'Flat Conditional Values', route: '/docs/guides/flat-values' },
      { title: 'Custom UI Package', route: '/docs/guides/design-systems' },
      { title: 'Creating Custom Themes', route: '/docs/guides/theme-builder' },
      {
        title: 'How to Build a Button',
        route: '/docs/guides/how-to-build-a-button',
      },
      { title: 'Developing', route: '/docs/guides/developing' },
      { title: 'create-tamagui', route: '/docs/guides/create-tamagui-app' },
      { title: 'Server Rendering', route: '/docs/core/server-rendering' },
    ],
  },

  // UI:

  {
    section: 'ui',
    // title: 'tamagui',
    pages: [
      { title: 'Install', route: '/ui/intro' },
      { title: 'Native', route: '/ui/native' },
      { title: 'Stacking (zIndex)', route: '/ui/z-index' },
    ],
  },

  {
    section: 'ui',
    label: 'Base',
    pages: [
      { title: 'Stacks', route: '/ui/stacks' },
      { title: 'Surface', route: '/ui/surface' },
      { title: 'Headings', route: '/ui/headings' },
      { title: 'Text', route: '/ui/text' },
      { title: 'ScrollView', route: '/ui/scroll-view' },
      { title: 'Group', route: '/ui/group' },
      { title: 'FocusScope', route: '/ui/focus-scope' },
    ],
  },

  {
    section: 'ui',
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/ui/button' },
      { title: 'Checkbox', route: '/ui/checkbox' },
      { title: 'Field', route: '/ui/field' },
      { title: 'Form', route: '/ui/form' },
      { title: 'Input & TextArea', route: '/ui/inputs' },
      { title: 'Label', route: '/ui/label' },
      { title: 'Progress', route: '/ui/progress' },
      { title: 'RadioGroup', route: '/ui/radio-group' },
      { title: 'Select', route: '/ui/select' },
      { title: 'Slider', route: '/ui/slider' },
      { title: 'Switch', route: '/ui/switch' },
      { title: 'ToggleGroup', route: '/ui/toggle-group' },
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
      { title: 'Accordion', route: '/ui/accordion' },
      { title: 'AlertDialog', route: '/ui/alert-dialog' },
      { title: 'Dialog', route: '/ui/dialog' },
      { title: 'Popover', route: '/ui/popover' },
      { title: 'Sheet', route: '/ui/sheet' },
      { title: 'Tabs', route: '/ui/tabs' },
      { title: 'Tooltip', route: '/ui/tooltip' },
      { title: 'Toast', route: '/ui/toast' },
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
    section: 'ui',
    label: 'Functional',
    pages: [
      { title: 'Anchor', route: '/ui/anchor' },
      { title: 'Portal', route: '/ui/portal' },
      { title: 'Unspaced', route: '/ui/unspaced' },
      { title: 'VisuallyHidden', route: '/ui/visually-hidden' },
    ],
  },

  {
    label: 'Visual',
    section: 'ui',
    pages: [
      { title: 'LinearGradient', route: '/ui/linear-gradient' },
      { title: 'Lucide Icons', route: '/ui/lucide-icons' },
      { title: 'Separator', route: '/ui/separator' },
      { title: 'Spinner', route: '/ui/spinner' },
      { title: 'Square & Circle', route: '/ui/shapes' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages || [])
// section anchors belong in the sidebar, not page-to-page navigation
export const allNotPending = allDocsRoutes.filter(
  (x) => !x['pending'] && !x.route.includes('#')
)
