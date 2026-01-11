import { Image } from '@tamagui/image'
import { YStack } from 'tamagui'
import { useScrollProgress, WEB_FRAME_SCROLL_END } from './useScrollProgress'

export const AnimatedClouds = () => {
  const CLOUDS_SCROLL_START = WEB_FRAME_SCROLL_END
  const CLOUDS_SCROLL_END = CLOUDS_SCROLL_START + 800
  const scrollProgress = useScrollProgress(CLOUDS_SCROLL_START, CLOUDS_SCROLL_END)

  const LOWER_CLOUDS_START = CLOUDS_SCROLL_END + 200
  const LOWER_CLOUDS_END = LOWER_CLOUDS_START + 600
  const lowerScrollProgress = useScrollProgress(LOWER_CLOUDS_START, LOWER_CLOUDS_END)

  const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

  const upperClouds = [
    {
      src: '/takeout/cloud-1.svg',
      size: 320,
      startX: -300,
      endX: -150,
      startY: -600,
      side: 'left',
    },
    {
      src: '/takeout/cloud-2.svg',
      size: 280,
      startX: -400,
      endX: -120,
      startY: -300,
      side: 'left',
    },
    {
      src: '/takeout/cloud-3.svg',
      size: 300,
      startX: 350,
      endX: 100,
      startY: -250,
      side: 'right',
    },
  ]

  const lowerClouds = [
    { src: '/takeout/cloud-1.svg', size: 260, x: -120, startY: 450, side: 'left' },
    { src: '/takeout/cloud-2.svg', size: 290, x: 100, startY: 500, side: 'right' },
  ]

  const easedUpperProgress = easeOutCubic(scrollProgress)
  const easedLowerProgress = easeOutCubic(lowerScrollProgress)

  return (
    <YStack position="relative" height={0} overflow="visible" pointerEvents="none">
      {upperClouds.map((cloud, i) => {
        const x = cloud.startX + (cloud.endX - cloud.startX) * easedUpperProgress
        const floatY = Math.sin(scrollProgress * Math.PI * 2 + i * 0.5) * 8
        const opacity = Math.min(0.12, easedUpperProgress * 0.15)

        return (
          <YStack
            key={`upper-${i}`}
            position="absolute"
            {...(cloud.side === 'left' ? { l: 0 } : { r: 0 })}
            t={cloud.startY}
            x={x}
            y={floatY}
            opacity={opacity}
            className="ease-out ms500 all"
            pointerEvents="none"
            z={-1}
            $md={{ display: 'none' }}
          >
            <Image
              src={cloud.src}
              alt="Cloud"
              width={cloud.size}
              height={cloud.size * 0.6}
              style={{ objectFit: 'contain' }}
            />
          </YStack>
        )
      })}

      {lowerClouds.map((cloud, i) => {
        const floatUp = (1 - easedLowerProgress) * 50
        const opacity = Math.min(0.12, easedLowerProgress * 0.15)

        return (
          <YStack
            key={`lower-${i}`}
            position="absolute"
            {...(cloud.side === 'left' ? { l: 0 } : { r: 0 })}
            t={cloud.startY}
            x={cloud.x}
            y={floatUp}
            opacity={opacity}
            className="ease-out ms500 all"
            pointerEvents="none"
            z={-1}
            $md={{ display: 'none' }}
          >
            <Image
              src={cloud.src}
              alt="Cloud"
              width={cloud.size}
              height={cloud.size * 0.6}
              style={{ objectFit: 'contain' }}
            />
          </YStack>
        )
      })}
    </YStack>
  )
}
