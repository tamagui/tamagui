import { XGroup } from '../../BentoSkins'
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
} from '../../icons'
import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  H3,
  Image,
  ScrollView,
  Separator,
  Sheet,
  Text,
  Unspaced,
  View,
  styled,
} from 'tamagui'
import { IconCenterButton } from '../../animation/buttons/IconCenterButton'
import { Input } from '../../forms/inputs/components/inputsParts'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const bagImages = ['bag1.webp', 'bag2.webp', 'bag3.webp', 'bag4.webp']
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
  color: 'color-9',
  fontSize: '4',
  lineHeight: '4',
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
      return 'green-600'
    case 'Out of stock':
      return 'red-600'
    default:
      return 'color-9'
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

    savingPriceWithPromoDiscount,
    taxesPrice,
    totalPrice,
  } = calculateCartTotals(items)

  return (
    <View
      flexDirection="column"
      rounded={5}
      width="100%"
      bg="color-1"
      px="gtSm:7"
      pb="gtSm:7"
      gap="4"
    >
      <Separator borderStyle="dashed" />

      <View flexDirection="column" gap="4">
        <View flexDirection="column" gap="4">
          <Input size="4" minW="100%">
            <Input.Box>
              <Input.Section>
                <Input.Icon>
                  <Ticket />
                </Input.Icon>
                <Input.Area pl={0} outlineOffset="focus:1px" placeholder="Promocode" />
              </Input.Section>
              <Input.Section>
                <IconCenterButton />
              </Input.Section>
            </Input.Box>
          </Input>

          <Text>{promoDiscount * 100}% off discount</Text>
        </View>

        <Separator borderStyle="dashed" />

        <View flexDirection="row" justify="space-between">
          <StyledText fontSize="5" lineHeight="5">
            Subtotal
          </StyledText>
          <View flexDirection="row" gap="2">
            <StyledText fontSize="5" lineHeight="5" textDecorationLine="line-through">
              ${subtotalPrice}
            </StyledText>
            <StyledText fontSize="5" lineHeight="5">
              ${subtotalPriceWithDiscount}
            </StyledText>
          </View>
        </View>
        <View flexDirection="row" justify="space-between">
          <View flexDirection="row" items="center" gap="2">
            <PiggyBank size="1" color="color-9" />
            <StyledText>Saving</StyledText>
          </View>
          <StyledText>
            {subtotalSavingsPercentage}% ${subtotalSavings}
          </StyledText>
        </View>
        <View flexDirection="row" justify="space-between">
          <View flexDirection="row" items="center" gap="2">
            <Truck size="1" color="color-9" />
            <StyledText>Delivery</StyledText>
          </View>
          <StyledText>Free</StyledText>
        </View>
        <View flexDirection="row" justify="space-between">
          <View flexDirection="row" items="center" gap="2">
            <Ticket size="1" color="color-9" />
            <StyledText>Discount</StyledText>
          </View>
          <StyledText>
            {promoDiscount * 100}% -${savingPriceWithPromoDiscount}
          </StyledText>
        </View>
        <View flexDirection="row" justify="space-between">
          <View flexDirection="row" items="center" gap="2">
            <Coins size="1" color="color-9" />
            <StyledText>Taxes</StyledText>
          </View>
          <StyledText>
            {tax * 100}% +${taxesPrice}
          </StyledText>
        </View>
      </View>

      <Separator borderStyle="dashed" />

      <View flexDirection="row" justify="space-between">
        <View flexDirection="row" items="center" gap="2">
          <Receipt size="6" />
          <StyledText fontSize="5" lineHeight="5" color="color">
            Total
          </StyledText>
        </View>
        <StyledText fontSize="5" lineHeight="5" color="color">
          ${totalPrice}
        </StyledText>
      </View>

      <View gap="3" mt="4">
        <Button theme="blue">
          <Button.Text>Proceed to checkout</Button.Text>
        </Button>
        <Button theme="accent">
          <Button.Text>Continue shopping</Button.Text>
        </Button>
      </View>
    </View>
  )
}

