import { Search as SearchIcon } from '@tamagui/lucide-icons'
import { memo, useContext, useEffect, useRef } from 'react'
import type { ButtonProps } from 'tamagui'
import { Button, SizableText, TooltipSimple } from 'tamagui'

import { SearchContext } from './SearchContext'

export const SearchButton = memo((props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext)
  const ref = useRef()

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
        accessibilityLabel="Search docs"
        ref={ref as any}
        onPress={onOpen}
        icon={SearchIcon}
        // dont hide this on touchables to avoid layout shifts...
        iconAfter={
          <SizableText size="$1" mx="$1" $sm={{ maw: 0, ov: 'hidden', mx: -3 }} o={0.25}>
            /
          </SizableText>
        }
        {...props}
      />
    </TooltipSimple>
  )
})
