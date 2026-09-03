// see the note in docs/core/[slug].tsx: the body lives outside the route tree so
// this module stays a pure re-export and keeps its export names in the build
export {
  DocGuidesPage as default,
  loader,
  generateStaticParams,
} from '~/features/docs/pages/GuidesDocPage'
