import { useEffect, useState } from 'react'
import { useEvent } from 'tamagui'

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}

export function useClipboard(
  text = '',
  { timeout = 1500, showToast = true }: { timeout?: number; showToast?: boolean } = {}
) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = async (string: string = text) => {
    await copyToClipboard(string)
    setHasCopied(true)
  }

  useEffect(() => {
    if (!hasCopied) return
    const id = setTimeout(() => {
      setHasCopied(false)
    }, timeout)
    return () => clearTimeout(id)
  }, [timeout, hasCopied])

  return { value: text, onCopy, hasCopied, timeout }
}
