import { useState } from 'react'
import { Button, Text, View } from 'tamagui'
import { Check } from '../../icons'
import { tone } from '../../tone'

type Plan = {
  id: string
  title: string
  description: string
  monthly: number
  annual: number
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'starter',
    title: 'Starter',
    description: 'For individuals trying things out',
    monthly: 0,
    annual: 0,
    features: ['3 projects', 'Community support', 'Basic analytics'],
  },
  {
    id: 'pro',
    title: 'Pro',
    description: 'For makers shipping real products',
    monthly: 12,
    annual: 10,
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
    popular: true,
  },
  {
    id: 'team',
    title: 'Team',
    description: 'For teams that build together',
    monthly: 29,
    annual: 24,
    features: ['Everything in Pro', 'Shared workspaces', 'Roles and audit log'],
  },
]

/** ------ EXAMPLE ------ */
export function Paywall() {
  const [annual, setAnnual] = useState(true)

  return (
    <View width={880} maxW="100%" gap="6" items="center" py="6">
      <View items="center" gap="2">
        <Text fontFamily="body" fontSize="3xl" fontWeight="700" color="color-12">
          Pick your plan
        </Text>
        <Text fontFamily="body" fontSize="sm" color={tone.muted}>
          Upgrade, downgrade or cancel any time.
        </Text>
      </View>

      <BillingToggle annual={annual} onChange={setAnnual} />

      <View flexDirection="row" flexWrap="wrap" gap="4" width="100%" justify="center">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} annual={annual} />
        ))}
      </View>
    </View>
  )
}

function BillingToggle({
  annual,
  onChange,
}: {
  annual: boolean
  onChange: (annual: boolean) => void
}) {
  return (
    <View
      role="radiogroup"
      aria-label="Billing period"
      flexDirection="row"
      p="1"
      gap="1"
      rounded="full"
      bg={tone.fill}
    >
      {[false, true].map((value) => {
        const active = value === annual
        return (
          <View
            key={String(value)}
            role="radio"
            aria-checked={active}
            tabIndex={0}
            onPress={() => onChange(value)}
            flexDirection="row"
            items="center"
            gap="2"
            px="4"
            py="1.5"
            rounded="full"
            cursor="pointer"
            bg={active ? 'color-1 dark:color-7' : 'transparent'}
            boxShadow={active ? '0 1px 3px shadow-color' : undefined}
            transition="quick"
          >
            <Text
              fontFamily="body"
              fontSize="sm"
              fontWeight="500"
              color={active ? 'color-12' : tone.muted}
            >
              {value ? 'Annual' : 'Monthly'}
            </Text>
            {value && (
              <Text
                fontFamily="body"
                fontSize="xs"
                fontWeight="600"
                px="1.5"
                rounded="full"
                color="green-11"
                bg="green-3"
              >
                -20%
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annual : plan.monthly

  return (
    <View
      flexBasis={240}
      grow={1}
      maxW={300}
      p="5"
      gap="5"
      rounded="6"
      bg={tone.surface}
      borderWidth={1}
      borderColor={plan.popular ? 'color-12' : tone.border}
      boxShadow={plan.popular ? '0 8px 24px shadow-color' : '0 1px 3px shadow-color'}
    >
      <View gap="1">
        <View flexDirection="row" items="center" justify="space-between">
          <Text fontFamily="body" fontSize="base" fontWeight="600" color="color-12">
            {plan.title}
          </Text>
          {plan.popular && (
            <Text
              fontFamily="body"
              fontSize="xs"
              fontWeight="600"
              px="2"
              py="0.5"
              rounded="full"
              color={tone.onSelected}
              bg={tone.selected}
            >
              Popular
            </Text>
          )}
        </View>
        <Text fontFamily="body" fontSize="sm" color={tone.muted}>
          {plan.description}
        </Text>
      </View>

      <View flexDirection="row" items="flex-end" gap="1">
        <Text fontFamily="body" fontSize="4xl" fontWeight="700" color="color-12">
          ${price}
        </Text>
        <Text fontFamily="body" fontSize="sm" color={tone.muted} pb="1.5">
          {price ? (annual ? '/ month, billed yearly' : '/ month') : 'forever'}
        </Text>
      </View>

      <Button
        theme={plan.popular ? 'accent' : undefined}
        {...(!plan.popular && { variant: 'outlined' as const })}
      >
        {plan.monthly ? `Get ${plan.title}` : 'Start free'}
      </Button>

      <View gap="2.5">
        {plan.features.map((feature) => (
          <View key={feature} flexDirection="row" items="center" gap="2">
            <Check size={16} color="green-10" />
            <Text fontFamily="body" fontSize="sm" color="color-11">
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
