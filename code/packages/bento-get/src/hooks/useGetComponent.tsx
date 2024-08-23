import fetch from 'node-fetch'
import querystring from 'node:querystring'
import { Octokit } from 'octokit'
import React from 'react'
import useSWR from 'swr'
import { AppContext } from '../commands/index.js'

interface GithubUserData {
  login: string
  id: number
  node_id: string
}

export const useGetComponent = () => {
  const { installState, tokenStore, setCurrentScreen } = React.useContext(AppContext)
  const { access_token } = tokenStore.get?.('token') ?? {}
  const [githubData, setGithubData] = React.useState<GithubUserData | null>(null)

  React.useEffect(() => {
    if (!access_token) {
      setCurrentScreen('AuthScreen')
      return
    }
    const octokit = new Octokit({
      auth: access_token,
    })
    const fetchGithubData = async () => {
      try {
        const { data } = await octokit.rest.users.getAuthenticated()
        setGithubData(data)
      } catch (error) {
        console.error('Failed to authenticate:', error)
      }
    }
    fetchGithubData()
  }, [access_token, installState.installingComponent])

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token || ''}`,
      },
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

  const query =
    installState.installingComponent?.category &&
    installState.installingComponent?.categorySection &&
    querystring.stringify({
      section: installState.installingComponent?.category,
      part: installState.installingComponent?.categorySection,
      fileName: installState.installingComponent?.fileName,
      userGithubId: githubData?.node_id || '',
    })

  const codePath = query ? `https://tamagui.dev/api/bento/code?${query}` : ''

  const { data, error, isLoading } = useSWR(
    installState.installingComponent ? codePath : null,
    fetcher,
    {
      loadingTimeout: 3000,
    }
  )

  React.useEffect(() => {
    if (error?.info?.error?.includes('user is not authenticated')) {
      tokenStore.delete('token')
    }
  }, [error, tokenStore, setCurrentScreen])

  return { data, error, isLoading }
}
