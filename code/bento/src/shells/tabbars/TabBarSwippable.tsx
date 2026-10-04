import React, { useEffect, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { Animated, PanResponder } from 'react-native'
import type { TabsContentProps } from 'tamagui'
import {
  H5,
  Separator,
  Text,
  View,
  debounce,
  isWeb,
  useEvent,
  useTheme,
  Tabs,
} from 'tamagui'

const tabs = ['Tab 1', 'Tab 2', 'Tab 3']

/** ------ EXAMPLE ------ */
export const TabbarSwippable = () => {
  const boxHPosition = useRef(new Animated.Value(0)).current
  const [activeTabIndex, _setActiveTabIndex] = React.useState(0)
  const setActiveTabIndex = debounce(_setActiveTabIndex, 100)
  const activeTabRef = useRef(activeTabIndex)
  activeTabRef.current = activeTabIndex
  const dragging = useRef(false)
  const theme = useTheme()
  const [pointerWidth, setPointerWidth] = React.useState(0)

  const pointerWidthRef = useRef(pointerWidth)
  pointerWidthRef.current = pointerWidth

  const chagenActiveTab = useEvent((activeTabIndex) => {
    setActiveTabIndex(activeTabIndex)
    boxHPosition.flattenOffset()
    Animated.spring(boxHPosition, {
      toValue: activeTabIndex * pointerWidthRef.current,
      useNativeDriver: !isWeb,
    }).start()
  })

  useEffect(() => {
    chagenActiveTab(activeTabIndex)
  }, [pointerWidth])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        boxHPosition.extractOffset()
        boxHPosition.setValue(0)
        dragging.current = true
      },
      onPanResponderMove: Animated.event([null, { dx: boxHPosition }], {
        useNativeDriver: !isWeb,
      }),
      onPanResponderRelease: (_, gestureState) => {
        const nearestTab = Math.max(
          Math.min(
            Math.round(gestureState.dx / pointerWidthRef.current),
            tabs.length - 1 - activeTabRef.current
          ),
          -activeTabRef.current
        )

        let nextTabIndex = activeTabRef.current + nearestTab

        Animated.spring(boxHPosition, {
          toValue: nearestTab * pointerWidthRef.current,
          useNativeDriver: !isWeb,
        }).start()
        dragging.current = false

        setActiveTabIndex(nextTabIndex)
      },
    })
  ).current

  const animatedStyle = useMemo(
    () =>
      ({
        position: 'absolute',
        height: '70%',
        flexShrink: 0,
        zIndex: 1000000,
        backgroundColor: theme['color-1']?.val,
        width: pointerWidth,
        borderRadius: 1000_000,
        transform: [{ translateX: boxHPosition }],
        boxShadow: `0 1px 2.22px ${theme['shadow-color']?.val}`,
        boxShadow: '0 1px 9px shadow-color',
      }) as ViewStyle,
    [theme['color-1']?.val, theme['shadow-color']?.val, pointerWidth]
  )

  return (
    <Tabs
      flexDirection="column"
      bg="background"
      borderBottomWidth={1}
      borderBottomColor="color-1"
      flex={1}
      justify="center"
      items="center"
      self="center"
      width="90%"
      mt="4"
      defaultValue={tabs[0]}
      value={tabs[activeTabIndex]}
    >
      <View
        flexDirection="row"
        rounded={1000_000}
        bg="color-2"
        justify="center"
        width="100%"
        px="2"
        position="relative"
      >
        <Tabs.List
          width="100%"
          select="none"
          flexDirection="row"
          alignItems="center"
          paddingVertical="4"
          height="6"
          backgroundColor="transparent"
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width
            setPointerWidth(width / tabs.length)
          }}
        >
          <Animated.View style={animatedStyle} {...panResponder.panHandlers} />
          {tabs.map((tab, index) => (
            <Tabs.Tab
              unstyled
              key={index}
              value={tab}
              alignItems="center"
              flex={1}
              flexBasis={0}
              flexShrink={1}
              bg="transparent hover:transparent press:transparent"
              pointerEvents={activeTabIndex === index ? 'none' : 'auto'}
              zIndex={1000000}
              onPress={() => {
                chagenActiveTab(index)
              }}
            >
              <Text
                color={`${index === activeTabIndex ? 'color' : 'color-9'}`}
                select="none"
                cursor="pointer"
              >
                {tab}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </View>
      <Separator />
      <TabsContent value="Tab 1">
        <H5>Content 1</H5>
      </TabsContent>

      <TabsContent value="Tab 2">
        <H5>Content 2</H5>
      </TabsContent>

      <TabsContent value="Tab 3">
        <H5>Content 3</H5>
      </TabsContent>
    </Tabs>
  )
}

TabbarSwippable.fileName = 'TabBarSwippable'

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      bg="background"
      p="2"
      items="center"
      justify="center"
      flex={1}
      borderColor="background"
      rounded="2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="2"
      height={600}
      {...props}
      key="tab3"
    >
      {props.children}
    </Tabs.Content>
  )
}
