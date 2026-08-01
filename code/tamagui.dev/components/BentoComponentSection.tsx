import { listingData } from './bento-showcase/data'
import { useStore } from '@tamagui/use-store'
import { useMemo, useRef, useState } from 'react'
import { H3, ScrollView, Spacer, XStack, YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { ComponentItem } from './BentoComponentItem'

export class BentoStore {
  heroVisible = true
  heroHeight = 800
}

export const ComponentSection = () => {
  const inputRef = useRef<HTMLInputElement>(null)
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
      render={
        <div
          onTransitionEnd={() => {
            if (!store.heroVisible) {
              inputRef.current?.focus()
            }
          }}
        />
      }
      bg="color2"
      position="relative"
      contain="paint"
      pb={200}
      y={0}
      minHeight={800}
      {...(!store.heroVisible && {
        y: -store.heroHeight + 20,
        shadowColor: 'shadow-color',
        shadowRadius: 20,
      })}
      z={10000}
      className="transform ease-in-out ms200"
    >
      <YStack>
        <YStack gap="4">
          {filteredSections.map(({ sectionName, parts }, index) => {
            return (
              <YStack py="4" justify="space-between" id={sectionName} key={sectionName}>
                <YStack position="relative">
                  <ContainerLarge>
                    <YStack py="4" px="3" position="relative">
                      <H3
                        fontFamily="mono"
                        letterSpacing={3}
                        textTransform="uppercase"
                        color="color10"
                        flex={2}
                        size="3"
                      >
                        {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
                      </H3>
                    </YStack>
                  </ContainerLarge>
                </YStack>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    minW: '100%',
                  }}
                >
                  <ContainerLarge>
                    <XStack
                      columnGap="4"
                      rowGap="4 gtMd:20"
                      flex={1}
                      flexBasis="auto"
                      shrink={1}
                      maxW="gtMd:100%"
                      flexWrap={`gtMd:${store.heroVisible ? 'wrap' : 'nowrap'}`}
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

                      <Spacer width="calc(50vw - 300px)" display="gtMd:none" />
                    </XStack>
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
