import React, { forwardRef } from 'react'
import { ThemeName, XStack, XStackProps, YStack } from 'tamagui'

export const tints: ThemeName[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']

export const logoColors = tints.map((t) => `var(--${t}9)`)

export const TamaguiLogo = forwardRef(
  (
    {
      showWords,
      color,
      downscale,
      onHoverLetter,
      ...props
    }: {
      onHoverLetter?: (i: number) => void
      showWords?: boolean
      color?: string
      downscale?: number
    } & XStackProps,
    ref
  ) => (
    <XStack ref={ref} ai="center" jc="center" space="$5" {...props}>
      <LogoIcon downscale={(downscale ?? 1) * (showWords ? 2 : 1.5)} color={color} />
      {showWords && (
        <YStack mb={-4}>
          <LogoWords onHoverLetter={onHoverLetter} downscale={downscale ?? 2} color={color} />
        </YStack>
      )}
    </XStack>
  )
)

export const LogoWords = ({
  color,
  downscale = 1,
  onHoverLetter,
}: {
  color?: string
  downscale?: number
  onHoverLetter?: any
}) => {
  return (
    <svg
      width={373 * (1 / downscale) * 0.333333334}
      height={41 * (1 / downscale) * 0.333333334}
      viewBox="0 0 373 41"
    >
      <polygon
        shapeRendering="crispEdges"
        fill={color || logoColors[0]}
        points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(0) : undefined}
      />
      <path
        shapeRendering="crispEdges"
        fill={color || logoColors[1]}
        d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
        fillRule="nonzero"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(1) : undefined}
      />
      <polygon
        shapeRendering="crispEdges"
        fill={color || logoColors[2]}
        points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(2) : undefined}
      />
      <path
        fill={color || logoColors[3]}
        d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
        fillRule="nonzero"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(3) : undefined}
      />
      <polygon
        shapeRendering="crispEdges"
        fill={color || logoColors[4]}
        points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(4) : undefined}
      />
      <polygon
        shapeRendering="crispEdges"
        fill={color || logoColors[5]}
        points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(5) : undefined}
      />
      <polygon
        shapeRendering="crispEdges"
        fill={color || logoColors[6]}
        points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
        onMouseEnter={onHoverLetter ? () => onHoverLetter(6) : undefined}
      />
    </svg>
  )
  // return <Image width={206 / 2} height={31 / 2} src={logo.src} />
}

export const LogoIcon = ({ downscale = 2, color = 'var(--color)' }: any) => {
  return (
    <YStack
      als="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 0.7,
      }}
    >
      <svg
        width={450 / 8 / downscale}
        height={420 / 8 / downscale}
        viewBox="0 0 450 420"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g
          transform="translate(225.000000, 210.000000) scale(-1, 1) translate(-225.000000, -210.000000) "
          fill={color}
        >
          <rect fill={color} x="150" y="0" width="20" height="20"></rect>
          <rect fill={color} x="180" y="0" width="20" height="20"></rect>
          <rect fill={color} x="210" y="0" width="20" height="20"></rect>
          <rect fill={color} x="240" y="0" width="20" height="20"></rect>
          <rect fill={color} x="270" y="0" width="20" height="20"></rect>
          <rect fill={color} x="300" y="0" width="20" height="20"></rect>
          <rect fill={color} x="330" y="30" width="20" height="20"></rect>
          <rect fill={color} x="360" y="60" width="20" height="20"></rect>
          <rect fill={color} x="390" y="90" width="20" height="20"></rect>
          <rect fill={color} x="390" y="120" width="20" height="20"></rect>
          <rect fill={color} x="390" y="150" width="20" height="20"></rect>
          <rect fill={color} x="390" y="180" width="20" height="20"></rect>
          <rect fill={color} x="420" y="210" width="20" height="20"></rect>
          <rect fill={color} x="420" y="240" width="20" height="20"></rect>
          <rect fill={color} x="420" y="270" width="20" height="20"></rect>
          <rect fill={color} x="390" y="300" width="20" height="20"></rect>
          <rect fill={color} x="360" y="330" width="20" height="20"></rect>
          <rect fill={color} x="330" y="360" width="20" height="20"></rect>
          <rect fill={color} x="300" y="390" width="20" height="20"></rect>
          <rect fill={color} x="270" y="390" width="20" height="20"></rect>
          <rect fill={color} x="240" y="360" width="20" height="20"></rect>
          <rect fill={color} x="210" y="360" width="20" height="20"></rect>
          <rect fill={color} x="210" y="390" width="20" height="20"></rect>
          <rect fill={color} x="180" y="390" width="20" height="20"></rect>
          <rect fill={color} x="150" y="360" width="20" height="20"></rect>
          <rect fill={color} x="150" y="330" width="20" height="20"></rect>
          <rect fill={color} x="120" y="300" width="20" height="20"></rect>
          <rect fill={color} x="90" y="240" width="20" height="20"></rect>
          <rect fill={color} x="90" y="270" width="20" height="20"></rect>
          <rect fill={color} x="90" y="210" width="20" height="20"></rect>
          <rect fill={color} x="60" y="180" width="20" height="20"></rect>
          <rect fill={color} x="30" y="180" width="20" height="20"></rect>
          <rect fill={color} x="0" y="150" width="20" height="20"></rect>
          <rect fill={color} x="30" y="120" width="20" height="20"></rect>
          <rect fill={color} x="60" y="120" width="20" height="20"></rect>
          <rect fill={color} x="90" y="120" width="20" height="20"></rect>
          <rect fill={color} x="0" y="90" width="20" height="20"></rect>
          <rect fill={color} x="0" y="120" width="20" height="20"></rect>
          <rect fill={color} x="30" y="60" width="20" height="20"></rect>
          <rect fill={color} x="30" y="60" width="20" height="20"></rect>
          <rect fill={color} x="60" y="60" width="20" height="20"></rect>
          <rect fill={color} x="120" y="30" width="20" height="20"></rect>
          <rect fill={color} x="150" y="60" width="20" height="20"></rect>
          <rect fill={color} x="240" y="90" width="20" height="20"></rect>
          <rect fill={color} x="240" y="210" width="20" height="20"></rect>
          <rect fill={color} x="240" y="240" width="20" height="20"></rect>
          <rect fill={color} x="270" y="270" width="20" height="20"></rect>
          <rect fill={color} x="300" y="240" width="20" height="20"></rect>
          <rect fill={color} x="300" y="210" width="20" height="20"></rect>
          <rect fill={color} x="90" y="60" width="20" height="20"></rect>
        </g>
      </svg>
    </YStack>
  )
}
