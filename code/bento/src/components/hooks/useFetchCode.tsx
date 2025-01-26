import { useState } from 'react'

type Params = {
  cacheTime?: number
}
export function useFetchCode(params?: Params) {
  // default cache time is 5 minute
  const { cacheTime = 1000 * 60 * 5 } = params || {}
  const [data, setData] = useState<string>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  const fetchData = async (url: string) => {
    if (!url || status === 'loading') return
    setStatus('loading')
    if (localStorage.getItem(url)) {
      const storedData = JSON.parse(localStorage.getItem(url) as string)
      if (storedData.timestamp + cacheTime > Date.now()) {
        setData(storedData.data)
        setStatus('success')
        return
      }
    }
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        if (data) {
          localStorage.setItem(url, JSON.stringify({ data, timestamp: Date.now() }))
          setData(data)
          setStatus('success')
        }
      })
      .catch(() => setStatus('error'))
  }

  return { data, status, fetchData }
}
