import { randFloat, randNumber, randProduct, randProductMaterial } from '@ngneat/falso'
import {
  Coins,
  Heart,
  Minus,
  PiggyBank,
  Plus,
  Receipt,
  ShoppingBag,
  Ticket,
  Trash,
  Truck,
  X,
} from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  H3,
  Image,
  ScrollView,
  Separator,
  Text,
  Unspaced,
  View,
  XGroup,
  styled,
} from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { IconCenterButton } from '../../animation/buttons/IconCenterButton'
import { Input } from '../../forms/inputs/components/inputsParts'

const bagImages = ['bag1.jpg', 'bag2.jpg', 'bag3.webp', 'bag4.webp']
const bagNames = [
  'Leather Bag',
  'Canvas Bag',
  'Shoulder Bag',
  'Backpack',
  'Tote Bag',
  'Crossbody Bag',
  'Satchel',
  'Hobo Bag',
  'Clutch',
  'Duffle Bag',
]
const stockState = ['In stock', 'Out of stock', 'Available soon']

const StyledText = styled(Text, {
  color: '$gray10',
  fontSize: '$4',
  lineHeight: '$4',
})

const getItems = () => {
  return Array.from({ length: 10 }).map((_, i) => {
    const product = randProduct()

    return {
      id: product.id,
      name: bagNames[i % bagNames.length],
      price: product.price,
      count: randNumber({ min: 1, max: 10 }),
      stockState: stockState[i % stockState.length],
      discount: randFloat({ min: 0.05, max: 0.85, precision: 0.01 }),
      attributes: [
        {
          name: 'size',
          value: randFloat({ min: 3, max: 8, precision: 0.5 }),
        },
        {
          name: randProductMaterial(),
          value: `Leather`,
        },
      ],
      image: 'https://tamagui.dev/bento/images/bag/' + bagImages[i % bagImages.length],
    }
  })
}

const promoDiscount = 0.2
const tax = 0.15

const getStockStateColor = (stockState: string) => {
  switch (stockState) {
    case 'In stock':
      return '$green10'
    case 'Out of stock':
      return '$red10'
    default:
      return '$gray10'
  }
}

const calculateCartTotals = (items: Items) => {
  const subtotalPrice = items.reduce(
    (total, item) => total + Number.parseFloat(item.price) * item.count,
    0
  )
  const subtotalPriceWithDiscount = items.reduce(
    (total, item) =>
      total + Number.parseFloat(item.price) * item.count * (1 - item.discount),
    0
  )
  const subtotalSavings = subtotalPrice - subtotalPriceWithDiscount
  const subtotalSavingsPercentage = (1 - subtotalPriceWithDiscount / subtotalPrice) * 100
  const discountedPriceWithPromoDiscount = subtotalPriceWithDiscount * (1 - promoDiscount)
  const savingPriceWithPromoDiscount =
    subtotalPriceWithDiscount - discountedPriceWithPromoDiscount
  const priceAfterTaxes = discountedPriceWithPromoDiscount * (tax + 1)
  const taxesPrice = priceAfterTaxes - discountedPriceWithPromoDiscount

  return {
    subtotalPrice: Math.round(subtotalPrice),
    subtotalPriceWithDiscount: Math.round(subtotalPriceWithDiscount),
    subtotalSavings: Math.round(subtotalSavings),
    subtotalSavingsPercentage: Math.round(subtotalSavingsPercentage),
    discountedPriceWithPromoDiscount: Math.round(discountedPriceWithPromoDiscount),
    savingPriceWithPromoDiscount: Math.round(savingPriceWithPromoDiscount),
    taxesPrice: Math.round(taxesPrice),
    totalPrice: Math.round(priceAfterTaxes),
  }
}

type Items = ReturnType<typeof getItems>

