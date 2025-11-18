import { YStack } from 'tamagui'

import * as Payment from '@tamagui/bento/component/ecommerce/payment'
import { Showcase } from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function payment({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase fileName={Payment.Fullpage.fileName} title="Shopping Cart">
          <Payment.Fullpage />
        </Showcase>

        <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
          <Showcase fileName={Payment.Paywall.fileName} title={Payment.Paywall.title}>
            <Payment.Paywall />
          </Showcase>
        </YStack>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function paymentGetComponentCodes() {
  return {
    codes: {
      Fullpage: '',
      Paywall: '',
    } as Omit<Record<keyof typeof Payment, string>, 'getCode'>,
  }
}
