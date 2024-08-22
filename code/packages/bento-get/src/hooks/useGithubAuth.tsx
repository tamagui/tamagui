import querystring from 'node:querystring'

import fetch from 'node-fetch'
import open from 'open'
// @ts-nocheck
import React from 'react'
import useSWR from 'swr'

import { GITHUB_CLIENT_ID } from '../constants.js'
import { useGithubAuthPooling } from './useGithubAuthPooling.js'

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      scope: 'read:org',
    }),
  })
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as Error & {
      info?: any
      status?: number
    }
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  const result = await res.text()
  return result
}

export type GithubCode = {
  device_code: string
  expires_in: string
  interval: string
  user_code: string
  verification_uri: string
}

export const useGithubAuth = () => {
  const { data, error, isLoading } = useSWR<string>(
    'https://github.com/login/device/code',
    fetcher
  )

  const parsedData = React.useMemo(() => {
    if (!data) return null
    return querystring.parse(data) as unknown as GithubCode
  }, [data])

  const openLoginUrl = React.useCallback(() => {
    if (parsedData) {
      open(parsedData.verification_uri)
    }
  }, [parsedData])

  if (parsedData) {
    useGithubAuthPooling({ deviceCodeData: parsedData })
  }

  return {
    data: parsedData,
    error,
    isLoading,
    openLoginUrl,
  }
}
