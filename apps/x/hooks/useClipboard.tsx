import { useEffect, useState } from 'react'
import { useEvent } from 'tamagui'

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}

export function useClipboard(text = '', timeout = 1500) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = useEvent(async () => {
    await copyToClipboard(text)
    setHasCopied(true)
  })

  useEffect(() => {
    if (!hasCopied) return
    const id = setTimeout(() => {
      setHasCopied(false)
    }, timeout)
    return () => clearTimeout(id)
  }, [timeout, hasCopied])

  return { value: text, onCopy, hasCopied }
}
