export const docsRoutes = [
  {
    pages: [
      { title: 'Introduction', route: '/docs/introduction' },
      { title: 'Installation', route: '/docs/installation' },
      { title: 'Configuration', route: '/docs/configuration' },
      { title: 'Features', route: '/docs/features' },
      { title: 'Guides', route: '/docs/guides' },
      { title: 'Status', route: '/docs/status' },
      { title: 'FAQ', route: '/docs/faq' },
    ],
  },

  {
    title: 'Routing',
    pages: [
      { title: 'Overview', route: '/docs/routing' },
      { title: 'Modes', route: '/docs/routing-modes' },
      { title: 'Exports', route: '/docs/routing-exports' },
      { title: 'Navigation', route: '/docs/routing-navigation' },
      { title: 'Layouts', route: '/docs/routing-layouts' },
      { title: 'Loaders', route: '/docs/routing-loader' },
    ],
  },

  {
    title: 'CLI',
    pages: [
      { title: 'Dev', route: '/docs/one-dev' },
      { title: 'Build', route: '/docs/one-build' },
      { title: 'Serve', route: '/docs/one-serve' },
    ],
  },

  {
    title: 'Data',
    pages: [{ title: 'Introduction', route: '/docs/data' }],
  },

  {
    title: 'Layout',
    pages: [
      { title: 'Stack', route: '/docs/components-Stack' },
      { title: 'Slot', route: '/docs/components-Slot' },
      { title: 'Drawer', route: '/docs/components-Drawer' },
      { title: 'Tabs', route: '/docs/components-Tabs' },
    ],
  },

  {
    title: 'Components',
    pages: [
      { title: 'Link', route: '/docs/components-Link' },
      // { title: 'Head', route: '/docs/components-Head' },
      { title: 'Redirect', route: '/docs/components-Redirect' },
      { title: 'LoadProgressBar', route: '/docs/components-LoadProgressBar' },
      { title: 'ScrollRestoration', route: '/docs/components-ScrollRestoration' },
      { title: 'SafeAreaView', route: '/docs/components-SafeAreaView' },
    ],
  },

  {
    title: 'Hooks',
    pages: [
      { title: 'useActiveParams', route: '/docs/hooks-useActiveParams' },
      { title: 'useFocusEffect', route: '/docs/hooks-useFocusEffect' },
      { title: 'useLinkTo', route: '/docs/hooks-useLinkTo' },
      { title: 'useLoader', route: '/docs/hooks-useLoader' },
      { title: 'useNavigation', route: '/docs/hooks-useNavigation' },
      { title: 'useParams', route: '/docs/hooks-useParams' },
      { title: 'usePathname', route: '/docs/hooks-usePathname' },
      { title: 'useRouter', route: '/docs/hooks-useRouter' },
    ],
  },

  {
    title: 'Etc',
    pages: [
      { title: 'Utility Functions', route: '/docs/helpers-utility-functions' },
      { title: 'Common Issues', route: '/docs/common-issues' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages || [])
export const allNotPending = allDocsRoutes.filter((x) => !x['pending'])
