import fetch from 'node-fetch'

export const getOctokit = async () => {
  const { Octokit } = await import('octokit')

  return new Octokit({
    auth: process.env.GITHUB_ADMIN_TOKEN,
    request: {
      fetch,
    },
  })
}
