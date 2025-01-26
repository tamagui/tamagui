import { YStack } from 'tamagui'

import * as ProductPage from '../../components/ecommerce/product_page'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function product_page() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
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
