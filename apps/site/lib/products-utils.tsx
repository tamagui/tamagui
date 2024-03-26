import { getTakeoutPriceInfo } from '@lib/getProductInfo'
import type { Database } from '@lib/supabase-types'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Check, CheckCircle, XCircle } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type Stripe from 'stripe'
import type { ButtonProps, CheckboxProps, RadioGroupItemProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  Checkbox,
  Input,
  Label,
  Paragraph,
  RadioGroup,
  Separator,
  Theme,
  XStack,
  YStack,
  isClient,
  styled,
} from 'tamagui'

import { useTakeoutStore } from '../hooks/useTakeoutStore'

const ua = (() => {
  if (typeof window === 'undefined') return
  return window.navigator.userAgent
})()

const isWebkit = (() => {
  return !!ua?.match(/WebKit/i)
})()

export const isSafariMobile = (() => {
  const iOS = !!ua?.match(/iPad/i) || !!ua?.match(/iPhone/i)
  return isClient && iOS && isWebkit && !ua?.match(/CriOS/i)
})()

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

export function PurchaseButton(props: ButtonProps) {
  return (
    <ThemeTintAlt>
      <Theme name="surface4">
        <Button size="$6" borderWidth={2} {...props}>
          <Button.Text ff="$silkscreen">{props.children}</Button.Text>
        </Button>
      </Theme>
    </ThemeTintAlt>
  )
}

export const MunroP = styled(Paragraph, {
  // className: 'pixelate',
  fontFamily: '$munro',
})

export const PromotionInput = () => {
  const store = useTakeoutStore()

  const [localCode, setLocalCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const applyCoupon = (promoCode: string, coupon: Stripe.Coupon) => {
    store.appliedCoupon = coupon
    store.appliedPromoCode = promoCode
  }

  const removeCoupon = () => {
    setLocalCode('')
    store.appliedCoupon = null
    store.appliedPromoCode = null
  }

  const closeField = () => {
    setLocalCode('')
    store.promoInputIsOpen = false
  }

  const checkPromotion = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/check-promo-code?${new URLSearchParams({ code: localCode })}`
      )
      if (res.status === 200) {
        const json = (await res.json()) as Stripe.Coupon
        applyCoupon(localCode, json)
      } else {
        const json = await res.json()
        if (json.message) {
          alert(json.message)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {store.promoInputIsOpen ? (
        <XStack
          key="is-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          gap="$2"
          jc="center"
          ai="center"
        >
          {store.appliedPromoCode ? (
            <>
              <Paragraph theme="green_alt2">
                Coupon {store.appliedPromoCode} applied.
              </Paragraph>
              <Button chromeless size="$2" onPress={removeCoupon}>
                Remove Coupon
              </Button>
            </>
          ) : (
            <>
              {!store.appliedPromoCode && (
                <Button disabled={isLoading} size="$2" chromeless onPress={closeField}>
                  Cancel
                </Button>
              )}
              <Input
                disabled={!!store.appliedPromoCode}
                value={store.appliedPromoCode ?? localCode}
                onChangeText={(text) => {
                  setLocalCode(text)
                }}
                placeholder="Enter the code"
                size="$2"
              />
              <Button
                disabled={isLoading}
                themeInverse
                size="$2"
                onPress={checkPromotion}
              >
                Submit
              </Button>
            </>
          )}
        </XStack>
      ) : (
        <Paragraph
          key="is-not-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          ta="right"
          textDecorationLine="underline"
          cursor="pointer"
          theme="alt2"
          size="$2"
          onPress={() => {
            store.promoInputIsOpen = true
          }}
        >
          Coupon
        </Paragraph>
      )}
    </AnimatePresence>
  )
}

export const CheckboxGroupItem = ({ children, ...props }: CheckboxProps) => {
  return (
    <Label
      f={1}
      htmlFor={props.id}
      p="$4"
      className="3d"
      height="unset"
      display="flex"
      borderWidth="$0.25"
      backgroundColor={props.checked ? '$color2' : '$color1'}
      borderColor={props.checked ? '$color5' : '$color2'}
      borderRadius="$4"
      gap="$4"
      ai="center"
      opacity={props.disabled ? 0.75 : 1}
      cursor={props.disabled ? 'not-allowed' : 'default'}
      $gtSm={{
        maw: 'calc(50% - 8px)',
      }}
      hoverStyle={{
        borderColor: props.checked ? '$color7' : '$color7',
      }}
    >
      <Checkbox
        bg="$color3"
        bc="$color5"
        hoverStyle={{
          bg: '$color4',
          bc: '$color6',
        }}
        checked={props.checked}
        size="$6"
        {...props}
      >
        <Checkbox.Indicator
        // backgroundColor={props.checked ? '$color8' : '$color1'}
        >
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <YStack gap="$1" f={1}>
        {children}
      </YStack>
    </Label>
  )
}

export const RadioGroupItem = ({
  children,
  active,
  ...props
}: RadioGroupItemProps & { active: boolean }) => {
  return (
    <ThemeTint disable={!active}>
      <Label
        f={1}
        htmlFor={props.id}
        p="$4"
        height="unset"
        display="flex"
        borderWidth="$0.25"
        borderColor={active ? '$color8' : '$color5'}
        borderRadius="$4"
        space="$4"
        ai="center"
        hoverStyle={{
          borderColor: active ? '$color10' : '$color7',
        }}
      >
        <RadioGroup.Item size="$6" {...props}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>

        <YStack gap="$0" f={1}>
          {children}
        </YStack>
      </Label>
    </ThemeTint>
  )
}

const bentoDefaults = {
  price_1OiqquFQGtHoG6xcZxZaVF2B: {
    seats: 1,
  },
  price_1OeBK5FQGtHoG6xcTB6URHYD: {
    seats: 20,
  },
}

export function BentoTable({
  product,
  selectedPriceId,
}: {
  product?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  selectedPriceId: string
}) {
  const priceInfo = bentoDefaults[selectedPriceId]

  return (
    <YStack
      separator={<Separator bc="$color5" />}
      borderWidth="$0.5"
      borderRadius="$4"
      bc="$color5"
    >
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Lifetime access
          </Paragraph>
          <Paragraph size="$3" theme="alt1">
            You own the code, get updates&nbsp;for&nbsp;life
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Seats
          </Paragraph>
          <Paragraph size="$3" theme="alt1" lh="$2">
            Accounts given access
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{priceInfo?.seats}</Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}

export const TakeoutTable = ({
  product,
  selectedPriceId,
}: {
  product?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  selectedPriceId: string
}) => {
  const takeoutPriceInfo = getTakeoutPriceInfo(
    product?.prices.find((price) => price.id === selectedPriceId)?.description ?? ''
  )
  return (
    <YStack
      separator={<Separator o={0.35} />}
      borderWidth="$0.5"
      borderRadius="$4"
      borderColor="$borderColor"
    >
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Lifetime access, 1 year of updates
          </Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            You own the code for life, with updates for a year
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">License Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Number of people allowed to&nbsp;develop&nbsp;on&nbsp;it
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.licenseSeats}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">Discord Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Access to the Discord #takeout room
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.discordSeats}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">Discord Private Channel</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Private chat for your team only
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">
            {takeoutPriceInfo.hasDiscordPrivateChannels ? checkCircle : xCircle}
          </Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">GitHub Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Open PRs and issues on the Github repo
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.githubSeats}</Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}

const checkCircle = <CheckCircle color="$green9" />
const xCircle = <XCircle size={28} color="$red9" />
