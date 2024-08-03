// @ts-nocheck
import React from 'react'
import fetch from 'node-fetch'
import querystring from 'node:querystring'
import { Octokit } from 'octokit'

import useSWR from 'swr'
import { AppContext } from '../commands/index.js'
import { installComponent } from './useInstallComponent.js'
import { useForceUpdate } from '@tamagui/use-force-update'

export const useGetComponent = () => {
  const forceUpdate = useForceUpdate()
  const { install, tokenStore, setInstall } = React.useContext(AppContext)
  const { access_token } = tokenStore.get?.('token') ?? {}
  const [githubData, setGithubData] = React.useState(null)

  React.useEffect(() => {
    if (!access_token) {
      return
    }
    const octokit = new Octokit({
      auth: access_token,
    })
    const fetchGithubData = async () => {
      const { data } = await octokit.rest.users.getAuthenticated()
      setGithubData(data)
    }
    fetchGithubData()
  }, [access_token, install.installingComponent])

  const fetcher = async (url) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token || ''}`,
      },
    })

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.info = await res.json()
      error.status = res.status
      throw error
    }

    const result = await res.text()

    return result
  }

  const query =
    install.installingComponent?.category &&
    install.installingComponent?.categorySection &&
    querystring.stringify({
      section: install.installingComponent?.category,
      part: install.installingComponent?.categorySection,
      fileName: install.installingComponent?.fileName,
      userGithubId: githubData?.node_id || '',
    })

  const codePath = query ? `https://tamagui.dev/api/bento/code?${query}` : ''

  const { data, error, isLoading } = useSWR(
    install.installingComponent ? codePath : null,
    fetcher,
    {
      loadingTimeout: 3000,
    }
  )

  // useEffect(() => {
  //   if (error?.info?.error.includes('user is not authenticated')) {
  //     tokenStore.delete('token')
  //     forceUpdate()
  //   }
  // }, [error])

  React.useEffect(() => {
    if (data) {
      installComponent({ component: data, setInstall, install })
    }
  }, [data])

  return { data, error, isLoading }
}
