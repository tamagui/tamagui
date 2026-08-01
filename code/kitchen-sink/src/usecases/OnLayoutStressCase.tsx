import { memo, useCallback, useRef, useState, useMemo } from 'react'
import { Text, View, XStack, YStack, ScrollView, useTheme, type GetProps } from 'tamagui'
import { Button } from '../components/Button'

type BackgroundColor = GetProps<typeof View>['backgroundColor']

type Stats = {
  totalCallbacks: number
  totalTime: number
  maxTime: number
  lastBatchSize: number
  lastBatchTime: number
}

// deeply nested component tree
const GRAY_COLORS = ['gray2', 'gray3', 'gray4', 'gray5', 'gray6', 'gray7'] as const
const GRID_COLORS = ['red5', 'green5', 'blue5', 'purple5', 'orange5'] as const
const SIBLING_COLORS = ['red4', 'green4', 'blue4'] as const

const DeepChild = memo(
  ({
    depth,
    id,
    colors,
    onLayoutFired,
  }: {
    depth: number
    id: string
    colors: readonly BackgroundColor[]
    onLayoutFired: () => void
  }) => {
    const handleLayout = useCallback(() => {
      onLayoutFired()
    }, [onLayoutFired])

    if (depth === 0) {
      return (
        <View
          testID={`deep-${id}`}
          onLayout={handleLayout}
          width={20 + (parseInt(id.split('-')[1] || '0') % 5) * 10}
          height={15}
          backgroundColor="blue5"
        />
      )
    }

    return (
      <View
        testID={`deep-wrapper-${id}-${depth}`}
        onLayout={handleLayout}
        padding={2}
        backgroundColor={colors[Math.min(5, depth)]}
      >
        <DeepChild
          depth={depth - 1}
          id={id}
          colors={colors}
          onLayoutFired={onLayoutFired}
        />
      </View>
    )
  }
)

// grid item with variable sizes
const GridItem = memo(
  ({
    id,
    sizeMultiplier,
    colors,
    onLayoutFired,
  }: {
    id: number
    sizeMultiplier: number
    colors: readonly BackgroundColor[]
    onLayoutFired: () => void
  }) => {
    const handleLayout = useCallback(() => {
      onLayoutFired()
    }, [onLayoutFired])

    const baseSize = 30 + (id % 4) * 15
    const size = baseSize * sizeMultiplier

    return (
      <View
        testID={`grid-${id}`}
        onLayout={handleLayout}
        width={size}
        height={size * 0.6}
        backgroundColor={colors[id % 5]}
        margin={2}
      />
    )
  }
)

// list item that changes height
const ListItem = memo(
  ({
    id,
    expanded,
    onLayoutFired,
  }: {
    id: number
    expanded: boolean
    onLayoutFired: () => void
  }) => {
    const handleLayout = useCallback(() => {
      onLayoutFired()
    }, [onLayoutFired])

    return (
      <View
        testID={`list-${id}`}
        onLayout={handleLayout}
        width="100%"
        height={expanded ? 60 : 30}
        backgroundColor={`${id % 2 === 0 ? 'background' : 'background-hover'}`}
        borderBottomWidth={1}
        borderBottomColor="border-color"
        padding="2"
      >
        <Text fontSize={12}>Item {id}</Text>
      </View>
    )
  }
)

// sibling groups that all need layout
const SiblingGroup = memo(
  ({
    groupId,
    count,
    widthMultiplier,
    colors,
    onLayoutFired,
  }: {
    groupId: number
    count: number
    widthMultiplier: number
    colors: readonly BackgroundColor[]
    onLayoutFired: () => void
  }) => {
    return (
      <XStack testID={`sibling-group-${groupId}`} flexWrap="wrap">
        {Array.from({ length: count }, (_, i) => (
          <View
            key={i}
            testID={`sibling-${groupId}-${i}`}
            onLayout={onLayoutFired}
            width={25 * widthMultiplier}
            height={20}
            backgroundColor={colors[i % 3]}
            margin={1}
          />
        ))}
      </XStack>
    )
  }
)

