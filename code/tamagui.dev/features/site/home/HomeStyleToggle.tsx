import { useState } from 'react'
import { SizableText, Tabs, Text, YStack } from 'tamagui'
import { RovingTabIndicators, useRovingTabs } from '~/components/RovingTabs'

const modes = ['tamagui', 'tailwind'] as const

export function HomeStyleToggle() {
  const [mode, setMode] = useState<string>('tamagui')
  const { activeAt, intentAt, onInteraction } = useRovingTabs()

  return (
    <Tabs
      activationMode="manual"
      orientation="horizontal"
      value={mode}
      onValueChange={setMode}
      width="100%"
    >
      <YStack gap="4">
        <YStack self="flex-start" p="1" rounded="5">
          <RovingTabIndicators activeAt={activeAt} intentAt={intentAt} />
          <Tabs.List loop={false} aria-label="style syntax" gap="1">
            {modes.map((value) => (
              <Tabs.Tab
                key={value}
                value={value}
                px="2-5"
                py="1"
                bg="transparent"
                cursor="pointer"
                onInteraction={onInteraction}
              >
                <SizableText
                  size="2"
                  color="color11"
                  opacity={mode === value ? 1 : 0.5}
                  textTransform="capitalize"
                >
                  {value}
                </SizableText>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </YStack>

        {/* fixed height so switching doesn't shift the column, which would
            leave the roving indicator behind (it only re-measures on resize) */}
        <Tabs.Content value={mode} forceMount height={240}>
          <Text
            render="pre"
            margin={0}
            fontFamily="mono"
            fontSize={12}
            lineHeight={24}
            color="color12"
          >
            <Text color="purple10">import</Text>
            {` { View, Text } from `}
            <Text color="green10">'tamagui'</Text>
            {'\n\n'}
            {mode === 'tailwind' ? tailwind : tamagui}
          </Text>
        </Tabs.Content>
      </YStack>
    </Tabs>
  )
}

const tamagui = (
  <>
    <Text color="blue10">{'<View'}</Text>
    {'\n  px='}
    <Text color="green10">{'"4"'}</Text>
    {'\n  py='}
    <Text color="green10">{'"2"'}</Text>
    {'\n  rounded='}
    <Text color="green10">{'"4"'}</Text>
    {'\n  bg='}
    <Text color="green10">{'"blue9 hover:blue10"'}</Text>
    {'\n'}
    <Text color="blue10">{'>'}</Text>
    {'\n  '}
    <Text color="blue10">{'<Text'}</Text>
    {' color='}
    <Text color="green10">{'"white"'}</Text>
    <Text color="blue10">{'>'}</Text>
    {'Ship it'}
    <Text color="blue10">{'</Text>'}</Text>
    {'\n'}
    <Text color="blue10">{'</View>'}</Text>
  </>
)

const tailwind = (
  <>
    <Text color="blue10">{'<View'}</Text>
    {'\n  className='}
    <Text color="green10">
      {'"px-4 py-2 rounded-lg\n             bg-blue-500 hover:bg-blue-600"'}
    </Text>
    {'\n'}
    <Text color="blue10">{'>'}</Text>
    {'\n  '}
    <Text color="blue10">{'<Text'}</Text>
    {' className='}
    <Text color="green10">{'"text-white"'}</Text>
    <Text color="blue10">{'>'}</Text>
    {'Ship it'}
    <Text color="blue10">{'</Text>'}</Text>
    {'\n'}
    <Text color="blue10">{'</View>'}</Text>
  </>
)
