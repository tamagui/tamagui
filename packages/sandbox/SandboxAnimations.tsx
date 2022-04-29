import React, { useRef, useState } from 'react'
import { Button, Paragraph, Separator, Square, Theme, XStack, YStack } from 'tamagui'

import { animations } from './animations.reanimated'

const positions = [
  {
    x: 0,
    y: 0,
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
  },
]

const animationDescriptions = [
  {
    name: 'Bouncy',
    description: 'A bouncy spring',
    animation: 'bouncy',
    settings: animations.animations.bouncy,
  },
  {
    name: 'Lazy',
    description: 'A lazy, straightforward spring',
    animation: 'lazy',
    settings: animations.animations.lazy,
  },
  {
    name: 'Quick',
    description: 'A super fast spring',
    animation: 'quick',
    settings: animations.animations.quick,
  },
] as const

export function SandboxAnimatinos() {
  const [animationI, setAnimationI] = useState(0)
  const [positionI, setPositionI] = useState(2)
  const position = positions[positionI]
  const animation = animationDescriptions[animationI]
  const next = (to = 1) => {
    setPositionI((x) => (x + to) % positions.length)
  }
  const container = useRef(null)
  const settings = Object.entries(animation.settings)
  const tint = 'green'

  return (
    <YStack>
      <XStack
        bw={1}
        boc={`$${tint}5`}
        borderStyle="dashed"
        w="100%"
        br="$6"
        ov="hidden"
        // bc="$backgroundHover"
        h={305}
        maw={880}
        als="center"
        x={0}
      >
        <Theme name={tint}>
          <YStack
            ref={container}
            pos="relative"
            // className="hero-gradient"
            ai="center"
            jc="center"
            width="60%"
            $sm={{ width: '100%' }}
          >
            <Square
              animated
              animation={animation.animation}
              elevation="$4"
              size={110}
              bc="$color"
              br="$9"
              onPress={() => next()}
              {...position}
            >
              <LogoIcon downscale={0.75} />
            </Square>

            <Button
              pos="absolute"
              bottom={20}
              right={20}
              circular
              theme={tint}
              size="$6"
              onPress={() => next()}
            />
          </YStack>
        </Theme>

        <Separator vertical />

        <YStack pos="relative" $sm={{ display: 'none' }} width="40%">
          <YStack fullscreen zi={-1} theme="alt2" bc="$background" />

          {animationDescriptions.map((item, i) => {
            const isActive = item === animation
            return (
              <Theme key={item.name} name={isActive ? null : 'alt2'}>
                <YStack
                  {...(isActive && {
                    bc: '$backgroundHover',
                  })}
                  px="$4"
                  bc="$background"
                  py="$2"
                  cursor="pointer"
                  hoverStyle={{
                    bc: '$backgroundHover',
                  }}
                  onPress={() => {
                    setAnimationI(i)
                    next()
                  }}
                >
                  <Paragraph selectable={false} cursor="inherit" size="$4" fontWeight="800">
                    {item.name}
                  </Paragraph>
                  <Paragraph selectable={false} size="$3" cursor="inherit" theme="alt2">
                    {item.description}
                  </Paragraph>
                </YStack>
              </Theme>
            )
          })}

          <Separator />

          <XStack bc="$background" p="$4" ai="center" jc="center">
            {settings.map(([key, value], i) => {
              return (
                <React.Fragment key={key}>
                  <YStack>
                    <Paragraph size="$2" fow="800">
                      {key}
                    </Paragraph>
                    <Paragraph>{value}</Paragraph>
                  </YStack>
                  {i < settings.length - 1 && <Separator vertical mx={20} />}
                </React.Fragment>
              )
            })}
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  )
}

const LogoIcon = ({ downscale = 2, color = 'var(--color)' }: any) => {
  return (
    <YStack
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
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-150.000000, -210.000000)">
            <g transform="translate(150.000000, 210.000000)">
              <g transform="translate(30.000000, 30.000000)" fill={color}>
                {/* <path d="M300,0 L300,30 L364,30 L364,60 L420,60 L420,150 L364,150 L364,180 L300,180 L300,300 L270,300 L270,360 L60,360 L60,300 L0,300 L0,60 L60,60 L60,0 L300,0 Z"></path> */}
              </g>
              <g
                transform="translate(225.000000, 210.000000) scale(-1, 1) translate(-225.000000, -210.000000) "
                fill={color}
              >
                <g>
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
              </g>
            </g>
          </g>
        </g>
      </svg>
    </YStack>
  )
}