const CartTotal = ({ items }: { items: Items }) => {
  const {
    subtotalPrice,
    subtotalPriceWithDiscount,
    subtotalSavings,
    subtotalSavingsPercentage,
    discountedPriceWithPromoDiscount,
    savingPriceWithPromoDiscount,
    taxesPrice,
    totalPrice,
  } = calculateCartTotals(items)

  return (
    <View
      flexDirection="column"
      paddingHorizontal="$7"
      paddingBottom="$7"
      borderRadius={5}
      gap="$4"
      width="100%"
      backgroundColor="$color1"
      $group-window-md={{
        padding: '$4',
        gap: '$4',
      }}
    >
      <Separator borderStyle="dashed" />

      <View flexDirection="column" gap="$4">
        <View flexDirection="column" gap="$2">
          <Input size="$4" minWidth="100%">
            <Input.Box>
              <Input.Section>
                <Input.Icon>
                  <Ticket />
                </Input.Icon>
                <Input.Area
                  paddingLeft={0}
                  focusStyle={{
                    outlineOffset: 1,
                  }}
                  placeholder="Promocode"
                />
              </Input.Section>
              <Input.Section>
                <IconCenterButton />
              </Input.Section>
            </Input.Box>
          </Input>

          <StyledText>{promoDiscount * 100}% off discount</StyledText>
        </View>

        <Separator borderStyle="dashed" />

        <View flexDirection="row" justifyContent="space-between">
          <StyledText fontSize="$5" lineHeight="$5">
            Subtotal
          </StyledText>
          <View flexDirection="row" gap="$2">
            <StyledText fontSize="$5" lineHeight="$5" textDecorationLine="line-through">
              ${subtotalPrice}
            </StyledText>
            <StyledText fontSize="$5" lineHeight="$5">
              ${subtotalPriceWithDiscount}
            </StyledText>
          </View>
        </View>
        <View flexDirection="row" justifyContent="space-between">
          <View flexDirection="row" alignItems="center" gap="$2">
            <PiggyBank size="$1" color="$gray10" />
            <StyledText>Saving</StyledText>
          </View>
          <StyledText>
            {subtotalSavingsPercentage}% ${subtotalSavings}
          </StyledText>
        </View>
        <View flexDirection="row" justifyContent="space-between">
          <View flexDirection="row" alignItems="center" gap="$2">
            <Truck size="$1" color="$gray10" />
            <StyledText>Delivery</StyledText>
          </View>
          <StyledText>Free</StyledText>
        </View>
        <View flexDirection="row" justifyContent="space-between">
          <View flexDirection="row" alignItems="center" gap="$2">
            <Ticket size="$1" color="$gray10" />
            <StyledText>Discount</StyledText>
          </View>
          <StyledText>
            {promoDiscount * 100}% -${savingPriceWithPromoDiscount}
          </StyledText>
        </View>
        <View flexDirection="row" justifyContent="space-between">
          <View flexDirection="row" alignItems="center" gap="$2">
            <Coins size="$1" color="$gray10" />
            <StyledText>Taxes</StyledText>
          </View>
          <StyledText>
            {tax * 100}% +${taxesPrice}
          </StyledText>
        </View>
      </View>

      <Separator borderStyle="dashed" />

      <View flexDirection="row" justifyContent="space-between">
        <View flexDirection="row" alignItems="center" gap="$2">
          <Receipt size="$1.5" />
          <StyledText fontSize="$5" lineHeight="$5" color="$color">
            Total
          </StyledText>
        </View>
        <StyledText fontSize="$5" lineHeight="$5" color="$color">
          ${totalPrice}
        </StyledText>
      </View>

      <View gap="$3" marginTop="$4">
        <Button theme="blue">
          <Button.Text>Proceed to checkout</Button.Text>
        </Button>
        <Button themeInverse>
          <Button.Text>Continue shopping</Button.Text>
        </Button>
      </View>
    </View>
  )
}

