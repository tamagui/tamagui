import { useEffect, useState } from 'react'
import { toast } from '@tamagui/toast'

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}

export function useClipboard(
  text = '',
  { timeout = 1500, showToast = true }: { timeout?: number; showToast?: boolean } = {}
) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = async (string: any = text) => {
    await copyToClipboard(typeof string === 'string' ? string : text)
    setHasCopied(true)
    if (showToast) {
      toast('Copied to clipboard')
    }
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
