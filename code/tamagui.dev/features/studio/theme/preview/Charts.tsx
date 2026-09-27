import { memo, useState } from 'react'
import { XStack, YStack } from 'tamagui'

// Fast, zero-dependency SVG charts that render instantly and update smoothly
// with Tamagui theme changes.

export const BarChart = memo(() => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const bars = [
    { month: 'Jan', val: 60, display: '600' },
    { month: 'Feb', val: 34, display: '340' },
    { month: 'Mar', val: 40, display: '400' },
    { month: 'Apr', val: 100, display: '1,200', peak: true },
    { month: 'May', val: 80, display: '800' },
    { month: 'Jun', val: 87, display: '870' },
  ]

  const chartWidth = 300
  const chartHeight = 160
  const barWidth = 28
  const startX = 18
  const spacing = (chartWidth - startX * 2 - barWidth) / (bars.length - 1)
  const maxBarH = 100
  const baseY = 130

  return (
    <YStack width="100%" height={160} position="relative" justify="center" items="center">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Horizontal grid lines */}
        {[30, 65, 100].map((y) => (
          <line
            key={y}
            x1="12"
            y1={y}
            x2={chartWidth - 12}
            y2={y}
            stroke="var(--color-4, rgba(120, 120, 120, 0.2))"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}

        {bars.map((item, idx) => {
          const x = startX + idx * spacing
          const h = (item.val / 100) * maxBarH
          const y = baseY - h
          const isHovered = hoveredIdx === idx
          const isPeak = item.peak

          return (
            <g
              key={item.month}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Bar background track */}
              <rect
                x={x}
                y={baseY - maxBarH}
                width={barWidth}
                height={maxBarH}
                rx="5"
                ry="5"
                fill="var(--color-3, rgba(120, 120, 120, 0.08))"
              />

              {/* Active Bar fill */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="5"
                ry="5"
                fill={
                  isHovered || isPeak
                    ? 'var(--color-11, var(--color))'
                    : 'var(--color-8, rgba(120, 120, 120, 0.45))'
                }
                style={{
                  transition: 'y 0.25s ease, height 0.25s ease, fill 0.15s ease',
                }}
              />

              {/* Month label */}
              <text
                x={x + barWidth / 2}
                y={baseY + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered || isPeak ? '600' : '400'}
                fill={
                  isHovered || isPeak
                    ? 'var(--color-12, var(--color))'
                    : 'var(--color-10, rgba(120, 120, 120, 0.7))'
                }
              >
                {item.month}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 26}
                    y={y - 24}
                    width="52"
                    height="18"
                    rx="4"
                    fill="var(--color-12, var(--color))"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 11}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--background)"
                  >
                    {item.display}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </YStack>
  )
})

export const LineChart = memo(() => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const points = [
    { x: 18, y: 110, val: '$18.2K', label: 'Jan' },
    { x: 74, y: 125, val: '$14.1K', label: 'Feb' },
    { x: 130, y: 82, val: '$28.4K', label: 'Mar' },
    { x: 186, y: 92, val: '$25.6K', label: 'Apr' },
    { x: 242, y: 44, val: '$38.9K', label: 'May' },
    { x: 298, y: 20, val: '$42.3K', label: 'Jun', peak: true },
  ]

  const chartWidth = 320
  const chartHeight = 160
  const bottomY = 136

  // Smooth spline curve path
  const curvePath =
    'M 18,110 C 45,110 50,125 74,125 C 102,125 106,82 130,82 C 158,82 162,92 186,92 C 214,92 218,44 242,44 C 268,44 278,20 298,20'
  const areaPath = `${curvePath} L 298,${bottomY} L 18,${bottomY} Z`

  return (
    <YStack width="100%" height={160} position="relative" justify="center" items="center">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="tamagui-revenue-line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-11, var(--color))" stopOpacity="0.36" />
            <stop offset="60%" stopColor="var(--color-11, var(--color))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-11, var(--color))" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[35, 75, 115].map((y) => (
          <line
            key={y}
            x1="14"
            y1={y}
            x2={chartWidth - 14}
            y2={y}
            stroke="var(--color-4, rgba(120, 120, 120, 0.2))"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#tamagui-revenue-line-grad)" />

        {/* Crisp, high-contrast spline line */}
        <path
          d={curvePath}
          fill="none"
          stroke="var(--color-11, var(--color))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx
          const isPeak = p.peak

          return (
            <g
              key={p.label}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Invisible larger hit target */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

              {/* Data circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : isPeak ? 4.5 : 3.5}
                fill="var(--background)"
                stroke="var(--color-11, var(--color))"
                strokeWidth={isHovered ? 3 : 2.5}
                style={{ transition: 'all 0.15s ease' }}
              />

              {/* Month label */}
              <text
                x={p.x}
                y={bottomY + 16}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isHovered || isPeak ? '600' : '400'}
                fill={
                  isHovered || isPeak
                    ? 'var(--color-12, var(--color))'
                    : 'var(--color-10, rgba(120, 120, 120, 0.7))'
                }
              >
                {p.label}
              </text>

              {/* Tooltip on hover or peak badge */}
              {(isHovered || (isPeak && hoveredIdx === null)) && (
                <g>
                  <rect
                    x={p.x - 26}
                    y={p.y - 24}
                    width="52"
                    height="18"
                    rx="4"
                    fill="var(--color-12, var(--color))"
                  />
                  <text
                    x={p.x}
                    y={p.y - 11}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--background)"
                  >
                    {p.val}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </YStack>
  )
})

export const NewMembersChart = memo(() => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Donut chart segments for Traffic Sources
  const segments = [
    { label: 'Direct', pct: 45, colorVar: 'var(--color-11, #6366f1)' },
    { label: 'Organic', pct: 28, colorVar: 'var(--color-9, #818cf8)' },
    { label: 'Referral', pct: 17, colorVar: 'var(--color-7, #a5b4fc)' },
    { label: 'Social', pct: 10, colorVar: 'var(--color-5, #c7d2fe)' },
  ]

  // Pre-calculated donut arcs (outer R: 52, inner R: 34, center: 64, 68)
  const cx = 66
  const cy = 68
  const rOuter = 52
  const rInner = 35

  const arcs = [
    // 0 to 45% (0 to 162 deg)
    {
      d: 'M 66,16 A 52,52 0 0,1 115.4,84.1 L 99.2,78.8 A 35,35 0 0,0 66,33 Z',
    },
    // 45% to 73% (162 to 262.8 deg)
    {
      d: 'M 115.4,84.1 A 52,52 0 0,1 46.1,116 L 52.6,100.3 A 35,35 0 0,0 99.2,78.8 Z',
    },
    // 73% to 90% (262.8 to 324 deg)
    {
      d: 'M 46.1,116 A 52,52 0 0,1 23.9,37.4 L 37.7,47.4 A 35,35 0 0,0 52.6,100.3 Z',
    },
    // 90% to 100% (324 to 360 deg)
    {
      d: 'M 23.9,37.4 A 52,52 0 0,1 66,16 L 66,33 A 35,35 0 0,0 37.7,47.4 Z',
    },
  ]

  return (
    <XStack width="100%" height={150} items="center" justify="space-between" px="2">
      {/* Donut SVG */}
      <YStack width={134} height={136} position="relative" justify="center" items="center">
        <svg viewBox="0 0 134 136" width="134" height="136">
          {arcs.map((arc, i) => (
            <path
              key={segments[i].label}
              d={arc.d}
              fill={segments[i].colorVar}
              opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.4}
              style={{
                cursor: 'pointer',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {/* Center text */}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="var(--color-12, var(--color))"
          >
            {hoveredIdx !== null ? `${segments[hoveredIdx].pct}%` : '100%'}
          </text>
          <text
            x={cx}
            y={cy + 13}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-10, rgba(120, 120, 120, 0.7))"
          >
            {hoveredIdx !== null ? segments[hoveredIdx].label : 'Total'}
          </text>
        </svg>
      </YStack>

      {/* Legend list */}
      <YStack gap="1" flex={1} pl="3" justify="center">
        {segments.map((seg, i) => (
          <XStack
            key={seg.label}
            items="center"
            gap="2"
            py="0-5"
            px="1-5"
            rounded="3"
            bg={hoveredIdx === i ? 'var(--color-3)' : 'transparent'}
            style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <YStack width={8} height={8} rounded="2" bg={seg.colorVar as any} />
            <XStack flex={1} justify="space-between" items="center">
              <span
                style={{
                  fontSize: 11,
                  color:
                    hoveredIdx === i
                      ? 'var(--color-12)'
                      : 'var(--color-10, rgba(120, 120, 120, 0.8))',
                  fontWeight: hoveredIdx === i ? 600 : 400,
                }}
              >
                {seg.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-11, var(--color))',
                }}
              >
                {seg.pct}%
              </span>
            </XStack>
          </XStack>
        ))}
      </YStack>
    </XStack>
  )
})
