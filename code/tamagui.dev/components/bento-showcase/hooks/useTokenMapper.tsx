import { useState, useEffect, useMemo } from 'react'

import type { Tokens } from '@tamagui/core'
import { getTokens } from '@tamagui/core'
import { useUserTamaguiConfig } from './useUserTamaguiConfig'

type MergedToken = Tokens & { userMatch: Tokens }

const useTokenMapper = () => {
  const userTamaguiConfig = useUserTamaguiConfig()
  const [mappedTokens, setMappedTokens] = useState<Tokens | null>(null)
  const bentoTokens = getTokens()

  useEffect(() => {
    if (bentoTokens && userTamaguiConfig) {
      try {
        const userTokensConfig = JSON.parse(userTamaguiConfig).tamaguiConfig.tokens
        const mapped = mapBentoTokensToUserTokens(
          bentoTokens,
          userTokensConfig
        ) as MergedToken
        setMappedTokens(mapped || null)
      } catch (error) {
        console.error('Failed to parse user tamagui config:', error)
        setMappedTokens(null)
      }
    }
  }, [bentoTokens, userTamaguiConfig])

  const userTokens = userTamaguiConfig
    ? (() => {
        try {
          return JSON.parse(userTamaguiConfig)?.tamaguiConfig?.tokens
        } catch (error) {
          console.error(
            'Failed to parse user tamagui config for tokens:',
            userTamaguiConfig
          )
          return null
        }
      })()
    : null

  function mapBentoTokensToUserTokens(bentoTokens, userTokens) {
    function findClosestUserToken(bentoTokenVal, userTokens) {
      let closest = null
      let smallestDifference = Number.POSITIVE_INFINITY
      // userTokens is an object where each key is a category and each value is an object of tokens within that category.
      Object.values(userTokens).forEach((userToken: any) => {
        const difference = Math.abs(userToken.val - bentoTokenVal)
        if (difference < smallestDifference) {
          smallestDifference = difference
          closest = userToken as typeof closest
        }
      })

      return closest
    }

    const mappedTokens = {}

    Object.keys(bentoTokens).forEach((category) => {
      if (!userTokens[category]) {
        console.error(`No user tokens found for category: ${category}`)
        return
      }

      mappedTokens[category] = {}

      Object.entries(bentoTokens[category]).forEach(([key, bentoToken]) => {
        // Ensure we're comparing like with like
        if (userTokens[category] && userTokens[category][key]) {
          const closestUserToken = findClosestUserToken(
            // @ts-expect-error
            bentoToken.val,
            userTokens[category]
          )
          if (closestUserToken) {
            mappedTokens[category][key] = {
              // @ts-expect-error
              ...bentoToken,
              userMatch: closestUserToken, // Adjusted to directly use closestUserToken
            }
          } else {
            // If no closest token is found, keep the original
            mappedTokens[category][key] = bentoToken
          }
        }
      })
    })

    return mappedTokens
  }

  return {
    mappedTokens,
    userTokens,
    bentoTokens,
  }
}

export default useTokenMapper
