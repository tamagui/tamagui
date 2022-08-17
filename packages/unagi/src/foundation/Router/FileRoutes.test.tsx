import { ImportGlobEagerOutput } from '../../types.js'
import { createPageRoutes } from '../FileRoutes/FileRoutes.server.js'

const STUB_MODULE = { default: {}, api: null }

it('converts normal pages to routes', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('handles index pages', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('handles nested index pages', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/products/index.server.jsx': STUB_MODULE,
    './routes/products/[handle].server.jsx': STUB_MODULE,
    './routes/blogs/index.server.jsx': STUB_MODULE,
    './routes/products/snowboards/fastones/index.server.jsx': STUB_MODULE,
    './routes/articles/index.server.jsx': STUB_MODULE,
    './routes/articles/[...handle].server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/products',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/snowboards/fastones',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/articles',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/articles/:handle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ])
})

it('handles dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
    './routes/products/[handle].server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')
  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('handles catch all routes', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
    './routes/products/[...handle].server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')
  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ])
})

it('handles nested dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
    './routes/products/[handle].server.jsx': STUB_MODULE,
    './routes/blogs/[handle]/[articleHandle].server.jsx': STUB_MODULE,
    './routes/blogs/[handle]/[...articleHandle].server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ])
})

it('prioritizes overrides next to dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
    './routes/products/[handle].server.jsx': STUB_MODULE,
    // Alphabetically, `hoodie` will likely come after `[handle]`
    './routes/products/hoodie.server.jsx': STUB_MODULE,
    './routes/blogs/[handle]/[articleHandle].server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    // But in the routes, it needs to come first!
    {
      path: '/products/hoodie',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('handles typescript paths', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.tsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('lowercases routes', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/Contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './routes')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('factors in the top-level path prefix', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/index.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '/foo/*', './routes')

  expect(routes).toEqual([
    {
      path: '/foo/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/foo/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})

it('uses a custom file directory path', () => {
  const pages: ImportGlobEagerOutput = {
    './custom/contact.server.jsx': STUB_MODULE,
    './custom/index.server.jsx': STUB_MODULE,
  }

  const routes = createPageRoutes(pages, '*', './custom')

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ])
})
