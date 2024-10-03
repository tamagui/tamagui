import { View } from '@tamagui/core'
import React, { useState } from 'react'
import type { ViewProps } from 'tamagui'

export const OneBall = (props) => {
  const scaleDownBy = (1 / 20) * (props.size ?? 1)
  const size = {
    width: 590 * scaleDownBy,
    height: 590 * scaleDownBy,
  }

  return (
    <svg
      viewBox="0 0 590 590"
      {...size}
      {...props}
      style={{
        borderRadius: 1000,
        overflow: 'hidden',
        ...size,
        ...props.style,
      }}
    >
      <svg width="590px" height="590px" viewBox="0 0 590 590">
        <defs>
          <filter
            x="-93.3%"
            y="-81.2%"
            width="286.7%"
            height="262.4%"
            filterUnits="objectBoundingBox"
            id="filter-1"
          >
            <feGaussianBlur stdDeviation="22" in="SourceGraphic"></feGaussianBlur>
          </filter>
          <filter
            x="-13.5%"
            y="-46.9%"
            width="126.9%"
            height="193.8%"
            filterUnits="objectBoundingBox"
            id="filter-2"
          >
            <feGaussianBlur stdDeviation="20" in="SourceGraphic"></feGaussianBlur>
          </filter>
          <filter
            x="-23.9%"
            y="-22.5%"
            width="147.8%"
            height="145.1%"
            filterUnits="objectBoundingBox"
            id="filter-3"
          >
            <feGaussianBlur stdDeviation="41" in="SourceGraphic"></feGaussianBlur>
          </filter>
        </defs>
        <g id="favicon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-0, 0)" fillRule="nonzero">
            <circle id="Oval" fill="#F5CA05" cx="295" cy="295" r="295"></circle>
            <circle id="Oval" fill="#FFFFFF" cx="311" cy="230" r="110"></circle>
            <path
              d="M299.32294,286 L339.7951,281.25 C342.598367,279.138889 344,276.324074 344,272.805556 C344,269.287037 342.247958,267 338.743875,265.944444 L329.282851,265.944444 L321.398664,178.333333 C320.347439,173.055556 318.244989,172 312.988864,172 C307.732739,172 305.63029,173.583333 304.053452,175.166667 C302.476615,176.75 302.476615,182.555556 301.951002,183.611111 C301.42539,184.666667 291.438753,188.361111 287.759465,189.944444 C284.080178,191.527778 284.080178,201.555556 287.759465,203.666667 C291.438753,205.777778 298.271715,202.083333 301.42539,204.722222 L307.207127,267.527778 C299.339925,268.871363 294.784617,270.102844 293.541203,271.222222 C291.676081,272.901289 290.91314,274.388889 291.438753,279.666667 C291.789161,283.185185 294.417223,285.296296 299.32294,286 Z"
              id="Path-7"
              fill="#000000"
            ></path>
            <ellipse
              id="Oval"
              fill="#FFFFFF"
              opacity="0.453031994"
              filter="url(#filter-1)"
              transform="translate(200.0089, 137.737) rotate(46) translate(-200.0089, -137.737)"
              cx="200.008945"
              cy="137.73703"
              rx="35.3577818"
              ry="40.6350626"
            ></ellipse>
            <path
              d="M521,138 C482.503431,98.2196247 448.723549,71.1799277 419.660355,56.880909 C376.065564,35.432381 347.543959,28.4841486 295.097041,26.8563104 C242.650124,25.2284722 225.598176,37.942459 183.728994,56.880909 C155.816206,69.5065424 119.573208,92.6834255 75,126.411558 C102.798028,89.5392443 133.411045,63.0262947 166.839053,46.8727095 C216.981065,22.6423316 259.733728,10 295.097041,10 C330.460355,10 373.740828,20.0085949 428.633136,46.8727095 C465.228008,64.7821192 496.016963,95.1578827 521,138 Z"
              id="Path-8"
              fill="#FFFFFF"
              opacity="0.773065476"
              filter="url(#filter-2)"
            ></path>
            <path
              d="M361.057245,44 C431.694309,123.939704 467.935264,174.984191 469.780109,197.133462 C472.547375,230.357369 482.654123,254.819372 459.752272,321.224371 C436.85042,387.629371 415.418677,407.823985 383.224042,440.562863 C361.760952,462.388781 259.019605,478.230174 75,488.087041 C207.883501,556.029014 286.171,590 309.862498,590 C333.553996,590 368.739389,581.727273 415.418677,565.181818 C481.196175,535.021945 525.881624,499.994866 549.475024,460.10058 C584.865123,400.259152 591.955643,340.867492 589.586372,292.181818 C587.2171,243.496144 582.366118,196.314838 555.280613,172.31528 C537.223611,156.315576 472.482488,113.543815 361.057245,44 Z"
              id="Path-9"
              fill="#000000"
              opacity="0.0963076637"
              filter="url(#filter-3)"
            ></path>
          </g>
        </g>
      </svg>
    </svg>
  )
}

