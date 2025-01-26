import React from 'react'
import type { XStackProps } from 'tamagui'
import { Circle, XStack } from 'tamagui'

import { useTint } from './useTint'

const rgb = ['#ED0F0F', '#6BCF1A', '#6252F8']

export const LogoWords: React.MemoExoticComponent<
  ({
    downscale,
    animated,
    ...props
  }: XStackProps & {
    downscale?: number
    animated?: boolean
  }) => import('react/jsx-runtime').JSX.Element
> = React.memo(({ downscale = 1, animated, ...props }) => {
  const Tint = useTint()
  const [hovered, setHovered] = React.useState(false)
  const [mounted, setMounted] = React.useState<'start' | 'animate' | 'done'>('start')

  const { tintIndex: index, tint } = Tint
  const hoveredTints = Tint.tints.map((x) => `${x}9`).map((t) => `var(--${t})`)

  const tints = [
    'var(--accent1)',
    'var(--accent1)',
    'var(--accent1)',
    'var(--accent1)',
    ...rgb,
  ]

  const circleTints = hovered
    ? Tint.tints.map((x) => `$${x}9`)
    : ['$accent1', '$accent1', '$accent1', '$accent1', ...rgb]

  React.useEffect(() => {
    const idle = window.requestIdleCallback || setTimeout
    idle(() => {
      setTimeout(() => {
        setMounted('animate')
      }, 50)

      setTimeout(() => {
        setMounted('done')
      }, 1500)
    })
  }, [])

  const getColor = (i: number) => {
    const isActive = mounted !== 'start' && i === index
    if (hovered) {
      return hoveredTints[i]
    }
    return tints[i]
  }

  const x = Math.round(
    index * 18.5 + (18 / 2) * (index / tints.length) + 3 + (index === 6 ? -3 : 0)
  )

  return (
    <XStack
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      paddingVertical="$2"
      data-tauri-drag-region
      marginVertical="$-2"
      position="relative"
      className="logo-words"
      {...props}
    >
      {animated && (
        <Circle
          animation="quicker"
          position="absolute"
          top={0}
          left={0}
          y={mounted === 'start' ? -30 : -3}
          // the last i is less wide
          x={x}
          size={4}
          backgroundColor={circleTints[index]}
        />
      )}

      <svg
        data-tauri-drag-region
        width={373 * (1 / downscale) * 0.3333333}
        height={41 * (1 / downscale) * 0.3333333}
        viewBox="0 0 373 41"
      >
        <polygon
          data-tauri-drag-region
          shapeRendering="crispEdges"
          fill={getColor(0)}
          points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(0)}
        />

        <path
          shapeRendering="crispEdges"
          fill={getColor(1)}
          d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
          fillRule="nonzero"
          onMouseEnter={() => Tint.setTintIndex(1)}
        />

        <polygon
          data-tauri-drag-region
          shapeRendering="crispEdges"
          fill={getColor(2)}
          points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(2)}
        />

        <path
          fill={getColor(3)}
          d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
          fillRule="nonzero"
          onMouseEnter={() => Tint.setTintIndex(3)}
        />

        <polygon
          data-tauri-drag-region
          shapeRendering="crispEdges"
          fill={getColor(4)}
          points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(4)}
        />

        <polygon
          data-tauri-drag-region
          shapeRendering="crispEdges"
          fill={getColor(5)}
          points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(5)}
        />

        <polygon
          data-tauri-drag-region
          shapeRendering="crispEdges"
          fill={getColor(6)}
          points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(6)}
        />
      </svg>
    </XStack>
  )
})
