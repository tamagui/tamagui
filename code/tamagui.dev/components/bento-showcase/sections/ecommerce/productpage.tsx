import { YStack } from 'tamagui'

import * as ProductPage from '@tamagui/bento/component/ecommerce/productpage'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function productpage({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
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
    </BentoShowcaseProvider>
  )
}
