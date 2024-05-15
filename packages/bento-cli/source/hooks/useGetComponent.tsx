// @ts-nocheck
import { useContext, useEffect, useMemo, useState } from 'react'
import fetch from 'node-fetch'
import useSWR from 'swr'
import { AppContext } from '../commands/index.js'
import { Octokit } from 'octokit'
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

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
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

  const codePath = useMemo(() => {
    // if (!installComponent) return "";
    // return `https://tamagui.dev/api/bento/code/${installComponent.category}/${installComponent.categorySection}/${installComponent.fileName}`;
    // return "https://tamagui.dev/api/bento/code/elements/tables/UsersTable"; //free
    // return "https://tamagui.dev/api/bento/code/elements/tables/Basic"; //paid
    return `http://localhost:5005/api/bento/code/${install.installingComponent?.category}/${install.installingComponent?.categorySection}/${install.installingComponent?.fileName}?userGithubId=${githubData?.node_id}` //paid
  }, [install, githubData])

  const { data, error, isLoading } = useSWR<string>(
    githubData?.id && install.installingComponent ? codePath : null,
    fetcher
  )

  if (error) console.log('error:', error)
  if (data) console.log('data is this', Boolean(data.length))

  if (data) {
    console.log('on if data')

    installComponent({ component: data, setInstall, install })
  }
  //   return { data, error, isLoading }
}
