import { useState } from 'react'
import { SizableText, Tabs, Text, YStack } from 'tamagui'

const modes = ['tamagui', 'tailwind'] as const

export function HomeStyleToggle() {
  const [mode, setMode] = useState<string>('tamagui')

  return (
    <Tabs
      activationMode="manual"
      orientation="horizontal"
      value={mode}
      onValueChange={setMode}
      width="100%"
    >
      <YStack gap="3">
        <YStack self="flex-start">
          <Tabs.List loop={false} aria-label="style syntax" gap="1">
            {modes.map((value) => {
              const active = mode === value
              return (
                <Tabs.Tab
                  key={value}
                  value={value}
                  px="2-5"
                  py="1"
                  rounded="4"
                  cursor="pointer"
                  transition="quickest"
                  // the selected tab inverts: a solid color12 capsule with the
                  // label flipped onto it. it is the tab's own style rather than
                  // a measured overlay, so it is right in the server render and
                  // cannot go stale when the row reflows.
                  bg={active ? 'color12' : 'transparent hover:color4'}
                >
                  <SizableText
                    size="2"
                    color={active ? 'color1' : 'color10'}
                    textTransform="capitalize"
                  >
                    {value}
                  </SizableText>
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </YStack>

        {/* fixed height so switching modes doesn't resize the hero row */}
        <Tabs.Content value={mode} forceMount height={370}>
          <Text
            render="pre"
            margin={0}
            fontFamily="mono"
            fontSize={12}
            lineHeight={18}
            color="color12"
          >
            {mode === 'tailwind' ? tailwind : tamagui}
          </Text>
        </Tabs.Content>
      </YStack>
    </Tabs>
  )
}

const keyword = 'purple10'
const str = 'green10'
const tag = 'blue10'
const dim = 'color10'

const tamagui = (
  <>
    <Text color={keyword}>import</Text>
    {` { html, styled } from `}
    <Text color={str}>'tamagui'</Text>
    {'\n\n'}
    <Text color={tag}>{'<html.button'}</Text>
    {'\n  px='}
    <Text color={str}>{'"4"'}</Text>
    {'\n  py='}
    <Text color={str}>{'"2"'}</Text>
    {'\n  rounded='}
    <Text color={str}>{'"4"'}</Text>
    {'\n  bg='}
    <Text color={str}>{'"blue9 hover:blue10"'}</Text>
    {'\n'}
    <Text color={tag}>{'>'}</Text>
    {'\n  '}
    <Text color={tag}>{'<html.span'}</Text>
    {' color='}
    <Text color={str}>{'"white"'}</Text>
    <Text color={tag}>{'>'}</Text>
    {'Ship it'}
    <Text color={tag}>{'</html.span>'}</Text>
    {'\n'}
    <Text color={tag}>{'</html.button>'}</Text>
    {'\n\n'}
    <Text color={dim}>{'// or lift it into a component'}</Text>
    {'\n'}
    <Text color={keyword}>const</Text>
    {' Button = '}
    <Text color={tag}>styled</Text>
    {'(html.button, {'}
    {'\n  px: '}
    <Text color={str}>{"'4'"}</Text>
    {',\n  py: '}
    <Text color={str}>{"'2'"}</Text>
    {',\n  rounded: '}
    <Text color={str}>{"'4'"}</Text>
    {',\n  bg: {'}
    {'\n    default: '}
    <Text color={str}>{"'blue9'"}</Text>
    {',\n    hover: '}
    <Text color={str}>{"'blue10'"}</Text>
    {',\n  },\n})'}
  </>
)

const tailwind = (
  <>
    <Text color={keyword}>import</Text>
    {` { html, styled }\n  from `}
    <Text color={str}>'@tamagui/tailwind'</Text>
    {'\n\n'}
    <Text color={tag}>{'<html.button'}</Text>
    {'\n  className='}
    <Text color={str}>
      {'"px-4 py-2 rounded-lg\n             bg-blue-500 hover:bg-blue-600"'}
    </Text>
    {'\n'}
    <Text color={tag}>{'>'}</Text>
    {'\n  '}
    <Text color={tag}>{'<html.span'}</Text>
    {' className='}
    <Text color={str}>{'"text-white"'}</Text>
    <Text color={tag}>{'>'}</Text>
    {'Ship it'}
    <Text color={tag}>{'</html.span>'}</Text>
    {'\n'}
    <Text color={tag}>{'</html.button>'}</Text>
    {'\n\n'}
    <Text color={dim}>{'// or lift it into a component'}</Text>
    {'\n'}
    <Text color={keyword}>const</Text>
    {' Button = '}
    <Text color={tag}>styled</Text>
    {'(html.button, '}
    <Text color={str}>{"'px-4 py-2 rounded-lg'"}</Text>
    {', {'}
    {'\n  variants: {'}
    {'\n    tone: {'}
    {'\n      solid: '}
    <Text color={str}>{"'bg-blue-500 hover:bg-blue-600'"}</Text>
    {',\n      ghost: '}
    <Text color={str}>{"'hover:bg-blue-50'"}</Text>
    {',\n    },\n  },\n})'}
  </>
)
