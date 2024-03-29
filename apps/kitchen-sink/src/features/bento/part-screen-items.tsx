import { H1, ScrollView, Separator, Spacer, YGroup, YStack } from 'tamagui'
import { createParam } from 'solito'
import * as sections from '@tamagui/bento'
import { useLayoutEffect } from 'react'
import { LinkListItem } from '../home/screen'

const { useParam } = createParam<{ id: string }>()
export function BentoPartScreenItem({ navigation }) {
  const [id] = useParam('id')
  const name = id!
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    })
  }, [name, navigation])

  // console.log(Object.values(sections[name]))

  return (
    <ScrollView>
      <YStack bg="$color2" p="$3" pt="$6" pb="$8" f={1} space>
        <YGroup size="$4" separator={<Separator />}>
          {Object.values(sections[name] ?? []).map((Component: any, index) => {
            console.log('on part screen items', '/' + Component.name)

            return (
              <YGroup.Item key={'test'}>
                <LinkListItem
                  bg="$color1"
                  href={'/' + Component.name}
                  // href={'/InputBothSideIconsExample'}
                  pressTheme
                  size="$4"
                >
                  {Component.name}
                </LinkListItem>
              </YGroup.Item>
            )
          })}
          {/* {sections.listingData.sections.map(({ parts, sectionName }) => {
            console.log('parts', parts)

            return (
              <>
                <YGroup.Item key={sectionName}>
                  <ListItem>{sectionName.toUpperCase()}</ListItem>
                </YGroup.Item>
                {parts.map(({ name, route }) => {
                  return (
                    <YGroup.Item key={route}>
                      <LinkListItem bg="$color1" href={route} pressTheme size="$4">
                        {name}
                      </LinkListItem>
                    </YGroup.Item>
                  )
                })}
              </>
            )
          })} */}
        </YGroup>
      </YStack>
    </ScrollView>
  )
  // return (
  //   <ScrollView>
  //     <YStack jc="center" ai="center" bg="$background" minWidth="100%" px="$2">
  //       {Object.values(sections[name] ?? []).map((Component, index) => {
  //         const ComponentElement = Component as React.ElementType
  //         // add navigation prop here just for components that use it. eg: TabBar
  //         return <ComponentElement key={index} navigation={navigation} />
  //       })}
  //     </YStack>
  //   </ScrollView>
  // )
}