export function OneLogo({
  size = 1,
  animate,
  ...props
}: ViewProps & { size?: number; animate?: boolean }) {
  const [start, setStart] = React.useState(false)
  const scaleDownBy = 0.12 * size

  return (
    <View
      pos="relative"
      width={1840 * scaleDownBy}
      height={1451 * scaleDownBy}
      x={-23 * size}
      mt={-28 * size}
      mb={-30 * size}
      transformOrigin="left top"
      onMouseEnter={() => {
        if (animate) {
          setStart(true)
        }
      }}
      onMouseLeave={() => {
        setStart(false)
      }}
      {...props}
    >
      <OneBallAnimation size={size} start={start} />
      <svg
        width={2999 * scaleDownBy}
        height={1451 * scaleDownBy}
        style={{ marginLeft: -55 * size }}
        viewBox="0 0 2999 1451"
      >
        <g id="three" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g
            id="Group"
            transform="translate(686.000000, 511.000000)"
            fill="var(--logoColor)"
          >
            <path d="M1153.88676,0 C1289.53097,-0.00598487498 1339.37168,84.9945999 1356.97345,141.995028 C1374.57522,198.995456 1366.29204,281.995998 1238.93805,281.995998 L1238.93805,281.995998 L1052,282 C1073.33333,322 1103.33333,342 1142,342 C1180.66667,342 1224,330.333333 1272,307 L1272,307 L1334,410 C1269,446 1226.77907,462 1145.24503,462 C985.75637,462 921,352.035259 921,232.01763 C921,112 996.510066,0.00694375263 1153.88676,0 Z M1152.25624,112 C1087.51247,112 1059.72682,164.642495 1060.0034,176.93048 C1065.71931,177.101513 1124.38484,176.956964 1236,176.496832 C1236,150.497005 1217,112 1152.25624,112 Z"></path>
            <path d="M618,453.002692 L478,453.002692 L478,452.999429 L476,452.999429 L476,8.99942948 L584,8.99942948 L584,8.99942948 C611.084277,8.99942948 612.779589,30.0927846 615.960519,66.0132312 L634,67.0026924 C670,23 714,9.00000001 765,8.99942934 C839,8.99942948 893,67 893,180.999429 L892.777605,453.810647 L750.792347,453.810647 L751,236.002692 C751,160.002692 719.91488,148.133654 688.870971,148.614649 C665.47564,148.977136 620.72958,149.001026 617.999275,232.238226 L618,453.002692 Z"></path>
            <path d="M225.5,3.99942952 C356.533784,3.99942952 451,108.755636 451,232.979649 C451,357.203662 356.533784,464.99943 225.5,464.99943 C94.4662162,464.99943 0,357.203662 0,232.979649 C0,108.755636 94.4662162,3.99942952 225.5,3.99942952 Z M225,127.49943 C172.532949,127.49943 130,174.509531 130,232.49943 C130,290.489328 172.532949,337.49943 225,337.49943 C277.467051,337.49943 320,290.489328 320,232.49943 C320,174.509531 277.467051,127.49943 225,127.49943 Z"></path>
          </g>
        </g>
      </svg>

      {/* the animation ball flickers in this one is stable */}
      <OneBall
        size={1.36 * size}
        style={{
          position: 'absolute',
          transform: `translateY(${83 * size}px) translateX(${198 * size}px)`,
          zIndex: -1,
        }}
      />
    </View>
  )
}

function OneBallAnimation({
  start,
  size: sizeProp = 1,
}: { start: boolean; size?: number }) {
  const [hovered, setHovered] = useState(false)
  const [step, setStep] = React.useState(0)
  const size = 76 * sizeProp
  const balls = hovered ? 16 : 1

  React.useEffect(() => {
    if (!start) {
      if (step !== 0) {
        // finish rotation
        const tm = setInterval(() => {
          setStep((prev) => {
            const next = (prev + 1) % balls
            if (next === 0) {
              clearTimeout(tm as any)
            }
            return next
          })
        }, 100)
        return () => {
          clearTimeout(tm as any)
        }
      }
      return
    }
    const tm = setInterval(() => {
      setStep((prev) => (prev + 1) % balls)
    }, 80)
    return () => {
      clearTimeout(tm as any)
    }
  }, [balls, start])

  return (
    <View
      // opacity={0}
      // $group-hover={{ opacity: 1 }}
      pos="absolute"
      w={size}
      h={size}
      t={65 * sizeProp}
      l={180 * sizeProp}
      onMouseEnter={() => setHovered(true)}
      userSelect="none"
    >
      {new Array(balls).fill(0).map((_, index) => {
        return (
          <img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: step === index ? 1 : 0,
            }}
            key={index}
            width={size}
            height={size}
            src={`/ball-${index + 1}.svg`}
            alt="One Logo Pool Ball"
          />
        )
      })}
    </View>
  )
}
