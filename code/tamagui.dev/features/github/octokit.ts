import fetch from 'node-fetch'
import { serverEnv } from '../api/serverEnv'

export const getOctokit = async () => {
  const { Octokit } = await import('octokit')

  return new Octokit({
    auth: serverEnv('GITHUB_ADMIN_TOKEN'),
    request: {
      fetch,
    },
  })
}
