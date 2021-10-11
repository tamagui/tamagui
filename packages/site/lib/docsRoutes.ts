export const docsRoutes = [
  {
    label: 'Overview',
    pages: [
      { title: 'Introduction', slug: 'docs/introduction' },
      { title: 'Tutorials', slug: 'docs/tutorials' },
      { title: 'API', slug: 'docs/api' },
      { title: 'Frequently asked questions', slug: 'docs/frequently-asked-questions' },
      { title: 'Benchmarks', slug: 'docs/benchmarks' },
      { title: 'TypeScript', slug: 'docs/typescript' },
    ],
  },

  {
    label: 'Getting Started',
    pages: [
      { title: 'Installation', slug: 'docs/installation' },
      { title: 'Styling', slug: 'docs/styling' },
      { title: 'Variants', slug: 'docs/variants' },
      { title: 'Responsive styles', slug: 'docs/responsive-styles' },
      { title: 'Overriding styles', slug: 'docs/overriding-styles' },
      { title: 'Composing components', slug: 'docs/composing-components' },
      { title: 'Framework agnostic API', slug: 'docs/framework-agnostic' },
    ],
  },

  {
    label: 'Configuration',
    pages: [
      { title: 'Theme tokens', slug: 'docs/tokens' },
      { title: 'Custom theming', slug: 'docs/theming' },
      { title: 'Breakpoints', slug: 'docs/breakpoints' },
      { title: 'Utils', slug: 'docs/utils' },
      { title: 'Server-side rendering', slug: 'docs/server-side-rendering' },
    ],
  },
];

export const allDocsRoutes = docsRoutes.reduce((acc, curr) => {
  acc = [...acc, ...curr.pages];
  return acc;
}, []);
