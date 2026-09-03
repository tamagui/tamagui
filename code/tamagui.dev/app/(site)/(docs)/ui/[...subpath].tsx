// see the note in docs/core/[slug].tsx: the body lives outside the route tree so
// this module stays a pure re-export and keeps its export names in the build.
// this one exports the page as the named `DocComponentsPage` with no default,
// which is what it did before the body moved
export {
  DocComponentsPage,
  loader,
  generateStaticParams,
} from '~/features/docs/pages/ComponentsDocPage'
