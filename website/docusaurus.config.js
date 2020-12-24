module.exports = {
  title: 'SnackUI',
  tagline: 'The UI Kit for React Native + Web that optimizes away',
  url: 'https://snackui.com',
  baseUrl: '/',
  favicon: 'img/favicon/favicon.ico',
  organizationName: 'snackui',
  projectName: 'snackui',
  themeConfig: {
    image: 'img/redux-logo-landscape.png',
    metadatas: [{ name: 'twitter:card', content: 'summary' }],
    prism: {
      additionalLanguages: ['typescript', 'tsx'],
      theme: require('prism-react-renderer/themes/dracula'),
    },
    colorMode: {
      disableSwitch: false,
    },
    navbar: {
      title: 'SnackUI',
      logo: {
        alt: 'SnackUI Logo',
        src: 'img/icon.svg',
      },
      items: [
        {
          label: 'Documentation',
          to: 'introduction/getting-started',
          position: 'right',
        },
        {
          label: 'GitHub',
          href: 'https://www.github.com/reduxjs/redux',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'introduction/getting-started',
            },
            {
              label: 'Tutorial',
              to: 'tutorials/essentials/part-1-overview-concepts',
            },
            {
              label: 'FAQ',
              to: 'faq',
            },
            {
              label: 'API Reference',
              to: 'api/api-reference',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'http://stackoverflow.com/questions/tagged/redux',
            },
            {
              label: 'Feedback',
              to: 'introduction/getting-started#help-and-discussion',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/dish/snackui',
            },
          ],
        },
      ],
      logo: {
        alt: 'SnackUI Logo',
        src: 'img/icon.svg',
        href: 'https://snackui.com/',
      },
      copyright: `Copyright © 2015–${new Date().getFullYear()} Nate Wienert.`,
    },
    algolia: {
      apiKey: 'dd7f55e0ff2120d19e5a53ad605cae2c',
      indexName: 'snackui',
      algoliaOptions: {},
    },
    googleAnalytics: {
      trackingID: '',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
