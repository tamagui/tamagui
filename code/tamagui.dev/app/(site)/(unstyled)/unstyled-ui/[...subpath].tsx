// re-export the components docs page. the layout sets unstyled mode. the page is
// exported as the named `DocComponentsPage`, so map it to default here
export {
  DocComponentsPage as default,
  loader,
  generateStaticParams,
} from '~/features/docs/pages/ComponentsDocPage'
