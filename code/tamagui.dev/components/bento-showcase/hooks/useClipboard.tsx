import { useEffect, useState } from 'react'
import { useEvent } from 'tamagui'

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}

export function useClipboard(text = '', timeout = 1500) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = useEvent(async () => {
    console.info(`Copying`, text)
    setHasCopied(false)
    await copyToClipboard(text)
    setHasCopied(true)
  })

  const resetState = useEvent(() => {
    setHasCopied(false)
  })

  return { value: text, onCopy, hasCopied, resetState }
}
