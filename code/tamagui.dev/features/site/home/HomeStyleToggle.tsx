import { useState } from 'react'
import { Text, YStack } from 'tamagui'
import { RovingTabs } from '~/components/RovingTabs'

const modes = ['tamagui', 'tailwind'] as const
const modeTabs = modes.map((value) => ({
  value,
  label: value[0].toUpperCase() + value.slice(1),
}))

export function HomeStyleToggle() {
  const [mode, setMode] = useState<string>('tamagui')

  return (
    <YStack gap="5" width="100%">
      <YStack self="flex-start">
        <RovingTabs
          ariaLabel="style syntax"
          items={modeTabs}
          value={mode}
          onValueChange={setMode}
          tabWidth={72}
        />
      </YStack>

      {/* fixed height so switching modes doesn't resize the hero row. sized to
            the taller of the two samples (tamagui, 378) plus the padding and
            border, since the box is border-box: at 370 the code ran past the
            bottom edge, which the border made visible */}
      <YStack
        height={430}
        p="5"
        rounded="4"
        bg="color-2"
        borderWidth={0.5}
        borderColor="color-4"
      >
        <Text
          render="pre"
          margin={0}
          fontFamily="mono"
          fontSize={12}
          lineHeight={18}
          color="color-12"
        >
          {mode === 'tailwind' ? tailwind : tamagui}
        </Text>
      </YStack>
    </YStack>
  )
}

const keyword = 'purple-10'
const str = 'green-10'
const tag = 'blue-10'
const dim = 'color-10'

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
    <Text color={str}>{'"blue-9 hover:blue-10"'}</Text>
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
    <Text color={str}>{"'blue-9'"}</Text>
    {',\n    hover: '}
    <Text color={str}>{"'blue-10'"}</Text>
    {',\n  },\n})'}
  </>
)

const tailwind = (
  <>
    <Text color={keyword}>import</Text>
    {` { html, styled } from `}
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
