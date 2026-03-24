import { useLayoutEffect, useMemo, useRef } from 'react'
import { useEvent } from '@tamagui/use-event'
import type { ElementProps, FloatingInteractionContext, UseTypeaheadProps } from './types'
import { clearTimeoutIfSet, stopEvent } from './utils'

// typeahead: character buffer matching against list items
// ported from floating-ui/react useTypeahead
export function useTypeahead(
  context: FloatingInteractionContext,
  props: UseTypeaheadProps
): ElementProps {
  const { open, dataRef } = context
  const {
    listRef,
    activeIndex,
    onMatch: unstable_onMatch,
    onTypingChange: unstable_onTypingChange,
    enabled = true,
    findMatch = null,
    resetMs = 750,
    ignoreKeys = [],
    selectedIndex = null,
  } = props

  const timeoutIdRef = useRef(-1)
  const stringRef = useRef('')
  const prevIndexRef = useRef<number | null>(selectedIndex ?? activeIndex ?? -1)
  const matchIndexRef = useRef<number | null>(null)

  // stable callbacks via useEvent
  const onMatch = useEvent(unstable_onMatch || (() => {}))
  const onTypingChange = useEvent(unstable_onTypingChange || (() => {}))

  // latest-value refs
  const findMatchRef = useRef(findMatch)
  findMatchRef.current = findMatch
  const ignoreKeysRef = useRef(ignoreKeys)
  ignoreKeysRef.current = ignoreKeys

  useLayoutEffect(() => {
    if (open) {
      clearTimeoutIfSet(timeoutIdRef)
      matchIndexRef.current = null
      stringRef.current = ''
    }
  }, [open])

  useLayoutEffect(() => {
    // sync arrow key navigation but not typeahead navigation
    if (open && stringRef.current === '') {
      prevIndexRef.current = selectedIndex ?? activeIndex ?? -1
    }
  }, [open, selectedIndex, activeIndex])

  const setTypingChange = (value: boolean) => {
    if (value) {
      if (!dataRef.current.typing) {
        dataRef.current.typing = value
        onTypingChange(value)
      }
    } else {
      if (dataRef.current.typing) {
        dataRef.current.typing = value
        onTypingChange(value)
      }
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    function getMatchingIndex(
      list: Array<string | null>,
      orderedList: Array<string | null>,
      string: string
    ) {
      const str = findMatchRef.current
        ? findMatchRef.current(orderedList, string)
        : orderedList.find(
            (text) => text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) === 0
          )

      return str ? list.indexOf(str) : -1
    }

    const listContent = listRef.current

    if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
      if (getMatchingIndex(listContent, listContent, stringRef.current) === -1) {
        setTypingChange(false)
      } else if (event.key === ' ') {
        stopEvent(event)
      }
    }

    if (
      listContent == null ||
      ignoreKeysRef.current.includes(event.key) ||
      // character key
      event.key.length !== 1 ||
      // modifier key
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return
    }

    if (open && event.key !== ' ') {
      stopEvent(event)
      setTypingChange(true)
    }

    // bail out if the list contains a word like "llama" or "aaron"
    const allowRapidSuccessionOfFirstLetter = listContent.every((text) =>
      text ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase() : true
    )

    // allows the user to cycle through items that start with the same letter
    // in rapid succession
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = ''
      prevIndexRef.current = matchIndexRef.current
    }

    stringRef.current += event.key
    clearTimeoutIfSet(timeoutIdRef)
    timeoutIdRef.current = window.setTimeout(() => {
      stringRef.current = ''
      prevIndexRef.current = matchIndexRef.current
      setTypingChange(false)
    }, resetMs)

    const prevIndex = prevIndexRef.current

    const index = getMatchingIndex(
      listContent,
      [
        ...listContent.slice((prevIndex || 0) + 1),
        ...listContent.slice(0, (prevIndex || 0) + 1),
      ],
      stringRef.current
    )

    if (index !== -1) {
      onMatch(index)
      matchIndexRef.current = index
    } else if (event.key !== ' ') {
      stringRef.current = ''
      setTypingChange(false)
    }
  }

  const reference: ElementProps['reference'] = useMemo(
    () => ({ onKeyDown: onKeyDown as any }),
    [open, enabled]
  )

  const floating: ElementProps['floating'] = useMemo(
    () => ({
      onKeyDown: onKeyDown as any,
      onKeyUp(event: React.KeyboardEvent) {
        if (event.key === ' ') {
          setTypingChange(false)
        }
      },
    }),
    [open, enabled]
  )

  return useMemo(
    () => (enabled ? { reference, floating } : {}),
    [enabled, reference, floating]
  )
}
