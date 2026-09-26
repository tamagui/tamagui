import { YStack } from 'tamagui'

import * as Payment from '@tamagui/bento/component/ecommerce/payment'
import { Showcase } from '~/components/bento-showcase/_Showcase'

export function payment() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
      <Showcase fileName={Payment.Fullpage.fileName} title="Shopping Cart">
        <Payment.Fullpage />
      </Showcase>

      <YStack
        paddingBottom="1-5 xl:0"
        gap="88px"
        paddingTop="1-5 xl:0"
        paddingRight="1-5 xl:0"
        paddingLeft="1-5 xl:0"
      >
        <Showcase fileName={Payment.Paywall.fileName} title={Payment.Paywall.title}>
          <Payment.Paywall />
        </Showcase>
      </YStack>
    </YStack>
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
