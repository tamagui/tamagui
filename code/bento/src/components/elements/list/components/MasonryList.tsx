// credit to @react-native-seoul/masonry-list for the original implementation
import type {
  NativeScrollEvent,
  RefreshControlProps,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { forwardRef } from 'react'
import type { MutableRefObject, ReactElement } from 'react'
import React, { memo, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { YStack, styled } from 'tamagui'

interface Props<T> extends Omit<ScrollViewProps, 'refreshControl'> {
  innerRef?: MutableRefObject<ScrollView | undefined>
  loading?: boolean
  refreshing?: RefreshControlProps['refreshing']
  onRefresh?: RefreshControlProps['onRefresh']
  refreshControl?: boolean
  onEndReached?: () => void
  onEndReachedThreshold?: number
  style?: StyleProp<ViewStyle>
  data: T[]
  renderItem: ({ item, i }: { item: T; i: number }) => ReactElement
  LoadingView?: React.ComponentType<any> | React.ReactElement | null
  ListHeaderComponent?: React.ReactNode | null
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null
  ListHeaderComponentStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  numColumns?: number
  keyExtractor?: ((item: T | any, index: number) => string) | undefined
  refreshControlProps?: Omit<RefreshControlProps, 'onRefresh' | 'refreshing'>
}

const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
  onEndReachedThreshold: number
): boolean => {
  const paddingToBottom = contentSize.height * onEndReachedThreshold

  return (
    Math.ceil(layoutMeasurement.height + contentOffset.y) >=
    contentSize.height - paddingToBottom
  )
}

const MasonryListImpl = forwardRef<ScrollView, Props<any>>((props, ref) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const {
    refreshing,
    data,
    ListHeaderComponent,
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponentStyle,
    containerStyle,
    contentContainerStyle,
    renderItem,
    onEndReachedThreshold,
    onEndReached,
    onRefresh,
    loading,
    LoadingView,
    numColumns = 2,
    horizontal,
    onScroll,
    removeClippedSubviews = false,
    keyExtractor,
    keyboardShouldPersistTaps = 'handled',
    refreshControl = true,
    refreshControlProps,
  } = props

  const { style, ...propsWithoutStyle } = props

  return (
    <ScrollView
      {...propsWithoutStyle}
      ref={ref}
      style={[{ flex: 1, alignSelf: 'stretch' }, containerStyle]}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      removeClippedSubviews={removeClippedSubviews}
      refreshControl={
        refreshControl ? (
          <RefreshControl
            refreshing={!!(refreshing || isRefreshing)}
            onRefresh={() => {
              setIsRefreshing(true)
              onRefresh?.()
              setIsRefreshing(false)
            }}
            {...refreshControlProps}
          />
        ) : undefined
      }
      scrollEventThrottle={16}
      onScroll={(e) => {
        const nativeEvent: NativeScrollEvent = e.nativeEvent
        if (isCloseToBottom(nativeEvent, onEndReachedThreshold || 0.0)) {
          onEndReached?.()
        }

        onScroll?.(e)
      }}
    >
      {/* @ts-ignore */}
      <>
        <View style={ListHeaderComponentStyle}>{ListHeaderComponent}</View>
        {data.length === 0 && ListEmptyComponent ? (
          React.isValidElement(ListEmptyComponent) ? (
            ListEmptyComponent
          ) : (
            // @ts-ignore
            <ListEmptyComponent />
          )
        ) : (
          <YStack
            flex={1}
            flexDirection={horizontal ? 'column' : 'row'}
            {...(style as any)}
          >
            {Array.from(Array(numColumns), (_, num) => {
              return (
                <YStack
                  key={`masonry-column-${num}`}
                  flex={1 / numColumns}
                  flexDirection={horizontal ? 'row' : 'column'}
                >
                  {data
                    .map((el, i) => {
                      if (i % numColumns === num) {
                        return (
                          <View key={keyExtractor?.(el, i) || `masonry-row-${num}-${i}`}>
                            {renderItem({ item: el, i })}
                          </View>
                        )
                      }
                      return null
                    })
                    .filter((e) => !!e)}
                </YStack>
              )
            })}
          </YStack>
        )}
        {loading && LoadingView}
        {ListFooterComponent}
      </>
    </ScrollView>
  )
})

export const MasonryList = memo(
  styled(MasonryListImpl, {
    name: 'MasonryList',
  })
)
