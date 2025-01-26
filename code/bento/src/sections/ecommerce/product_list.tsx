import { YStack } from 'tamagui'

import * as ProductList from '../../components/ecommerce/product_list'
// import { getCode } from '../../components/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof product_listGetComponentCodes>
export function product_list(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={ProductList.ProductList.fileName} title="Product List">
        <Wrapper p={0}>
          <ProductList.ProductList />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={ProductList.ProductListBestItems.fileName}
        title="Product List Best Items"
      >
        <ProductList.ProductListBestItems />
      </Showcase>
      <Showcase
        fileName={ProductList.ProductListGridThumbs.fileName}
        title="Prodcut List Grid Thumbs"
      >
        <Wrapper p={0}>
          <ProductList.ProductListGridThumbs />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={ProductList.ProductListWithFeatures.fileName}
        title="Product List with Features"
      >
        <Wrapper p={0}>
          <ProductList.ProductListWithFeatures />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={ProductList.ProductListWithLabel.fileName}
        title="Prodcut List with Label"
      >
        <Wrapper p={0}>
          <ProductList.ProductListWithLabel />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function product_listGetComponentCodes() {
  return {
    codes: {
      ProductList: '',
      ProductListBestItems: '',
      ProductListGridThumbs: '',
      ProductListWithFeatures: '',
      ProductListWithLabel: '',
    } as Omit<Record<keyof typeof ProductList, string>, 'getCode'>,
  }
}
