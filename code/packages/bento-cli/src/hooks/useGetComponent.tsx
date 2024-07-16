// @ts-nocheck
import fetch from 'node-fetch'
import querystring from 'node:querystring'
import { Octokit } from 'octokit'
import { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { AppContext } from '../commands/index.js'
import { installComponent } from './useInstallComponent.js'

export const useGetComponent = async () => {
  const { install, tokenStore, setInstall } = useContext(AppContext)
  const { access_token } = tokenStore.get?.('token') ?? {}
  const [githubData, setGithubData] = useState(null)

  useEffect(() => {
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
      githubId: githubData?.node_id || '',
    })

  const codePath = `https://tamagui.dev/api/bento/code?${query}`

  const { data, error, isLoading } = useSWR(
    install.installingComponent ? codePath : null,
    fetcher,
    {
      loadingTimeout: 3000,
    }
  )

  if (data) {
    await installComponent({ component: data, setInstall, install })
  }

  return { data, error, isLoading }
}
