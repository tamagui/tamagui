import fetch from 'node-fetch'
import querystring from 'node:querystring'
import { Octokit } from 'octokit'
import React from 'react'
import useSWR from 'swr'
import { AppContext, debugLog } from '../commands/index.js'
import { useNavigate } from 'react-router-dom'

interface GithubUserData {
  login: string
  id: number
  node_id: string
}

export const useFetchComponent = () => {
  const { installState, tokenStore } = React.useContext(AppContext)
  const { access_token } = tokenStore.get?.('token') ?? {}
  const [githubData, setGithubData] = React.useState<GithubUserData | null>(null)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!access_token) {
      navigate('/auth')
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

  const apiBase = process.env.API_BASE || 'https://tamagui.dev'
  const codePath = query ? `${apiBase}/api/bento/code-download?${query}` : apiBase

  const { data, error, isLoading } = useSWR(
    installState.installingComponent ? codePath : null,
    async (url) => {
      const response = await fetcher(url)
      const filesData: Record<
        string,
        Array<{ path: string; downloadUrl: string }>
      > = JSON.parse(response)

      debugLog('Files data', filesData)

      const downloadedFiles: Record<
        string,
        Array<{ path: string; filePlainText: string }>
      > = {}

      for (const [category, files] of Object.entries(filesData)) {
        downloadedFiles[category] = await Promise.all(
          files.map(
            async (file: {
              path: string
              downloadUrl: string
            }) => {
              const fileContent = await fetcher(file.downloadUrl)
              return {
                path: file.path,
                filePlainText: fileContent,
              }
            }
          )
        )
      }
      debugLog(
        'Downloaded files',
        Object.keys(downloadedFiles).map((key) =>
          downloadedFiles[key].map((x) => {
            return {
              path: x.path,
              filePlainText: x.filePlainText.substring(0, 50) + '...',
            }
          })
        )
      )
      return downloadedFiles
    },
    {
      loadingTimeout: 3000,
    }
  )

  React.useEffect(() => {
    if (error?.info?.error?.includes('user is not authenticated')) {
      tokenStore.delete('token')
    }
  }, [error, tokenStore])

  return { data, error, isLoading }
}
