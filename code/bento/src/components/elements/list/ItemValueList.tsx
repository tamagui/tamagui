import { H1, Separator, Text, View, styled } from 'tamagui'

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
  return (
    <View gap="$4">
      <H1
        size="$9"
        $group-window-xxs={{
          size: '$7',
        }}
      >
        Payment Checkout
      </H1>
      <View gap="$4" width="100%">
        {data.map((item, index) => {
          const isLastItem = index === data.length - 1
          return (
            <>
              <Row key={index} item={item} />
              {!isLastItem && <Separator key={`${index}-separator`} />}
            </>
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
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      $group-window-xs={{
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <SizeableText
        size="$4"
        $group-window-xs={{
          color: '$gray11',
        }}
      >
        {item.title}
      </SizeableText>
      <SizeableText
        size="$4"
        color="$gray11"
        $group-window-xs={{
          color: '$color',
        }}
      >
        {item.value}
      </SizeableText>
    </View>
  )
}

const SizeableText = styled(Text, {
  variants: {
    size: {
      '...fontSize': (val, { font }) => {
        if (!font) return {}
        return {
          fontSize: font.size[val],
          lineHeight: font.lineHeight[val],
          fontWeight: font.weight[val],
        }
      },
    },
  },
})
