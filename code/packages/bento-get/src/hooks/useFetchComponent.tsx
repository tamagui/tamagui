import fetch from 'node-fetch'
import React from 'react'
import useSWR from 'swr'
import { AppContext } from '../data/AppContext.js'
import { debugLog } from '../commands/index.js'

export const useFetchComponent = () => {
  const { installState } = React.useContext(AppContext)

  const fetcher = async (url: string) => {
    debugLog('fetcher', url)
    const res = await fetch(url)

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.') as Error & {
        info?: any
        status?: number
      }
      error.info = await res.text()
      error.status = res.status
      throw error
    }

    return await res.text()
  }

  const apiBase = process.env.API_BASE || 'https://v3.tamagui.dev'
  const component = installState.installingComponent
  const codePath = component
    ? `${apiBase}/bento-manifests/${[
        component.category,
        component.categorySection,
        `${component.fileName}.json`,
      ]
        .map((part) => encodeURIComponent(part))
        .join('/')}`
    : null

  const { data, error, isLoading } = useSWR(
    codePath,
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
          files.map(async (file: { path: string; downloadUrl: string }) => {
            const fileContent = await fetcher(
              new URL(file.downloadUrl, apiBase).toString()
            )
            return {
              path: file.path,
              filePlainText: fileContent,
            }
          })
        )
      }
      debugLog(
        'Downloaded files',
        Object.keys(downloadedFiles).map((key) =>
          downloadedFiles[key].map((x) => ({
            path: x.path,
            filePlainText: x.filePlainText.substring(0, 50) + '...',
          }))
        )
      )
      return downloadedFiles
    },
    {
      loadingTimeout: 3000,
    }
  )

  return { data, error, isLoading }
}
