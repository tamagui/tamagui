import { useState } from 'react'

type SubscriptionState = {
  clientSecret: string | null
  subscriptionId: string | null
  error: Error | null
  isLoading: boolean
}

type SubscriptionOptions = {
  priceId: string
  disableAutoRenew?: boolean
}

type UpgradeOptions = {
  subscriptionId: string
  chatSupport?: boolean
  supportTier?: number
  disableAutoRenew?: boolean
}

export const useSubscription = () => {
  const [state, setState] = useState<SubscriptionState>({
    clientSecret: null,
    subscriptionId: null,
    error: null,
    isLoading: false,
  })

  const createSubscription = async ({
    priceId,
    disableAutoRenew,
  }: SubscriptionOptions) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          disableAutoRenew,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      setState((prev) => ({
        ...prev,
        clientSecret: data.clientSecret,
        subscriptionId: data.subscriptionId,
      }))

      return data
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
      }))
      throw error
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const upgradeSubscription = async ({
    subscriptionId,
    chatSupport,
    supportTier,
    disableAutoRenew,
  }: UpgradeOptions) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/upgrade-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          chatSupport,
          supportTier,
          disableAutoRenew,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade subscription')
      }

      setState((prev) => ({
        ...prev,
        clientSecret: data.clientSecret,
        subscriptionId: data.subscriptionId,
      }))

      return data
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
      }))
      throw error
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return {
    ...state,
    createSubscription,
    upgradeSubscription,
  }
}
