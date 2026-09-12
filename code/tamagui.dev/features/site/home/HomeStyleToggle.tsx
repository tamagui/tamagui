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
      <YStack gap="5">
        <YStack self="flex-start">
          <Tabs.List
            loop={false}
            aria-label="style syntax"
            position="relative"
            gap={0}
            rounded="4"
          >
            <div
              id="indicator"
              className="indicator"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '50%',
                backgroundColor: 'var(--color-12)',
                borderRadius: 4,
                transform: mode === 'tamagui' ? 'translateX(0%)' : 'translateX(100%)',
                transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            {modes.map((value) => {
              const active = mode === value
              return (
                <Tabs.Tab
                  key={value}
                  value={value}
                  onPress={() => setMode(value)}
                  px="2-5"
                  py="1"
                  width={72}
                  items="center"
                  justify="center"
                  rounded="4"
                  cursor="pointer"
                  bg="transparent"
                  zIndex={1}
                >
                  <SizableText
                    size="2"
                    color={active ? 'color-1' : 'color-10'}
                    textTransform="capitalize"
                    transition="quickest"
                  >
                    {value}
                  </SizableText>
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </YStack>

        {/* fixed height so switching modes doesn't resize the hero row. sized to
            the taller of the two samples (tamagui, 378) plus the padding and
            border, since the box is border-box: at 370 the code ran past the
            bottom edge, which the border made visible */}
        <Tabs.Content
          value={mode}
          forceMount
          height={406}
          p="3"
          rounded="4"
          borderWidth={0.5}
          borderColor="color-3"
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
        </Tabs.Content>
      </YStack>
    </Tabs>
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
