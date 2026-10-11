import {
  loader as loadPage,
  generateStaticParams as pageParams,
} from '~/features/docs/pages/GuidesDocPage'

export { DocGuidesPage as default } from '~/features/docs/pages/GuidesDocPage'

// One replaces inline route loaders with client stubs. Re-exporting a loader
// leaves its export in the generated data module, producing a duplicate export.
export function loader(props: Parameters<typeof loadPage>[0]) {
  return loadPage(props)
}

export function generateStaticParams() {
  return pageParams()
}
