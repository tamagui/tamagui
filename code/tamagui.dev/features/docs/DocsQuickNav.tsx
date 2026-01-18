import { href, usePathname } from 'one'
import { useEffect, useRef, useState } from 'react'
import {
  H4,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { Link } from '~/components/Link'
import { BentoButton } from '../site/BentoButton'
import { TakeoutButton } from '../site/TakeoutButton'

// SVG tree line indicator component with path-based animation
const NavLineIndicator = ({
  items,
  activeIndex,
  totalHeight,
}: {
  items: Array<{ top: number; height: number; level: number }>
  activeIndex: number
  totalHeight: number
}) => {
  if (items.length === 0 || totalHeight === 0) return null

  const levelIndent = 12
  const baseX = 8
  const segmentHalf = 6 // Half of the indicator segment length

  const getX = (level: number) => baseX + Math.max(0, level - 2) * levelIndent
  const getY = (item: { top: number; height: number }) => item.top + item.height / 2

  // Build a continuous path and calculate distances to each item center
  const buildPathAndDistances = () => {
    const pathParts: string[] = []
    const itemDistances: number[] = []
    let totalDist = 0

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const x = getX(item.level)
      const y = getY(item)
      const prevItem = items[i - 1]

      if (i === 0) {
        // Start path at top of first item's segment
        pathParts.push(`M ${x} ${y - segmentHalf}`)
        // Distance to center of first item
        itemDistances.push(segmentHalf)
        totalDist = segmentHalf
      } else {
        const prevX = getX(prevItem.level)
        const prevY = getY(prevItem)

        if (item.level !== prevItem.level) {
          // Different level - draw diagonal connector
          const connectorStartY = prevY + segmentHalf
          const connectorEndY = y - segmentHalf

          // Line to end of previous item's segment
          pathParts.push(`L ${prevX} ${connectorStartY}`)
          totalDist += segmentHalf // from prev center to connector start

          // Diagonal connector
          pathParts.push(`L ${x} ${connectorEndY}`)
          const dx = x - prevX
          const dy = connectorEndY - connectorStartY
          const connectorLength = Math.sqrt(dx * dx + dy * dy)
          totalDist += connectorLength

          // Distance to center of this item (from connector end)
          totalDist += segmentHalf
          itemDistances.push(totalDist)
        } else {
          // Same level - continuous vertical line
          // Distance from prev center to this center
          totalDist += Math.abs(y - prevY)
          itemDistances.push(totalDist)
        }
      }

      // Draw to bottom of this item's segment (for last item or before connector)
      const nextItem = items[i + 1]
      if (!nextItem || nextItem.level !== item.level) {
        pathParts.push(`L ${x} ${y + segmentHalf}`)
      }
    }

    // Calculate total path length (add remaining distance after last item center)
    const totalLength = totalDist + segmentHalf

    return {
      path: pathParts.join(' '),
      itemDistances,
      totalLength,
    }
  }

  const { path, itemDistances, totalLength } = buildPathAndDistances()
  const activeDistance = itemDistances[activeIndex] || 0

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 60,
        height: totalHeight,
        overflow: 'visible',
      }}
    >
      {/* Background path (gray) */}
      <path d={path} fill="none" stroke="var(--color6)" strokeWidth="1" />

      {/* Active indicator (animated along path) */}
      <path
        d={path}
        fill="none"
        stroke="var(--color12)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${segmentHalf * 2} ${totalLength}`}
        strokeDashoffset={-(activeDistance - segmentHalf)}
        style={{
          transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </svg>
  )
}

