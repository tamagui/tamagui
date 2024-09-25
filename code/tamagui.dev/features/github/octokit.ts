export const getOctokit = async () => {
  const fetch = await import('node-fetch')
  const { Octokit } = await import('octokit')

  return new Octokit({
    auth: process.env.GITHUB_ADMIN_TOKEN,
    request: {
      fetch,
    },
  })
}
