import { getURL } from 'one'

export const getOgUrl = ({
  type,
  ...params
}: { type?: 'component' } & Record<string, string | undefined>) => {
  const q = new URLSearchParams()
  if (type) {
    q.append('type', type)
  }
  for (const param of Object.keys(params)) {
    const val = params[param]
    if (typeof val !== 'undefined') {
      q.append(param, val)
    }
  }

  return `${getURL()}/api/og?${q.toString()}`
}
