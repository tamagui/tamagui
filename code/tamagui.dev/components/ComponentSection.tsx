import { useStore } from '@tamagui/use-store'
import { useMemo, useRef, useState } from 'react'
import { H3, Input, ScrollView, Spacer, Theme, XStack, YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { ComponentItem } from './ComponentItem'
import { listingData } from '@tamagui/bento/data'
import { ThemeTintAlt } from '@tamagui/logo'

export class BentoStore {
  heroVisible = true
  heroHeight = 800
}

export const ComponentSection = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [filter, setFilter] = useState('')
  const store = useStore(BentoStore)

  const filteredSections = useMemo(() => {
    if (!filter) return listingData.sections
    return listingData.sections
      .map(({ sectionName, parts }) => {
        const filteredParts = parts.filter((part) => {
          return part.name.toLowerCase().includes(filter.toLowerCase())
        })
        return filteredParts.length
          ? {
              sectionName,
              parts: filteredParts,
            }
          : (undefined as never)
      })
      .filter(Boolean)
  }, [filter])

  return (
    <YStack
      bg="$color1"
      pos="relative"
      contain="paint"
      className="transform ease-in-out ms200"
      // @ts-ignore
      onTransitionEnd={() => {
        if (!store.heroVisible) {
          inputRef.current?.focus()
        }
      }}
      pb={200}
      y={0}
      minHeight={800}
      {...(!store.heroVisible && {
        y: -store.heroHeight + 20,
        shadowColor: '$shadowColor',
        shadowRadius: 20,
      })}
      zi={10000}
    >
      <YStack
        fullscreen
        zi={0}
        $theme-light={{
          bg: '$color5',
        }}
        $theme-dark={{ bg: '#000' }}
      />
      <YStack>
        {/* <ContainerLarge>
          <Input
            unstyled
            ref={inputRef as any}
            w="100%"
            size="$5"
            px="$3"
            my="$3"
            fow="200"
            value={filter}
            onChangeText={setFilter}
            placeholder="Filter..."
            placeholderTextColor="rgba(150,150,150,0.5)"
            zi={100}
          />
        </ContainerLarge> */}

        <YStack gap="$4">
          {filteredSections.map(({ sectionName, parts }, index) => {
            return (
              <YStack py="$4" id={sectionName} key={sectionName} jc={'space-between'}>
                <Theme name="tan">
                  <YStack pos="relative">
                    <YStack
                      fullscreen
                      o={0.15}
                      style={{
                        background: 'linear-gradient(transparent, var(--background02))',
                      }}
                    />
                    <ContainerLarge>
                      <YStack py="$4" px="$3" pos="relative">
                        <H3
                          ff="$silkscreen"
                          size="$3"
                          ls={3}
                          tt="uppercase"
                          color="$color10"
                          f={2}
                        >
                          {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
                        </H3>
                      </YStack>
                    </ContainerLarge>
                  </YStack>
                </Theme>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    minWidth: '100%',
                  }}
                >
                  <ContainerLarge>
                    <ThemeTintAlt offset={index}>
                      <XStack
                        gap="$5"
                        f={4}
                        fs={1}
                        $gtMd={{
                          maw: '100%',
                          fw: store.heroVisible ? 'wrap' : 'nowrap',
                          gap: 0,
                          rowGap: 20,
                        }}
                      >
                        {parts.map((props) => {
                          const { route, name, numberOfComponents } = props
                          return (
                            <ComponentItem
                              key={route + name + numberOfComponents.toString()}
                              {...props}
                            />
                          )
                        })}

                        {/* @ts-ignore */}
                        <Spacer width="calc(50vw - 300px)" $gtMd={{ dsp: 'none' }} />
                      </XStack>
                    </ThemeTintAlt>
                  </ContainerLarge>
                </ScrollView>
              </YStack>
            )
          })}
        </YStack>
      </YStack>
    </YStack>
  )
}
