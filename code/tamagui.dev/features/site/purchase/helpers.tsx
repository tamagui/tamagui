import { Check, CheckCircle } from '@tamagui/lucide-icons'
import type { CheckboxProps, RadioGroupItemProps } from 'tamagui'
import {
  Button,
  Checkbox,
  Label,
  Paragraph,
  RadioGroup,
  Separator,
  XStack,
  YStack,
  isClient,
  styled,
} from 'tamagui'
import type { Database } from '~/features/supabase/types'
import { getTakeoutPriceInfo } from './getProductInfo'

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

export function PurchaseButton({ children, fontFamily = '$mono', ...props }) {
  return (
    <Button size="$6" rounded="$10" {...props}>
      <Button.Text size="$6" fontFamily={fontFamily as any}>
        {children}
      </Button.Text>
    </Button>
  )
}

export const MunroP = styled(Paragraph, {
  fontFamily: '$mono',
})

export const CheckboxGroupItem = ({ children, ...props }: CheckboxProps) => {
  return (
    <Label
      flex={1}
      {...(props.id && { htmlFor: props.id })}
      p="$4"
      className="3d"
      display="flex"
      borderWidth="$0.25"
      bg={props.checked ? '$color2' : '$color1'}
      borderColor={props.checked ? '$color5' : '$color2'}
      rounded="$4"
      gap="$4"
      items="center"
      opacity={props.disabled ? 0.75 : 1}
      cursor={props.disabled ? 'not-allowed' : 'default'}
      $gtSm={{
        maxW: 'calc(50% - 8px)',
      }}
      hoverStyle={{
        borderColor: props.checked ? '$color7' : '$color7',
      }}
    >
      <Checkbox
        bg="$color3"
        borderColor="$color5"
        hoverStyle={{
          bg: '$color4',
          borderColor: '$color6',
        }}
        {...props}
        checked={props.checked ?? false}
        size="$6"
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <YStack gap="$1" flex={1}>
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
    <Label
      flex={1}
      {...(props.id && { htmlFor: props.id })}
      p="$4"
      height="auto"
      display="flex"
      borderWidth="$0.25"
      borderColor={active ? '$color9' : '$color5'}
      rounded="$4"
      gap="$4"
      items="center"
      hoverStyle={{
        borderColor: active ? '$color10' : '$color7',
      }}
    >
      <RadioGroup.Item size="$6" {...props}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <YStack gap="$0" flex={1}>
        {children}
      </YStack>
    </Label>
  )
}

const bentoDefaults = {
  price_1QPzlaFQGtHoG6xcdRzFfWL8: {
    seats: 1,
  },
  price_1Pe0UKFQGtHoG6xcntaCw9k1: {
    seats: 1,
  },
  price_1OzPhmFQGtHoG6xcGw6ArGWp: {
    seats: 10,
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
  const price = product?.prices.find((price) => price.id === selectedPriceId)
  const priceInfo = price ? bentoDefaults[price.id] : null

  return (
    <YStack borderWidth="$0.5" rounded="$4" borderColor="$color5">
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fontWeight="bold">
            Lifetime access
          </Paragraph>
          <Paragraph flex={1} ellipsis size="$3" color="$color10">
            You own and can use the code forever.
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fontWeight="bold">
            Seats
          </Paragraph>
          <Paragraph size="$3" color="$color10" lineHeight="$2">
            Accounts given access
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{priceInfo?.seats || '-'}</Paragraph>
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
  const price = product?.prices.find((price) => price.id === selectedPriceId)
  const takeoutPriceInfo = getTakeoutPriceInfo(price?.description ?? '')
  return (
    <YStack borderWidth="$0.5" rounded="$4" borderColor="$borderColor">
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fontWeight="bold">
            Lifetime access, 1 year of updates
          </Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" color="$color10">
            You own the code for life, but only have access for a year. One-click cancel
            in your account page
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">License Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" color="$color10">
            Number of people allowed to&nbsp;develop&nbsp;on&nbsp;it
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{takeoutPriceInfo.licenseSeats}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">Discord Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" color="$color10">
            Access to the Discord #takeout room
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{takeoutPriceInfo.discordSeats}</Paragraph>
        </XStack>
      </XStack>

      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">GitHub Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" color="$color10">
            Open PRs and issues on the GitHub repo
          </Paragraph>
        </YStack>
        <XStack flex={1} items="center" gap="$2" justify="center">
          <Paragraph size="$8">{takeoutPriceInfo.githubSeats}</Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}

const checkCircle = <CheckCircle color="$green9" />
