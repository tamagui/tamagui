import { Search as SearchIcon } from '~/components/icons'
import { memo, useContext, useEffect, useRef } from 'react'
import { TooltipSimple } from 'tamagui'

import { Button, type ButtonProps } from '~/components/Button'
import { SearchContext } from '~/features/site/search/SearchContext'

export const SearchButton = memo((props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext)

  const ref = useRef(null)

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (!ref || ref.current !== document.activeElement || !onInput) {
        return
      }
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        return
      }
      onInput(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onInput, ref])

  return (
    <TooltipSimple groupId="header-actions-search" label="Search">
      <Button
        aria-label="Search docs"
        ref={ref as any}
        onPress={onOpen}
        icon={SearchIcon}
        {...props}
      />
    </TooltipSimple>
  )
})
