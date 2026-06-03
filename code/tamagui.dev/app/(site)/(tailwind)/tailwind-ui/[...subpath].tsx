// the docs ui route exports its page as the named `DocComponentsPage` (no default),
// unlike the other docs routes — map it to default so this route renders the page.
export {
  DocComponentsPage as default,
  loader,
  generateStaticParams,
} from '~/app/(site)/(docs)/ui/[...subpath]'
