import { ThemeTintAlt } from '@tamagui/logo'
import { Check, CheckCircle, XCircle, ExternalLink } from '@tamagui/lucide-icons'
import type { ButtonProps, CheckboxProps, RadioGroupItemProps } from 'tamagui'
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

import { Link, usePathname } from 'vxs'

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
  const isBento = usePathname().startsWith('/bento')

  const contents = (
    <Button size="$5" borderWidth={2} {...props}>
      <Button.Text size="$3" ff="$silkscreen">
        {props.children}
      </Button.Text>
    </Button>
  )

  if (isBento) {
    return contents
  }

  return <ThemeTintAlt offset={isBento ? -1 : 1}>{contents}</ThemeTintAlt>
}

export const MunroP = styled(Paragraph, {
  // className: 'pixelate',
  fontFamily: '$munro',
})

export function DemoButton(props: ButtonProps) {
  return (
    <ThemeTintAlt offset={1}>
      <Link href="https://unistack-next-delta.vercel.app/" target="_blank" asChild>
        <Button size="$5" borderWidth={2} {...props}>
          <Button.Icon>
            <ExternalLink />
          </Button.Icon>
          <Button.Text size="$3" ff="$silkscreen">
            {props.children}
          </Button.Text>
        </Button>
      </Link>
    </ThemeTintAlt>
  )
}

export const RadioGroupItem = ({
  children,
  active,
  ...props
}: RadioGroupItemProps & { active: boolean }) => {
  return (
    <Label
      f={1}
      htmlFor={props.id}
      p="$4"
      height="unset"
      display="flex"
      borderWidth="$0.25"
      borderColor={active ? '$color9' : '$color5'}
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
  )
}

const bentoDefaults = {
  price_1OiqquFQGtHoG6xcZxZaVF2B: {
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
            {price?.metadata?.['is_lifetime']
              ? 'You own and can use the code forever, get updates forever.'
              : "You own and can use the code for life, get updates as long as you're subscribed."}
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
