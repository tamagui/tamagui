import { Figma } from '@tamagui/lucide-icons'
import { GithubIcon } from '~/features/icons/GithubIcon'

export const docsRoutes = [
  {
    isUI: false,
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      // { title: 'Thinking in Tamagui', route: '/docs/intro/thinking-in-tamagui' },
      // { title: 'Comparison', route: '/docs/intro/comparison' },
      {
        title: 'Releases',
        route: 'https://github.com/tamagui/tamagui/releases',
      },
    ],
  },

  {
    isUI: false,
    title: 'Core',
    pages: [
      { title: 'Configuration', route: '/docs/core/configuration' },
      { title: '@tamagui/config', route: '/docs/core/config-v4' },
      { title: 'Tokens', route: '/docs/core/tokens' },
      { title: 'View & Text', route: '/docs/core/stack-and-text' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'Styles', route: '/docs/intro/styles' },
      { title: 'styled()', route: '/docs/core/styled' },
      { title: 'Variants', route: '/docs/core/variants' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Animations', route: '/docs/core/animations' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
      { title: 'FontLanguage', route: '/docs/core/font-language' },
      { title: 'Extras', route: '/docs/core/exports' },
    ],
  },

  {
    isUI: false,
    title: 'Compiler',
    pages: [
      { title: 'Background', route: '/docs/intro/why-a-compiler' },
      { title: 'Installation', route: '/docs/intro/compiler-install' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
    ],
  },

  {
    title: 'Guides',
    isUI: false,
    pages: [
      { title: 'Creating Custom Themes', route: '/docs/guides/theme-builder' },
      {
        title: 'How to Build a Button',
        route: '/docs/guides/how-to-build-a-button',
      },
      { title: 'Developing', route: '/docs/guides/developing' },
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
      { title: 'Vite', route: '/docs/guides/vite' },
      { title: 'One', route: '/docs/guides/one' },
      { title: 'Webpack', route: '/docs/guides/webpack' },
      { title: 'Metro', route: '/docs/guides/metro' },
      { title: 'create-tamagui', route: '/docs/guides/create-tamagui-app' },
    ],
  },

  {
    isUI: false,
    title: 'Community',
    pages: [
      { title: `Community`, route: '/community' },
      { title: `Blog`, route: '/blog' },
      {
        title: 'Figma',
        icon: Figma,
        route: 'https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1',
      },
      {
        title: `GitHub`,
        icon: () => (
          <GithubIcon width={16} height={16} style={{ margin: '0 0 -2.5px 2px' }} />
        ),
        route: 'https://github.com/tamagui/tamagui',
      },
      { title: `X`, route: 'https://x.com/tamagui_js' },
      { title: `Discord`, route: 'https://discord.gg/4qh6tdcVDa' },
    ],
  },

  // UI:

  {
    isUI: true,
    // title: '@tamagui/ui',
    pages: [
      { title: 'Install', route: '/ui/intro' },
      { title: 'Stacks', route: '/ui/stacks' },
      { title: 'Headings', route: '/ui/headings' },
      { title: 'Text', route: '/ui/text' },
    ],
  },

  {
    isUI: true,
    label: 'Forms',
    pages: [
      { title: 'Button', route: '/ui/button' },
      { title: 'Checkbox', route: '/ui/checkbox' },
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
    isUI: true,
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
    isUI: true,
    label: 'Organize',
    pages: [
      { title: 'Accordion', route: '/ui/accordion' },
      { title: 'Group', route: '/ui/group' },
      { title: 'Tabs', route: '/ui/tabs' },
    ],
  },

  {
    isUI: true,
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
    isUI: true,
    pages: [
      { title: 'LinearGradient', route: '/ui/linear-gradient' },
      { title: 'Separator', route: '/ui/separator' },
      { title: 'Square & Circle', route: '/ui/shapes' },
    ],
  },

  {
    title: 'Extras',
    isUI: false,
    pages: [{ title: 'Lucide Icons', route: '/ui/lucide-icons' }],
  },

  {
    label: 'Etc',
    isUI: true,
    pages: [
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
