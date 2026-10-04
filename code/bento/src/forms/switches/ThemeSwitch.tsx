import { type ComponentSize, resolveSizing } from '@tamagui/core'
import { useUserScheme } from '@vxrn/color-scheme'
import { useId } from 'react'
import { View } from 'tamagui'
import { MoonStar, Sun } from '../../icons'
import { Switch } from './common/switchParts'

const DAY = '#7cc6f2'
const NIGHT = '#1b2340'

// a day and night toggle for the color scheme. it stands alone in a header,
// so it runs half again larger than a plain switch at the same size
export function ThemeSwitch({ size = 'md' }: { size?: ComponentSize }) {
  const id = useId()
  const userScheme = useUserScheme()
  const dark = userScheme.value === 'dark'

  const height = Math.round(resolveSizing(size).square * 1.5)
  const inset = Math.max(3, Math.round(height / 12))
  const knob = height - inset * 2

  return (
    <Switch
      id={id}
      aria-label="Dark mode"
      size={size}
      checked={dark}
      onCheckedChange={(next) => userScheme.set(next ? 'dark' : 'light')}
      width={height * 2}
      height={height}
      minHeight={height}
      padding={inset}
      overflow="hidden"
      backgroundColor={DAY}
      activeStyle={{ backgroundColor: NIGHT }}
      transition="200ms"
    >
      <Stars visible={dark} />
      <Switch.Thumb
        width={knob}
        height={knob}
        items="center"
        justify="center"
        transition="medium"
        backgroundColor="#ffd84d"
        activeStyle={{ backgroundColor: '#e9ebf5' }}
      >
        {dark ? (
          <MoonStar size={knob * 0.55} color={NIGHT} />
        ) : (
          <Sun size={knob * 0.55} color="#b06f00" />
        )}
      </Switch.Thumb>
    </Switch>
  )
}

const stars = [
  { left: '18%', top: '28%', side: 3 },
  { left: '32%', top: '58%', side: 2 },
  { left: '12%', top: '66%', side: 2 },
  { left: '40%', top: '24%', side: 2 },
]

function Stars({ visible }: { visible: boolean }) {
  return (
    <>
      {stars.map((star, index) => (
        <View
          key={index}
          position="absolute"
          l={star.left as any}
          t={star.top as any}
          width={star.side}
          height={star.side}
          rounded="full"
          bg="white"
          opacity={visible ? 0.9 : 0}
          transition="200ms"
        />
      ))}
    </>
  )
}
