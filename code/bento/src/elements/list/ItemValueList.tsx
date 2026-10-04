import { Fragment } from 'react'
import { H1, Separator, SizableText, View } from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const data = [
  {
    title: 'Your are sending',
    value: '10000 USDT',
  },
  {
    title: 'Transfer fee',
    value: '10 USDT',
  },
  {
    title: 'Google exchange rate',
    value: '1 USDT = 1.21 EUR',
  },
  {
    title: 'Jack london is receiving',
    value: '12100 EUR',
  },
  {
    title: 'Receiver account',
    value: 'DE1234567890',
  },
  {
    title: 'Estimated arrival',
    value: '1-2 business days',
  },
]

/** ---- EXAMPLE ------ */
export function ItemValueList() {
  const { 'max-xs': tiny } = useGroupMedia('window')
  return (
    <View gap="4">
      <H1 size={tiny ? '7' : '9'}>Payment Checkout</H1>
      <View gap="4" width="100%">
        {data.map((item, index) => {
          const isLastItem = index === data.length - 1
          return (
            <Fragment key={item.title}>
              <Row item={item} />
              {!isLastItem && <Separator />}
            </Fragment>
          )
        })}
      </View>
    </View>
  )
}

ItemValueList.fileName = 'ItemValueList'

const Row = ({ item }: { item: (typeof data)[0] }) => {
  return (
    <View
      justify="space-between"
      items="center @max-sm/window:flex-start"
      flexDirection="row @max-sm/window:column"
    >
      <SizableText size="base" color="@max-sm/window:color-10">
        {item.title}
      </SizableText>
      <SizableText size="base" color="color-10 @max-sm/window:color">
        {item.value}
      </SizableText>
    </View>
  )
}
