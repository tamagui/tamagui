import { Octokit } from 'octokit'
import fetch from 'node-fetch'

export const octokit = new Octokit({
  auth: process.env.GITHUB_ADMIN_TOKEN,
  request: {
    fetch,
  },
})