export function OnLayoutStressCase() {
  const theme = useTheme()
  const gray2 = theme[GRAY_COLORS[0]]!.get()
  const gray3 = theme[GRAY_COLORS[1]]!.get()
  const gray4 = theme[GRAY_COLORS[2]]!.get()
  const gray5 = theme[GRAY_COLORS[3]]!.get()
  const gray6 = theme[GRAY_COLORS[4]]!.get()
  const gray7 = theme[GRAY_COLORS[5]]!.get()
  const red5 = theme[GRID_COLORS[0]]!.get()
  const green5 = theme[GRID_COLORS[1]]!.get()
  const blue5 = theme[GRID_COLORS[2]]!.get()
  const purple5 = theme[GRID_COLORS[3]]!.get()
  const orange5 = theme[GRID_COLORS[4]]!.get()
  const red4 = theme[SIBLING_COLORS[0]]!.get()
  const green4 = theme[SIBLING_COLORS[1]]!.get()
  const blue4 = theme[SIBLING_COLORS[2]]!.get()
  const grayColors = useMemo(
    () => [gray2, gray3, gray4, gray5, gray6, gray7] as readonly BackgroundColor[],
    [gray2, gray3, gray4, gray5, gray6, gray7]
  )
  const gridColors = useMemo(
    () => [red5, green5, blue5, purple5, orange5] as readonly BackgroundColor[],
    [red5, green5, blue5, purple5, orange5]
  )
  const siblingColors = useMemo(
    () => [red4, green4, blue4] as readonly BackgroundColor[],
    [red4, green4, blue4]
  )
  const [stats, setStats] = useState<Stats>({
    totalCallbacks: 0,
    totalTime: 0,
    maxTime: 0,
    lastBatchSize: 0,
    lastBatchTime: 0,
  })
  const [widthMultiplier, setWidthMultiplier] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [gridSize, setGridSize] = useState(1)
  const [containerWidth, setContainerWidth] = useState(600)

  // batch tracking
  const batchStart = useRef(0)
  const batchCount = useRef(0)
  const batchTimeout = useRef<any>(null)

  const onLayoutFired = useCallback(() => {
    const now = performance.now()

    if (batchCount.current === 0) {
      batchStart.current = now
    }
    batchCount.current++

    // debounce to capture full batch
    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current)
    }
    batchTimeout.current = setTimeout(() => {
      const batchTime = performance.now() - batchStart.current
      const count = batchCount.current

      setStats((s) => ({
        totalCallbacks: s.totalCallbacks + count,
        totalTime: s.totalTime + batchTime,
        maxTime: Math.max(s.maxTime, batchTime),
        lastBatchSize: count,
        lastBatchTime: Math.round(batchTime),
      }))

      batchCount.current = 0
    }, 100)
  }, [])

  const resetStats = useCallback(() => {
    setStats({
      totalCallbacks: 0,
      totalTime: 0,
      maxTime: 0,
      lastBatchSize: 0,
      lastBatchTime: 0,
    })
  }, [])

  // create deep tree items
  const deepItems = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => (
        <DeepChild
          key={i}
          depth={5}
          id={`deep-${i}`}
          colors={grayColors}
          onLayoutFired={onLayoutFired}
        />
      )),
    [grayColors, onLayoutFired]
  )

  // create grid items (40 items)
  const gridItems = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => (
        <GridItem
          key={i}
          id={i}
          sizeMultiplier={gridSize}
          colors={gridColors}
          onLayoutFired={onLayoutFired}
        />
      )),
    [gridColors, gridSize, onLayoutFired]
  )

  // create list items (20 items)
  const listItems = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => (
        <ListItem key={i} id={i} expanded={expanded} onLayoutFired={onLayoutFired} />
      )),
    [expanded, onLayoutFired]
  )

  // create sibling groups (5 groups x 10 items = 50 items)
  const siblingGroups = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => (
        <SiblingGroup
          key={i}
          groupId={i}
          count={10}
          widthMultiplier={widthMultiplier}
          colors={siblingColors}
          onLayoutFired={onLayoutFired}
        />
      )),
    [onLayoutFired, siblingColors, widthMultiplier]
  )

  return (
    <YStack flex={1} padding="2">
      {/* controls */}
      <XStack gap="2" flexWrap="wrap" padding="2" backgroundColor="background">
        <Button
          testID="btn-resize-width"
          size="small"
          onPress={() => setWidthMultiplier((v) => (v === 1 ? 1.5 : 1))}
        >
          toggle width ({widthMultiplier}x)
        </Button>
        <Button
          testID="btn-toggle-expand"
          size="small"
          onPress={() => setExpanded((v) => !v)}
        >
          toggle expand ({expanded ? 'on' : 'off'})
        </Button>
        <Button
          testID="btn-resize-grid"
          size="small"
          onPress={() => setGridSize((v) => (v === 1 ? 1.3 : 1))}
        >
          toggle grid ({gridSize}x)
        </Button>
        <Button
          testID="btn-resize-container"
          size="small"
          onPress={() => setContainerWidth((v) => (v === 600 ? 400 : 600))}
        >
          container ({containerWidth}px)
        </Button>
        <Button testID="btn-reset-stats" size="small" onPress={resetStats}>
          reset stats
        </Button>
      </XStack>

      {/* stats readout */}
      <XStack gap="3" padding="2" backgroundColor="background-hover" flexWrap="wrap">
        <Text testID="stat-total" fontSize={11}>
          total: {stats.totalCallbacks}
        </Text>
        <Text testID="stat-avg" fontSize={11}>
          avg:{' '}
          {stats.totalCallbacks > 0
            ? Math.round((stats.totalTime / stats.totalCallbacks) * 100) / 100
            : 0}
          ms
        </Text>
        <Text testID="stat-max" fontSize={11}>
          max: {Math.round(stats.maxTime)}ms
        </Text>
        <Text testID="stat-last-batch" fontSize={11}>
          lastBatch: {stats.lastBatchSize}
        </Text>
        <Text testID="stat-last-time" fontSize={11}>
          lastTime: {stats.lastBatchTime}ms
        </Text>
      </XStack>

      {/* scrollable content */}
      <ScrollView flex={1}>
        <YStack testID="stress-container" width={containerWidth} gap="3">
          {/* section 1: deeply nested (10 items x 6 depth = ~60 onLayout nodes) */}
          <YStack testID="section-deep">
            <Text fontSize={12} fontWeight="bold">
              Deep Nesting (10x6 depth)
            </Text>
            <XStack flexWrap="wrap" gap="1">
              {deepItems}
            </XStack>
          </YStack>

          {/* section 2: grid layout (40 items) */}
          <YStack testID="section-grid">
            <Text fontSize={12} fontWeight="bold">
              Grid (40 items)
            </Text>
            <XStack flexWrap="wrap">{gridItems}</XStack>
          </YStack>

          {/* section 3: list with varying heights (20 items) */}
          <YStack testID="section-list">
            <Text fontSize={12} fontWeight="bold">
              List (20 items)
            </Text>
            <YStack>{listItems}</YStack>
          </YStack>

          {/* section 4: sibling groups (50 items) */}
          <YStack testID="section-siblings">
            <Text fontSize={12} fontWeight="bold">
              Sibling Groups (5x10)
            </Text>
            <YStack gap="2">{siblingGroups}</YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
