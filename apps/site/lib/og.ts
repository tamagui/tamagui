import { getURL } from './helpers'

export const getOgUrl = (
  type: 'component' | 'default',
  title: string,
  description: string
) => {
  const q = new URLSearchParams()
  q.append('type', type)
  q.append('title', title.split(' ').join(''))
  q.append('description', description ?? '')

  return `${getURL()}/api/og?${q.toString()}`
}
