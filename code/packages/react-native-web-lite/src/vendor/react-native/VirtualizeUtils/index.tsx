/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface FrameMetric {
  length: number
  offset: number
}

interface ScrollMetrics {
  dt: number
  offset: number
  velocity: number
  visibleLength: number
  zoomScale?: number
}

interface Range {
  first: number
  last: number
}

interface FrameMetricProps {
  data: any
  getItemCount: (data: any) => number
}

/**
 * Used to find the indices of the frames that overlap the given offsets. Useful for finding the
 * items that bound different windows of content, such as the visible area or the buffered overscan
 * area.
 */
export function elementsThatOverlapOffsets(
  offsets: number[],
  props: FrameMetricProps,
  getFrameMetrics: (index: number, props: FrameMetricProps) => FrameMetric,
  zoomScale = 1
): number[] {
  const itemCount = props.getItemCount(props.data)
  const result: number[] = []

  for (let offsetIndex = 0; offsetIndex < offsets.length; offsetIndex++) {
    const currentOffset = offsets[offsetIndex]
    let left = 0
    let right = itemCount - 1

    while (left <= right) {
      const mid = left + ((right - left) >>> 1)
      const frame = getFrameMetrics(mid, props)
      const scaledOffsetStart = frame.offset * zoomScale
      const scaledOffsetEnd = (frame.offset + frame.length) * zoomScale

      if (
        (mid === 0 && currentOffset < scaledOffsetStart) ||
        (mid !== 0 && currentOffset <= scaledOffsetStart)
      ) {
        right = mid - 1
      } else if (currentOffset > scaledOffsetEnd) {
        left = mid + 1
      } else {
        result[offsetIndex] = mid
        break
      }
    }
  }

  return result
}

/**
 * Computes the number of elements in the `next` range that are new compared to the `prev` range.
 * Handy for calculating how many new items will be rendered when the render window changes so we
 * can restrict the number of new items render at once so that content can appear on the screen
 * faster.
 */
export function newRangeCount(prev: Range, next: Range): number {
  return (
    next.last -
    next.first +
    1 -
    Math.max(0, 1 + Math.min(next.last, prev.last) - Math.max(next.first, prev.first))
  )
}

/**
 * Custom logic for determining which items should be rendered given the current frame and scroll
 * metrics, as well as the previous render state.
 */
export function computeWindowedRenderLimits(
  props: FrameMetricProps,
  maxToRenderPerBatch: number,
  windowSize: number,
  prev: Range,
  getFrameMetricsApprox: (index: number, props: FrameMetricProps) => FrameMetric,
  scrollMetrics: ScrollMetrics
): Range {
  const itemCount = props.getItemCount(props.data)
  if (itemCount === 0) {
    return { first: 0, last: -1 }
  }

  const { offset, velocity, visibleLength, zoomScale = 1 } = scrollMetrics

  const visibleBegin = Math.max(0, offset)
  const visibleEnd = visibleBegin + visibleLength
  const overscanLength = (windowSize - 1) * visibleLength

  const leadFactor = 0.5
  const fillPreference = velocity > 1 ? 'after' : velocity < -1 ? 'before' : 'none'

  const overscanBegin = Math.max(0, visibleBegin - (1 - leadFactor) * overscanLength)
  const overscanEnd = Math.max(0, visibleEnd + leadFactor * overscanLength)

  const lastItemOffset = getFrameMetricsApprox(itemCount - 1, props).offset * zoomScale
  if (lastItemOffset < overscanBegin) {
    return {
      first: Math.max(0, itemCount - 1 - maxToRenderPerBatch),
      last: itemCount - 1,
    }
  }

  let [overscanFirst, first, last, overscanLast] = elementsThatOverlapOffsets(
    [overscanBegin, visibleBegin, visibleEnd, overscanEnd],
    props,
    getFrameMetricsApprox,
    zoomScale
  )

  overscanFirst = overscanFirst == null ? 0 : overscanFirst
  first = first == null ? Math.max(0, overscanFirst) : first
  overscanLast = overscanLast == null ? itemCount - 1 : overscanLast
  last = last == null ? Math.min(overscanLast, first + maxToRenderPerBatch - 1) : last
  const visible = { first, last }

  let newCellCount = newRangeCount(prev, visible)

  while (true) {
    if (first <= overscanFirst && last >= overscanLast) {
      break
    }

    const maxNewCells = newCellCount >= maxToRenderPerBatch
    const firstWillAddMore = first <= prev.first || first > prev.last
    const firstShouldIncrement =
      first > overscanFirst && (!maxNewCells || !firstWillAddMore)
    const lastWillAddMore = last >= prev.last || last < prev.first
    const lastShouldIncrement = last < overscanLast && (!maxNewCells || !lastWillAddMore)

    if (maxNewCells && !firstShouldIncrement && !lastShouldIncrement) {
      break
    }

    if (
      firstShouldIncrement &&
      !(fillPreference === 'after' && lastShouldIncrement && lastWillAddMore)
    ) {
      if (firstWillAddMore) {
        newCellCount++
      }
      first--
    }

    if (
      lastShouldIncrement &&
      !(fillPreference === 'before' && firstShouldIncrement && firstWillAddMore)
    ) {
      if (lastWillAddMore) {
        newCellCount++
      }
      last++
    }
  }

  if (
    !(
      last >= first &&
      first >= 0 &&
      last < itemCount &&
      first >= overscanFirst &&
      last <= overscanLast &&
      first <= visible.first &&
      last >= visible.last
    )
  ) {
    throw new Error(
      'Bad window calculation ' +
        JSON.stringify({
          first,
          last,
          itemCount,
          overscanFirst,
          overscanLast,
          visible,
        })
    )
  }

  return { first, last }
}

export function keyExtractor(item: any, index: number): string {
  if (typeof item === 'object' && item?.key != null) {
    return item.key
  }
  if (typeof item === 'object' && item?.id != null) {
    return item.id
  }
  return String(index)
}
