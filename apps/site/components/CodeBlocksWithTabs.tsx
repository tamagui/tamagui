import React, { memo, useEffect, useMemo, useState } from 'react'
import { Separator, Tabs, YStack, useDidFinishSSR } from 'tamagui'

interface Props {
  hero: boolean
  line: boolean
  scrollable: boolean
  children: JSX.Element[]
  id: string
  className: string
  showLineNumbers: boolean
  collapsible: boolean
  rest: any
}

export default function CodeBlocksWithTabs(props: Props) {
  const {
    hero,
    line,
    scrollable,
    className,
    children,
    id,
    showLineNumbers,
    collapsible,
    ...rest
  } = props
  const didSSRFinish = useDidFinishSSR()

  const stateKey = useMemo(() => {
    let key: string = ''

    for (const child of children) {
      key += child.props.id
    }

    return key
  }, [children])

  const [state, setState] = useState<string>()

  function handleChange(v: string) {
    setState(v)
    localStorage.setItem(stateKey, v)
    window.dispatchEvent(new Event('storage'))
  }

  // This might seem redundant, but it's necessary for other nodes to update
  function onStorage() {
    setState(localStorage.getItem(stateKey) ?? children[0].props.id)
  }

  useEffect(() => {
    if (didSSRFinish) {
      setState(localStorage.getItem(stateKey) ?? children[0].props.id)

      window.addEventListener('storage', onStorage)
    }

    ;() => {
      if (didSSRFinish) {
        window.removeEventListener('storage', onStorage)
      }
    }
  }, [])

  return (
    <Tabs
      flexDirection="column"
      // defaultValue={state[stateKey] ?? children[0].props.id}
      value={state ?? children[0].props.id}
      orientation="horizontal"
      my="$4"
      theme="alt1"
      onValueChange={handleChange}
    >
      <Tabs.List>
        {children.map((child, index) => {
          return (
            <Tabs.Tab
              borderWidth={1}
              borderColor={'$backgroundPress'}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              value={child.props.id}
              size="$3"
              key={index}
            >
              {child.props.id}
            </Tabs.Tab>
          )
        })}
      </Tabs.List>

      {children.map((child, index) => {
        return (
          <Tabs.Content
            backgroundColor="$background"
            borderWidth={1}
            borderColor={'$backgroundPress'}
            borderRadius="$2"
            borderTopLeftRadius={0}
            key={index}
            value={child.props.id}
            flex={1}
          >
            {child}
          </Tabs.Content>
        )
      })}
    </Tabs>
  )
}
