import { Image } from '@tamagui/image'
import { YStack } from 'tamagui'

// Safari-optimized static layout for icons
export const SafariFloatingIcons = () => {
  // Icons that should appear at phone position
  const phoneIcons = [
    { icon: '/takeout/pixel-icons/script.svg', x: -75, y: 120 },
    { icon: '/takeout/pixel-icons/start-up.svg', x: -25, y: 120 },
    { icon: '/takeout/pixel-icons/calendar.svg', x: 25, y: 120 },
    { icon: '/takeout/pixel-icons/trophy.svg', x: 75, y: 120 },
  ]

  // Icons that float in their original positions
  const floatingIcons = [
    { icon: '/takeout/pixel-icons/lightning-bolt.svg', x: -460, y: -220 },
    { icon: '/takeout/pixel-icons/disco-ball.svg', x: 370, y: -160 },
    { icon: '/takeout/pixel-icons/crown.svg', x: -360, y: 100 },
    { icon: '/takeout/pixel-icons/heart-eyes.svg', x: 240, y: 100 },
  ]

  return (
    <>
      {/* Phone position icons - smaller scale */}
      {phoneIcons.map((item, i) => (
        <YStack
          key={`phone-${i}`}
          position="absolute"
          x={item.x}
          y={item.y}
          scale={0.7}
          opacity={1}
          pointerEvents="none"
        >
          <Image src={item.icon} alt="Icon" width={56} height={56} />
        </YStack>
      ))}

      {/* Floating icons - original positions */}
      {floatingIcons.map((item, i) => (
        <YStack
          key={`float-${i}`}
          position="absolute"
          x={item.x}
          y={item.y}
          opacity={0.8}
          pointerEvents="none"
        >
          <Image src={item.icon} alt="Icon" width={56} height={56} />
        </YStack>
      ))}
    </>
  )
}

// Safari-optimized static clouds
export const SafariStaticClouds = () => {
  const clouds = [
    { src: '/takeout/cloud-1.svg', size: 320, x: -150, y: -600, side: 'left' },
    { src: '/takeout/cloud-2.svg', size: 280, x: -120, y: -300, side: 'left' },
    { src: '/takeout/cloud-3.svg', size: 300, x: 100, y: -250, side: 'right' },
    { src: '/takeout/cloud-1.svg', size: 260, x: -120, y: 450, side: 'left' },
    { src: '/takeout/cloud-2.svg', size: 290, x: 100, y: 500, side: 'right' },
  ]

  return (
    <YStack position="relative" height={0} overflow="visible" pointerEvents="none">
      {clouds.map((cloud, i) => (
        <YStack
          key={i}
          position="absolute"
          {...(cloud.side === 'left' ? { l: 0 } : { r: 0 })}
          t={cloud.y}
          x={cloud.x}
          opacity={0.12}
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
      ))}
    </YStack>
  )
}
