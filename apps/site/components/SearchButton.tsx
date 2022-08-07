import { Search as SearchIcon } from '@tamagui/feather-icons'
import React from 'react'
import { memo, useContext, useEffect, useRef } from 'react'
import { Button, ButtonProps, TooltipSimple, useIsTouchDevice } from 'tamagui'

import { SearchContext } from './SearchContext'

export const SearchButton = memo((props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext)
  const isTouch = useIsTouchDevice()
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
    <TooltipSimple groupId="header-actions-search" label="Search docs..">
      <Button
        accessibilityLabel="Search docs"
        ref={ref as any}
        onPress={onOpen}
        icon={SearchIcon}
        iconAfter={
          isTouch ? null : (
            // TODO shouldn't need tag="span" if buttoninbutton context works - test + in prod
            <Button size="$2" chromeless borderWidth={0} pe="none" o={0.35}>
              /
            </Button>
          )
        }
        {...props}
      />
    </TooltipSimple>
  )
})
