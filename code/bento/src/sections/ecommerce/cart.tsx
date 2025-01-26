import { YStack } from 'tamagui'

import * as Cart from '../../components/ecommerce/cart'
// import { getCode } from '../../components/elements/avatars'
import { Showcase } from '../../components/general/_Showcase'

type Props = ReturnType<typeof cartGetComponentCodes>
export function cart(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Cart.Fullpage.fileName} title="Shopping Cart">
        <Cart.Fullpage />
      </Showcase>
    </YStack>
  )
}

export function cartGetComponentCodes() {
  return {
    codes: {
      Fullpage: '',
    } as Omit<Record<keyof typeof Cart, string>, 'getCode'>,
  }
}
