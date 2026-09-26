import { YStack } from 'tamagui'

import * as ProductPage from '@tamagui/bento/component/ecommerce/productpage'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function productpage() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
      <Showcase
        fileName={ProductPage.ProductWithReview.fileName}
        title="Product with Review"
      >
        <Wrapper p={0}>
          <ProductPage.ProductWithReview />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