/** ------ EXAMPLE ------ */
export function Fullpage() {
  const [items, setItems] = useState<Items>([])

  const { sm } = useGroupMedia('window')

  useEffect(() => {
    setItems(getItems())
  }, [])

  return (
    <View p="gtMd:6" flexDirection="column" maxH={910} height="100%" width="100%">
      <View flexDirection="column" gap="3">
        <View flexDirection="row" justify="space-between">
          <H3>Cart</H3>

          <Dialog modal>
            <Dialog.Trigger asChild>
              <Button theme="blue" size="sm" gap="2" iconAfter={ShoppingBag}>
                Checkout
              </Button>
            </Dialog.Trigger>

            <Dialog.Adapt when="maxMd">
              <Sheet transition="medium" zIndex={200000} modal dismissOnSnapToBottom>
                <Sheet.Overlay transition="quick" opacity="enter:0 exit:0" />
                <Sheet.Handle />
                <Sheet.Container p="4" gap="4">
                  <Sheet.Background />
                  <Dialog.Adapt.Contents />
                </Sheet.Container>
              </Sheet>
            </Dialog.Adapt>

            <Dialog.Portal>
              <Dialog.Overlay
                key="overlay"
                transition="quick"
                opacity="0.5 enter:0 exit:0"
              />
              <Dialog.Content
                key="content"
                transition="quick"
                opacity="enter:0 exit:0"
                x="enter:0"
                y="enter:-20px"
                scale="enter:0.9"
                borderWidth={2}
                borderColor="border-color"
                rounded={15}
              >
                <Dialog.Title>
                  <View
                    px="gtMd:7"
                    pt="7"
                    gap="4"
                    flexDirection="row"
                    justify="space-between"
                    items="center"
                  >
                    <Text flex={1} fontSize="6" fontWeight="bold" color="color">
                      Checkout
                    </Text>

                    <ShoppingBag />
                  </View>
                </Dialog.Title>

                <CartTotal items={items} />

                <Unspaced>
                  <Dialog.Close asChild>
                    <Button position="absolute" t="3" r="3" size="xs" circular icon={X} />
                  </Dialog.Close>
                </Unspaced>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </View>
        <Separator />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minW: '100%',
          flexDirection: 'column',
          gap: sm ? '4' : '0',
          pb: sm ? 300 : 48,
          pt: '4',
          flexBasis: 'auto',
        }}
        flex="@gtSm/window:3"
        flexBasis="@gtSm/window:auto"
      >
        {items.map((item, index) => (
          <View key={item.id} mb="2">
            <Item item={item} />
            {!sm && index !== items.length - 1 && <Separator my="4" />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

Fullpage.fileName = 'Fullpage'

const Item = ({ item }: { item: Items[number] }) => {
  const { sm, xs, gtSm, gtXs } = useGroupMedia('window')
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
      gap="6 @sm/window:3"
      pb="@sm/window:4"
      borderWidth="@sm/window:1px"
      borderColor="@sm/window:border-color"
      rounded="@sm/window:15px"
      onLayout={onLayout}
    >
      <View
        grow={sm ? 1 : 0}
        flexBasis={125}
        gap="4"
        flexDirection="column"
        rounded="4"
        position="relative"
      >
        <View flexDirection="row" gap="2" position="absolute" z={1000} t="2" r="2">
          <Button
            id="add-wishlist"
            circular
            size={sm ? 'sm' : 'xs'}
            icon={<Heart color={wishlist ? 'red-600' : undefined} />}
            theme={wishlist ? 'red' : 'red_level2'}
            onPress={() => setWishlist(!wishlist)}
          />

          {xs && (
            <Button
              id={'remove-product' + item.id}
              circular
              size="sm"
              icon={<Trash color="red-600" />}
              scaleIcon={1.1}
              theme="red_level2"
            />
          )}
        </View>

        <Image
          src={item.image}
          rounded={10}
          bg="color-1"
          objectFit="cover"
          height={150}
          minW={`${`native:${layoutWidth}px`} @gtMd/window:inherit`}
        />
      </View>

      <View
        flex={1}
        flexBasis={250}
        items="flex-start"
        justify="center"
        gap="2 @sm/window:4 @xs/window:2"
        px="@sm/window:4 @xs/window:4"
      >
        <View
          flexDirection="row"
          items="center"
          gap="2"
          justify="@xs/window:space-between"
          width="@xs/window:100%"
        >
          <Text fontSize="5 gtMd:7" fontWeight="600">
            {item.name}
          </Text>
          {xs && (
            <Text color={getStockStateColor(item.stockState)} fontSize="3">
              {item.stockState}
            </Text>
          )}
        </View>

        {gtXs && (
          <View flexDirection="row" gap="2">
            <Text color={getStockStateColor(item.stockState)} fontSize="3">
              {item.stockState}
            </Text>
            <Separator vertical my="2" borderColor="color-9" />
            <Text color="red-600" fontSize="3" lineHeight="3">
              Saving {Math.round(item.discount * 100)}%
            </Text>
          </View>
        )}

        <View
          flexDirection="row"
          items="center"
          gap="2"
          justify="@xs/window:space-between"
          width="@xs/window:100%"
        >
          <View flexDirection="row" gap="2">
            <Text fontSize="5" lineHeight="5">
              ${Math.round(Number(item.price) * Number(1 - item.discount))}
            </Text>
            <Text
              textDecorationLine="line-through"
              color="color-9"
              fontSize="5"
              lineHeight="5"
            >
              ${Math.round(Number(item.price))}
            </Text>
          </View>
          {xs && (
            <Text color="red-600" fontSize="3" lineHeight="3">
              Saving {Math.round(item.discount * 100)}%
            </Text>
          )}
        </View>
      </View>

      {sm && gtXs && (
        <Button
          id={'remove-product' + item.id}
          size="sm"
          m="4"
          bg="transparent"
          circular
          icon={<Trash color="color-9" />}
          scaleIcon={1.2}
          theme="red"
        />
      )}

      <View
        flexDirection="column"
        items={sm ? 'center' : 'flex-end'}
        justify="center"
        gap="5"
        width="@sm/window:100%"
        paddingLeft="@sm/window:4"
        pr="@sm/window:4 @gtSm/window:4"
      >
        {gtSm && (
          <View flexDirection="column" items="flex-end">
            <Text
              textDecorationLine="line-through"
              color="color-9"
              fontSize="3"
              lineHeight="3"
            >
              ${Math.round(Number(item.price) * Number(count))}
            </Text>
            <Text fontSize="8" lineHeight="6" fontWeight="bold">
              $
              {Math.round(Number(item.price) * Number(count) * Number(1 - item.discount))}
            </Text>
          </View>
        )}

        <View
          flexDirection="row"
          items="center"
          justify="space-between"
          gap="4"
          width="@sm/window:100%"
        >
          <ItemCounter count={count} setCount={setCount} />

          {sm && (
            <View flexDirection="row" gap="2">
              <Text fontSize="4" fontWeight="bold">
                $
                {Math.round(
                  Number(item.price) * Number(count) * Number(1 - item.discount)
                )}
              </Text>

              <Text textDecorationLine="line-through" color="color-9" fontSize="3">
                ${Math.round(Number(item.price) * Number(count))}
              </Text>
            </View>
          )}

          {gtSm && (
            <Button
              id={'remove-product' + item.id}
              size="sm"
              circular
              icon={<Trash color="color-9" />}
              scaleIcon={1.2}
              theme="red"
              bg="transparent"
              borderColor="@sm/window:color-9"
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
    <XGroup mr="6">
      <Button
        theme="level3"
        size="sm"
        bg="transparent"
        icon={Minus}
        onPress={() => setCount(count > 1 ? count - 1 : 1)}
      />
      <View
        flexBasis={40}
        items="center"
        justify="center"
        rounded="4"
        borderWidth={1}
        borderColor="border-color"
      >
        <StyledText>{count}</StyledText>
      </View>
      <Button
        theme="level3"
        size="sm"
        bg="transparent"
        icon={Plus}
        onPress={() => setCount(count < 10 ? count + 1 : 10)}
      />
    </XGroup>
  )
}
