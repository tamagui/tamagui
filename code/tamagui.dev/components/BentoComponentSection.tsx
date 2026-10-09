import { bentoSections } from '@tamagui/bento/registry'
import { useStore } from '@tamagui/use-store'
import { useMemo, useRef, useState } from 'react'
import { H3, ScrollView, Spacer, XStack, YStack, style } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { ComponentItem } from './BentoComponentItem'

// a definite width at lg lets the cards' percentage widths resolve when a section is short
const scrollContentStyle = style({ minW: '100%', width: 'lg:100%' })

export class BentoStore {
  heroVisible = true
  heroHeight = 800
}

export const ComponentSection = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState('')
  const store = useStore(BentoStore)

  const filteredSections = useMemo(() => {
    const query = filter.toLowerCase()
    return bentoSections
      .map(({ section, groups }) => ({
        section,
        groups: groups.filter((group) => group.name.toLowerCase().includes(query)),
      }))
      .filter(({ groups }) => groups.length)
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
      bg="color-2"
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
          {filteredSections.map(({ section: sectionName, groups }) => {
            return (
              <YStack py="4" justify="space-between" id={sectionName} key={sectionName}>
                <YStack position="relative">
                  <ContainerLarge>
                    <YStack py="4" px="3" position="relative">
                      <H3
                        letterSpacing={3}
                        textTransform="uppercase"
                        color="color-10"
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
                  contentContainerStyle={scrollContentStyle}
                >
                  <ContainerLarge>
                    <XStack
                      columnGap="4"
                      rowGap="4 lg:8"
                      flex={1}
                      flexBasis="auto"
                      shrink={1}
                      maxW="lg:100%"
                      flexWrap={`lg:${store.heroVisible ? 'wrap' : 'nowrap'}`}
                    >
                      {groups.map(({ section, group, name, demos }) => (
                        <ComponentItem
                          key={`${section}/${group}`}
                          name={name}
                          route={`/${section}/${group}`}
                          numberOfComponents={demos.length}
                        />
                      ))}

                      <Spacer width="calc(50vw - 300px)" display="lg:none" />
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
