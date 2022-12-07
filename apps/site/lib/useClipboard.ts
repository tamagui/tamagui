import copy from 'copy-to-clipboard'
import { useEffect, useState } from 'react'
import { useEvent } from 'tamagui'

export function useClipboard(text = '', timeout = 1500) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = useEvent(() => {
    const didCopy = copy(text)
    setHasCopied(didCopy)
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
