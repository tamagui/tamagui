import { useRef, useState } from 'react'
import { Circle, XStack } from 'tamagui'

// faithful repro of the tamagui.dev LogoWords "dot" mechanism:
// a Circle with transition="medium" whose `x` is updated continuously from
// onMouseMove as the pointer sweeps across the 7 letter sections. moving the
// mouse rapidly left/right interrupts the transform animation mid-flight every
// frame. the motion driver must keep redirecting from the CURRENT animated
// position; the regression makes each interruption RESTART the animation from a
// stale base, so the dot keeps re-beginning its glide instead of moving
// smoothly (a constant stutter — on the real homepage it's tiny, here it's
// amplified).
//
// geometry is scaled up vs the real logo (SECTION=60 instead of ~18px) so the
// restart shows up as a large, unambiguous single-frame jump; the driver code
// path is identical to the real logo.

const NUM = 7
const SECTION = 60
const positions = Array.from({ length: NUM }, (_, i) => i * SECTION)

export function LogoDotInterruptCase() {
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <XStack padding="$8">
      <XStack
        ref={ref as any}
        data-testid="logo-strip"
        position="relative"
        width={(NUM - 1) * SECTION + 60}
        height={80}
        backgroundColor="$color3"
        // @ts-ignore - web onMouseMove
        onMouseMove={(e: MouseEvent) => {
          const el = ref.current
          if (!el) return
          const rect = el.getBoundingClientRect()
          const x = e.clientX - rect.left
          const section = Math.max(0, Math.min(NUM - 1, Math.floor(x / SECTION)))
          // same as setTintIndex: no-op if unchanged (React bails on same state)
          setIndex(section)
        }}
      >
        <Circle
          data-testid="logo-dot"
          transition="medium"
          position="absolute"
          top={30}
          left={20}
          x={positions[index]}
          size={16}
          backgroundColor="$color12"
        />
        {positions.map((p, i) => (
          <XStack
            key={i}
            position="absolute"
            left={p + 20}
            top={10}
            width={1}
            height={16}
            backgroundColor="$color8"
          />
        ))}
      </XStack>
    </XStack>
  )
}