export function DocsQuickNav() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemData, setItemData] = useState<
    Array<{ top: number; height: number; level: number }>
  >([])
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Function to determine the Heading Level based on `nodeName` (H2, H3, etc)
  const getLevel = (nodeName: string): number => {
    return Number(nodeName.replace('H', ''))
  }

  // Track all currently intersecting headings to pick the best one
  const intersectingHeadings = useRef<Set<string>>(new Set())

  useEffect(() => {
    const headingElements: HTMLHeadingElement[] = Array.from(
      document.querySelectorAll('[data-heading]')
    )
    setHeadings(headingElements)
    setActiveIndex(0)
    setItemData([])
    intersectingHeadings.current.clear()
  }, [pathname])

  // Track active heading with Intersection Observer
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingHeadings.current.add(entry.target.id)
          } else {
            intersectingHeadings.current.delete(entry.target.id)
          }
        })

        // Pick the heading that has most recently passed the "reading line"
        // (the highest index among all headings currently above the 70% mark)
        if (intersectingHeadings.current.size > 0) {
          let maxIndex = -1
          intersectingHeadings.current.forEach((id) => {
            const index = headings.findIndex((h) => h.id === id)
            if (index > maxIndex) {
              maxIndex = index
            }
          })
          if (maxIndex !== -1) {
            setActiveIndex(maxIndex)
          }
        } else if (window.scrollY < 100) {
          setActiveIndex(0)
        }
      },
      {
        // rootMargin: [top] [right] [bottom] [left]
        // 100% top margin ensures headings stay in the 'set' even after scrolling past them
        // -30% bottom margin puts the "reading line" 70% down the screen
        rootMargin: '100% 0px -30% 0px',
        threshold: 0,
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [headings])

  // Measure container and item positions with levels
  useEffect(() => {
    if (!containerRef.current || headings.length === 0) return

    const measurePositions = () => {
      const container = containerRef.current
      if (!container) return

      const items = container.querySelectorAll('[data-nav-item]')
      const data: Array<{ top: number; height: number; level: number }> = []

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const level = headings[index] ? getLevel(headings[index].nodeName) : 2
        data.push({
          top: rect.top - containerRect.top,
          height: rect.height,
          level,
        })
      })

      setItemData(data)
      setContainerHeight(container.scrollHeight)
    }

    // Measure after render
    requestAnimationFrame(measurePositions)

    // Re-measure on resize
    window.addEventListener('resize', measurePositions)
    return () => window.removeEventListener('resize', measurePositions)
  }, [headings])

  return (
    <YStack
      render="aside"
      display="none"
      $gtLg={{
        display: 'flex',
        width: 280,
        shrink: 0,
        z: 1,
        position: 'fixed' as any,
        l: '50%',
        t: 140,
        ml: 450,
      }}
    >
      <YStack gap="$5">
        <XStack items="center" gap="$5">
          <Link
            target="_blank"
            href={href(`${process.env.ONE_SERVER_URL}${pathname}.md` as any)}
          >
            <SizableText size="$3" fontFamily="$mono">
              .md
            </SizableText>
          </Link>

          <Separator minH={20} vertical />

          <Link
            target="_blank"
            href={href(`${process.env.ONE_SERVER_URL}/llms.txt` as any)}
          >
            <SizableText size="$3" fontFamily="$mono">
              llms.txt
            </SizableText>
          </Link>
        </XStack>

        <Separator />

        <YStack
          render="nav"
          aria-labelledby="site-quick-nav-heading"
          mb="$10"
          mt="$2"
          display={headings.length === 0 ? 'none' : 'flex'}
          gap="$2"
        >
          <H4
            fontFamily="$mono"
            size="$5"
            mb="$2"
            color="$color10"
            id="site-quick-nav-heading"
          >
            Contents
          </H4>

          <ScrollView maxH="calc(100vh - 300px)">
            <YStack ref={containerRef as any} py="$2" pl={24} position="relative">
              <NavLineIndicator
                items={itemData}
                activeIndex={activeIndex}
                totalHeight={containerHeight}
              />

              {headings.map(({ id, nodeName, innerText }, index) => {
                const level = getLevel(nodeName)

                return (
                  <XStack
                    key={`${id}-${index}`}
                    data-nav-item
                    pl={Math.max(0, level - 2) * 12}
                    py="$1"
                  >
                    <a
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveIndex(index)
                      }}
                      href={`#${id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Paragraph
                        render="span"
                        size={level === 2 ? '$3' : '$2'}
                        color={
                          index === activeIndex
                            ? '$color12'
                            : level === 2
                              ? '$color11'
                              : '$color10'
                        }
                        cursor="pointer"
                        fontWeight={level === 2 ? '500' : '400'}
                        hoverStyle={{ color: '$color12' }}
                      >
                        {innerText}
                      </Paragraph>
                    </a>
                  </XStack>
                )
              })}
            </YStack>
          </ScrollView>
        </YStack>

        <YStack gap="$2">
          <Theme name="yellow_alt1">
            <Link width="100%" href="/bento">
              <BentoButton bg="transparent" />
            </Link>
          </Theme>
          <Theme name="gray">
            <Link width="100%" href="/takeout">
              <TakeoutButton bg="transparent" />
            </Link>
          </Theme>
        </YStack>
      </YStack>
    </YStack>
  )
}
