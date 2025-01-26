import React, { useEffect, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { Animated, PanResponder } from 'react-native'
import type { TabsContentProps } from 'tamagui'
import { H5, Separator, Tabs, Text, View, debounce, useEvent, useTheme } from 'tamagui'
import { usePhoneScale } from '../../general/_Showcase'

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
  const [pointerWidth, setPointerWidth] = React.useState(100)

  // Note: you should remove the following line in your code
  const { scale } = usePhoneScale()

  const pointerWidthRef = useRef(pointerWidth)
  pointerWidthRef.current = pointerWidth

  const chagenActiveTab = useEvent((activeTabIndex) => {
    setActiveTabIndex(activeTabIndex)
    boxHPosition.flattenOffset()
    Animated.spring(boxHPosition, {
      toValue: activeTabIndex * pointerWidthRef.current,
      useNativeDriver: true,
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
        useNativeDriver: true,
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
          useNativeDriver: true,
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
        backgroundColor: theme.color1.val,
        width: pointerWidth,
        borderRadius: 1000_000,
        transform: [{ translateX: boxHPosition }],
        shadowColor: theme.color11.val,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }) as ViewStyle,
    [theme.color2.val, theme.color11.val, pointerWidth]
  )

  return (
    <Tabs
      flexDirection="column"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$color1"
      defaultValue={tabs[0]}
      flex={1}
      value={tabs[activeTabIndex]}
      justifyContent="center"
      alignItems="center"
      alignSelf="center"
      width="90%"
      marginTop="$4"
    >
      <View
        flexDirection="row"
        borderRadius={1000_000}
        backgroundColor="$color2"
        justifyContent="center"
        width="100%"
        paddingHorizontal="$2"
      >
        <Tabs.List
          width="100%"
          userSelect="none"
          flexDirection="row"
          alignItems="center"
          paddingVertical={'$4'}
          height="$6"
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width
            // Note: you should remove the following line in your code
            const scaledWidth = width + width * (1 - scale)
            // Note: use width instead of scaledWidth in your code
            setPointerWidth(scaledWidth / 3)
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
              pe={activeTabIndex === index ? 'none' : 'auto'}
              onPress={(type) => {
                chagenActiveTab(index)
              }}
            >
              <Text
                theme={index !== activeTabIndex ? 'alt1' : undefined}
                selectable={false}
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
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      btlr={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      height={600}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}