/** ------ EXAMPLE ------ */
export function Fullpage() {
  const [items, setItems] = useState<Items>([])
  const [isCheckout, setCheckout] = useState(false)

  const handleCheckout = () => {
    if (isCheckout) setCheckout(false)
    else setCheckout(true)
  }

  const { sm, xs } = useGroupMedia('window')

  useEffect(() => {
    setItems(getItems())
  }, [])

  return (
    <View
      flexDirection="column"
      gap="$4"
      maxHeight={910}
      height="100%"
      width="100%"
      padding="$6"
      $group-window-xs={{
        paddingHorizontal: '$5',
      }}
    >
      <View flexDirection="column" gap="$3">
        <View flexDirection="row" justifyContent="space-between">
          <H3>Cart</H3>

          <Dialog modal>
            <Dialog.Trigger asChild>
              <Button theme="blue_active" size="$3" iconAfter={ShoppingBag}>
                Checkout
              </Button>
            </Dialog.Trigger>

            <Dialog.Adapt when="sm">
              <Dialog.Sheet
                animation="medium"
                zIndex={200000}
                modal
                dismissOnSnapToBottom
              >
                <Dialog.Sheet.Overlay
                  animation="quick"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
                <Dialog.Sheet.Handle />
                <Dialog.Sheet.Frame padding="$4" gap="$4">
                  <Dialog.Adapt.Contents />
                </Dialog.Sheet.Frame>
              </Dialog.Sheet>
            </Dialog.Adapt>

            <Dialog.Portal>
              <Dialog.Overlay
                key="overlay"
                animation="quick"
                opacity={0.5}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <Dialog.Content
                borderWidth={2}
                borderColor="$borderColor"
                borderRadius={15}
              >
                <Dialog.Title marginHorizontal="$7" marginTop="$7" marginBottom="$4">
                  <View flexDirection="row" justifyContent="space-between">
                    <StyledText fontSize="$6" lineHeight="$6" color="$color">
                      Checkout
                    </StyledText>
                    <ShoppingBag />
                  </View>
                </Dialog.Title>
                <CartTotal items={items} />
                <Unspaced>
                  <Dialog.Close asChild>
                    <Button
                      position="absolute"
                      top="$3"
                      right="$3"
                      size="$2"
                      circular
                      icon={X}
                    />
                  </Dialog.Close>
                </Unspaced>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </View>
        <Separator />
      </View>
      <ScrollView
        contentContainerStyle={{
          minWidth: '100%',
          flexDirection: 'column',
          gap: sm ? '$4' : '$0',
          paddingBottom: sm ? 300 : 48,
        }}
        $group-window-gtSm={{
          flex: 3,
        }}
      >
        {items.map((item, index) => (
          <View key={item.id} marginBottom="$2">
            <Item item={item} />
            {!sm && index !== items.length - 1 && <Separator marginVertical="$4" />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

Fullpage.fileName = 'Fullpage'

const Item = ({ item }: { item: Items[number] }) => {
  const { sm, xxs, xs, gtSm, gtXs } = useGroupMedia('window')
  const [layoutWidth, setLayoutWidth] = useState(0)

  const [count, setCount] = useState(item.count)
  const [wishlist, setWishlist] = useState(count % 2 === 0)

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout
    setLayoutWidth(width)
  }

  return (
    <View
      flexDirection="row"
      flexWrap="wrap"
      gap="$6"
      $group-window-sm={{
        gap: '$3',
        paddingBottom: '$4',
        borderWidth: 1,
        borderColor: '$borderColor',
        borderRadius: 15,
      }}
      onLayout={onLayout}
    >
      <View
        flexGrow={sm ? 1 : 0}
        flexBasis={125}
        gap="$4"
        flexDirection="column"
        borderRadius="$4"
      >
        <View
          flexDirection="row"
          gap="$2"
          position="absolute"
          zIndex={1000}
          t="$2"
          r="$2"
        >
          <Button
            id="add-wishlist"
            circular
            size="$2"
            icon={<Heart color={wishlist ? '$red10' : undefined} />}
            $group-window-sm={{ size: '$3' }}
            theme={wishlist ? 'red_active' : 'red_alt1'}
            onPress={() => setWishlist(!wishlist)}
          />

          {xs && (
            <Button
              id={'remove-product' + item.id}
              circular
              size="$3"
              icon={<Trash color="$red10" />}
              scaleIcon={1.1}
              theme="red_alt1"
            />
          )}
        </View>

        <Image
          borderRadius={10}
          backgroundColor="$color1"
          objectFit="cover"
          height={125}
          $group-window-sm={{
            height: 150,
          }}
          $platform-native={{
            minWidth: layoutWidth,
          }}
          $group-window-gtMd={{
            minWidth: 'inherit',
          }}
          source={{ uri: item.image }}
        />
      </View>

      <View
        flex={1}
        flexBasis={250}
        alignItems="flex-start"
        justifyContent="center"
        gap="$2"
        $group-window-sm={{
          paddingHorizontal: '$4',
          gap: '$4',
        }}
        $group-window-xs={{
          paddingHorizontal: '$4',
          gap: '$2',
        }}
      >
        <View
          flexDirection="row"
          alignItems="center"
          gap="$2"
          $group-window-xs={{
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text fontSize="$7" lineHeight="$5" fontWeight="600">
            {item.name}
          </Text>
          {xs && (
            <Text
              color={getStockStateColor(item.stockState)}
              fontSize="$3"
              lineHeight="$3"
            >
              {item.stockState}
            </Text>
          )}
        </View>

        {gtXs && (
          <View flexDirection="row" gap="$2">
            <Text
              color={getStockStateColor(item.stockState)}
              fontSize="$3"
              lineHeight="$3"
            >
              {item.stockState}
            </Text>
            <Separator vertical marginVertical="$2" borderColor="$gray10" />
            <Text color="$red10" fontSize="$3" lineHeight="$3">
              Saving {Math.round(item.discount * 100)}%
            </Text>
          </View>
        )}

        <View
          flexDirection="row"
          alignItems="center"
          gap="$2"
          $group-window-xs={{
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View flexDirection="row" gap="$2">
            <Text fontSize="$5" lineHeight="$5">
              ${Math.round(Number(item.price) * Number(1 - item.discount))}
            </Text>
            <Text
              textDecorationLine="line-through"
              color="$color10"
              fontSize="$5"
              lineHeight="$5"
            >
              ${Math.round(Number(item.price))}
            </Text>
          </View>
          {xs && (
            <Text color="$red10" fontSize="$3" lineHeight="$3">
              Saving {Math.round(item.discount * 100)}%
            </Text>
          )}
        </View>
      </View>

      {sm && gtXs && (
        <Button
          id={'remove-product' + item.id}
          size="$3"
          margin="$4"
          circular
          icon={<Trash color="$gray10" />}
          scaleIcon={1.2}
          theme="red"
          backgroundColor="transparent"
        />
      )}

      <View
        flexDirection="column"
        alignItems={sm ? 'center' : 'flex-end'}
        justifyContent="center"
        gap="$5"
        $group-window-sm={{
          width: '100%',
          paddingHorizontal: '$4',
        }}
        $group-window-gtSm={{
          paddingRight: '$4',
        }}
      >
        {gtSm && (
          <View flexDirection="column" alignItems="flex-end">
            <Text
              textDecorationLine="line-through"
              color="$color10"
              fontSize="$3"
              lineHeight="$3"
            >
              ${Math.round(Number(item.price) * Number(count))}
            </Text>
            <Text fontSize="$8" lineHeight="$6" fontWeight="bold">
              $
              {Math.round(Number(item.price) * Number(count) * Number(1 - item.discount))}
            </Text>
          </View>
        )}

        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="$4"
          $group-window-sm={{
            width: '100%',
          }}
        >
          <ItemCounter count={count} setCount={setCount} />

          {sm && (
            <View flexDirection="row" gap="$2">
              <Text fontSize="$8" lineHeight="$8" fontWeight="bold">
                $
                {Math.round(
                  Number(item.price) * Number(count) * Number(1 - item.discount)
                )}
              </Text>
              <Text
                textDecorationLine="line-through"
                color="$color10"
                fontSize="$3"
                lineHeight="$3"
              >
                ${Math.round(Number(item.price) * Number(count))}
              </Text>
            </View>
          )}

          {gtSm && (
            <Button
              id={'remove-product' + item.id}
              size="$3"
              circular
              icon={<Trash color="$gray10" />}
              scaleIcon={1.2}
              theme="red"
              backgroundColor="transparent"
              $group-window-sm={{
                borderColor: '$gray10',
              }}
            />
          )}
        </View>
      </View>
    </View>
  )
}

interface ItemCounterProps {
  count: number
  setCount: (count: number) => void
}

const ItemCounter: React.FC<ItemCounterProps> = ({ count, setCount }) => {
  return (
    <XGroup marginRight="$6">
      <Button
        theme="alt2"
        size="$3"
        icon={Minus}
        onPress={() => setCount(count > 1 ? count - 1 : 1)}
      />
      <View
        flexBasis={40}
        alignItems="center"
        justifyContent="center"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <StyledText>{count}</StyledText>
      </View>
      <Button
        theme="alt2"
        size="$3"
        icon={Plus}
        onPress={() => setCount(count < 10 ? count + 1 : 10)}
      />
    </XGroup>
  )
}
