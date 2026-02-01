import useSWR from 'swr'
import { authFetch } from '~/features/api/authFetch'

export type Project = {
  id: string
  user_id: string
  name: string
  domain: string
  license_purchased_at: string
  updates_expire_at: string
  upgrade_subscription_id: string | null
  created_at: string
  project_team_members?: {
    id: string
    user_id: string
    role: 'owner' | 'member'
    invited_at: string
  }[]
}

export type ProjectsResponse = {
  owned: Project[]
  member: Project[]
}

const fetcher = async (url: string) => {
  const res = await authFetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return res.json()
}

export const useProjects = (shouldFetch = true) => {
  const { data, error, isLoading, mutate } = useSWR<ProjectsResponse>(
    shouldFetch ? '/api/projects' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    }
  )

  return {
    projects: data?.owned || [],
    memberProjects: data?.member || [],
    allProjects: [...(data?.owned || []), ...(data?.member || [])],
    isLoading: shouldFetch ? isLoading : false,
    error,
    refresh: mutate,
  }
}

export const createProject = async (project: { name: string; domain: string }) => {
  const res = await authFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to create project')
  }

  return res.json()
}

export const updateProject = async (
  projectId: string,
  updates: { name?: string; domain?: string }
) => {
  const res = await authFetch('/api/projects', {
    method: 'PUT',
    body: JSON.stringify({ project_id: projectId, ...updates }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to update project')
  }

  return res.json()
}
