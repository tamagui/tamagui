import React, { useEffect, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { Animated, PanResponder } from 'react-native'
import { Text, View, debounce, isWeb, useEvent, Tabs } from 'tamagui'
import { tone } from '../../tone'

const tabs = ['Account', 'Security', 'Alerts']

const panels: Record<string, [string, string][]> = {
  Account: [
    ['Name', 'Ada Lovelace'],
    ['Email', 'ada@lovelace.dev'],
    ['Plan', 'Team, 8 seats'],
  ],
  Security: [
    ['Password', 'Changed 3 weeks ago'],
    ['Two factor', 'Authenticator app'],
    ['Sessions', '2 active devices'],
  ],
  Alerts: [
    ['Mentions', 'Push and email'],
    ['Weekly digest', 'Mondays at 9am'],
    ['Billing', 'Email only'],
  ],
}

/** ------ EXAMPLE ------ */
export const TabbarSwippable = () => {
  const boxHPosition = useRef(new Animated.Value(0)).current
  const [activeTabIndex, _setActiveTabIndex] = React.useState(0)
  const setActiveTabIndex = debounce(_setActiveTabIndex, 100)
  const activeTabRef = useRef(activeTabIndex)
  activeTabRef.current = activeTabIndex
  const dragging = useRef(false)
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
        top: 4,
        bottom: 4,
        left: 4,
        width: pointerWidth,
        transform: [{ translateX: boxHPosition }],
      }) as ViewStyle,
    [pointerWidth]
  )

  return (
    <Tabs
      flexDirection="column"
      width={420}
      maxW="100%"
      gap="3"
      defaultValue={tabs[0]}
      value={tabs[activeTabIndex]}
    >
      <Tabs.List
        position="relative"
        width="100%"
        select="none"
        flexDirection="row"
        items="center"
        p={4}
        rounded="full"
        bg={tone.fill}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width - 8
          setPointerWidth(width / tabs.length)
        }}
      >
        <Animated.View style={animatedStyle} {...panResponder.panHandlers}>
          <View
            flex={1}
            rounded="full"
            bg="color-1 dark:color-7"
            boxShadow="0 1px 3px shadow-color"
            cursor="grab"
          />
        </Animated.View>
        {tabs.map((tab, index) => (
          <Tabs.Tab
            unstyled
            key={tab}
            value={tab}
            items="center"
            flex={1}
            flexBasis={0}
            position="relative"
            z={1}
            py="1.5"
            bg="transparent"
            cursor="pointer"
            pointerEvents={activeTabIndex === index ? 'none' : 'auto'}
            onPress={() => {
              chagenActiveTab(index)
            }}
          >
            <Text
              fontFamily="body"
              fontSize="sm"
              fontWeight="500"
              color={index === activeTabIndex ? 'color-12' : tone.muted}
              select="none"
            >
              {tab}
            </Text>
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab}
          value={tab}
          bg={tone.surface}
          borderWidth={1}
          borderColor={tone.border}
          rounded="6"
          overflow="hidden"
        >
          {panels[tab].map(([label, value], index) => (
            <View
              key={label}
              flexDirection="row"
              justify="space-between"
              items="center"
              px="4"
              py="3"
              borderTopWidth={index ? 1 : 0}
              borderColor={tone.border}
            >
              <Text fontFamily="body" fontSize="sm" color={tone.muted}>
                {label}
              </Text>
              <Text fontFamily="body" fontSize="sm" fontWeight="500" color="color-12">
                {value}
              </Text>
            </View>
          ))}
        </Tabs.Content>
      ))}
    </Tabs>
  )
}
