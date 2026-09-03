// the page body lives outside the route tree so this route module is a pure
// re-export, same as its tailwind and unstyled mirrors. a route that both holds
// the implementation and is imported by another route gets merged into a shared
// chunk with aliased export names, and One reads generateStaticParams off the
// built chunk by name, so the build fails with "Missing generateStaticParams"
export {
  DocCorePage as default,
  loader,
  generateStaticParams,
} from '~/features/docs/pages/CoreDocPage'
