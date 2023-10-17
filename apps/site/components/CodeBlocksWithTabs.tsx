import React, { memo, useMemo } from 'react'
import { Separator, Tabs, YStack } from 'tamagui'

import { DocCodeBlock } from './DocsCodeBlock'

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

  return (
    <Tabs
      flexDirection="column"
      defaultValue={children[0].props.id}
      orientation="horizontal"
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
