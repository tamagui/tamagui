import { useEffect } from 'react'
import { View, Text, XStack, YStack, styled } from 'tamagui'

/**
 * visual comparison page for screenshot-based diffing
 *
 * renders identical UIs using:
 *   1. tamagui flat-style syntax
 *   2. tamagui regular syntax
 *   3. raw inline styles (baseline)
 *   4. tailwind classes (loaded via CDN)
 *
 * each row shows the same visual output across all four approaches
 */

// load tailwind CDN for comparison
function TailwindLoader() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById('tw-cdn')) return
    const script = document.createElement('script')
    script.id = 'tw-cdn'
    script.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(script)
  }, [])
  return null
}

// ── comparison rows ──────────────────────────────────

function ComparisonRow({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: React.ReactNode
}) {
  return (
    <YStack gap={8} id={id}>
      <Text fontSize={14} fontWeight="600" color="$color">
        {label}
      </Text>
      <XStack gap={16} flexWrap="wrap">
        {children}
      </XStack>
    </YStack>
  )
}

function FrameworkLabel({ label }: { label: string }) {
  return (
    <Text fontSize={10} color="$color8" textAlign="center" marginBottom={4}>
      {label}
    </Text>
  )
}

function ComparisonCell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <YStack alignItems="center" gap={4}>
      <FrameworkLabel label={label} />
      {children}
    </YStack>
  )
}

// ── styled components ────────────────────────────────

const FlatBox = styled(View, {
  $width: 80,
  $height: 80,
  $bg: 'rgb(99,102,241)',
  $rounded: 8,
} as any)

const RegularBox = styled(View, {
  width: 80,
  height: 80,
  backgroundColor: 'rgb(99,102,241)',
  borderRadius: 8,
})

// ── main component ───────────────────────────────────

export function FlatStyleComparison() {
  return (
    <YStack padding={24} gap={32} backgroundColor="$background" minHeight="100vh">
      <TailwindLoader />

      <YStack gap={4}>
        <Text fontSize={24} fontWeight="bold" color="$color">
          Flat-Style Comparison
        </Text>
        <Text fontSize={14} color="$color8">
          Tamagui Flat | Tamagui Regular | Inline CSS | Tailwind
        </Text>
      </YStack>

      {/* 1: basic box */}
      <ComparisonRow label="1. Basic colored box" id="cmp-basic">
        <ComparisonCell label="Flat">
          <View
            id="cmp-basic-flat"
            {...({
              $width: 80,
              $height: 80,
              $bg: 'rgb(99,102,241)',
              $rounded: 8,
            } as any)}
          />
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-basic-regular"
            width={80}
            height={80}
            backgroundColor="rgb(99,102,241)"
            borderRadius={8}
          />
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-basic-inline"
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgb(99,102,241)',
              borderRadius: 8,
            }}
          />
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-basic-tw"
            className="w-20 h-20 bg-indigo-500 rounded-lg"
          />
        </ComparisonCell>
      </ComparisonRow>

      {/* 2: padding + border */}
      <ComparisonRow label="2. Padding + border" id="cmp-padding">
        <ComparisonCell label="Flat">
          <View
            id="cmp-pad-flat"
            {...({
              $width: 80,
              $height: 80,
              $bg: 'rgb(34,197,94)',
              $p: 12,
              $rounded: 8,
              $borderWidth: 2,
              $borderColor: 'rgb(22,163,74)',
            } as any)}
          />
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-pad-regular"
            width={80}
            height={80}
            backgroundColor="rgb(34,197,94)"
            padding={12}
            borderRadius={8}
            borderWidth={2}
            borderColor="rgb(22,163,74)"
          />
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-pad-inline"
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgb(34,197,94)',
              padding: 12,
              borderRadius: 8,
              border: '2px solid rgb(22,163,74)',
              boxSizing: 'border-box',
            }}
          />
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-pad-tw"
            className="w-20 h-20 bg-green-500 p-3 rounded-lg border-2 border-green-600 box-border"
          />
        </ComparisonCell>
      </ComparisonRow>

      {/* 3: flexbox layout */}
      <ComparisonRow label="3. Flexbox row with gap" id="cmp-flex">
        <ComparisonCell label="Flat">
          <View
            id="cmp-flex-flat"
            {...({
              $fd: 'row',
              $gap: 8,
              $alignItems: 'center',
              $p: 12,
              $bg: 'rgb(244,244,245)',
              $rounded: 8,
            } as any)}
          >
            <View {...({ $width: 24, $height: 24, $bg: 'rgb(239,68,68)', $rounded: 4 } as any)} />
            <View {...({ $width: 24, $height: 24, $bg: 'rgb(59,130,246)', $rounded: 4 } as any)} />
            <View {...({ $width: 24, $height: 24, $bg: 'rgb(234,179,8)', $rounded: 4 } as any)} />
          </View>
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-flex-regular"
            flexDirection="row"
            gap={8}
            alignItems="center"
            padding={12}
            backgroundColor="rgb(244,244,245)"
            borderRadius={8}
          >
            <View width={24} height={24} backgroundColor="rgb(239,68,68)" borderRadius={4} />
            <View width={24} height={24} backgroundColor="rgb(59,130,246)" borderRadius={4} />
            <View width={24} height={24} backgroundColor="rgb(234,179,8)" borderRadius={4} />
          </View>
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-flex-inline"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              padding: 12,
              backgroundColor: 'rgb(244,244,245)',
              borderRadius: 8,
            }}
          >
            <div style={{ width: 24, height: 24, backgroundColor: 'rgb(239,68,68)', borderRadius: 4 }} />
            <div style={{ width: 24, height: 24, backgroundColor: 'rgb(59,130,246)', borderRadius: 4 }} />
            <div style={{ width: 24, height: 24, backgroundColor: 'rgb(234,179,8)', borderRadius: 4 }} />
          </div>
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-flex-tw"
            className="flex flex-row gap-2 items-center p-3 bg-zinc-100 rounded-lg"
          >
            <div className="w-6 h-6 bg-red-500 rounded" />
            <div className="w-6 h-6 bg-blue-500 rounded" />
            <div className="w-6 h-6 bg-yellow-500 rounded" />
          </div>
        </ComparisonCell>
      </ComparisonRow>

      {/* 4: typography */}
      <ComparisonRow label="4. Typography" id="cmp-type">
        <ComparisonCell label="Flat">
          <View id="cmp-type-flat" {...({ $p: 12, $bg: 'rgb(255,255,255)', $rounded: 8 } as any)}>
            <Text {...({ $fontSize: 18, $fontWeight: 'bold', $col: 'rgb(17,24,39)' } as any)}>
              Heading
            </Text>
            <Text {...({ $fontSize: 14, $col: 'rgb(107,114,128)', $lh: 20 } as any)}>
              Body text with spacing
            </Text>
          </View>
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View id="cmp-type-regular" padding={12} backgroundColor="rgb(255,255,255)" borderRadius={8}>
            <Text fontSize={18} fontWeight="bold" color="rgb(17,24,39)">
              Heading
            </Text>
            <Text fontSize={14} color="rgb(107,114,128)" lineHeight={20}>
              Body text with spacing
            </Text>
          </View>
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-type-inline"
            style={{ padding: 12, backgroundColor: 'rgb(255,255,255)', borderRadius: 8 }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold', color: 'rgb(17,24,39)' }}>
              Heading
            </div>
            <div style={{ fontSize: 14, color: 'rgb(107,114,128)', lineHeight: '20px' }}>
              Body text with spacing
            </div>
          </div>
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div id="cmp-type-tw" className="p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">Heading</div>
            <div className="text-sm text-gray-500 leading-5">Body text with spacing</div>
          </div>
        </ComparisonCell>
      </ComparisonRow>

      {/* 5: transforms */}
      <ComparisonRow label="5. Transforms (rotate + scale)" id="cmp-transform">
        <ComparisonCell label="Flat">
          <View
            id="cmp-xform-flat"
            {...({
              $width: 60,
              $height: 60,
              $bg: 'rgb(168,85,247)',
              $rounded: 8,
              $rotate: '15deg',
              $scale: 0.9,
            } as any)}
          />
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-xform-regular"
            width={60}
            height={60}
            backgroundColor="rgb(168,85,247)"
            borderRadius={8}
            rotate="15deg"
            scale={0.9}
          />
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-xform-inline"
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'rgb(168,85,247)',
              borderRadius: 8,
              transform: 'rotate(15deg) scale(0.9)',
            }}
          />
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-xform-tw"
            className="w-[60px] h-[60px] bg-purple-500 rounded-lg rotate-[15deg] scale-90"
          />
        </ComparisonCell>
      </ComparisonRow>

      {/* 6: opacity + shadow */}
      <ComparisonRow label="6. Opacity + shadow" id="cmp-effects">
        <ComparisonCell label="Flat">
          <View
            id="cmp-fx-flat"
            {...({
              $width: 80,
              $height: 80,
              $bg: 'rgb(236,72,153)',
              $rounded: 12,
              $o: 0.85,
              $bxsh: '0 4px 12px rgba(0,0,0,0.25)',
            } as any)}
          />
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-fx-regular"
            width={80}
            height={80}
            backgroundColor="rgb(236,72,153)"
            borderRadius={12}
            opacity={0.85}
            // @ts-ignore
            boxShadow="0 4px 12px rgba(0,0,0,0.25)"
          />
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-fx-inline"
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgb(236,72,153)',
              borderRadius: 12,
              opacity: 0.85,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          />
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-fx-tw"
            className="w-20 h-20 bg-pink-500 rounded-xl opacity-85 shadow-lg"
          />
        </ComparisonCell>
      </ComparisonRow>

      {/* 7: nested card layout */}
      <ComparisonRow label="7. Card layout" id="cmp-card">
        <ComparisonCell label="Flat">
          <View
            id="cmp-card-flat"
            {...({
              $width: 160,
              $bg: 'rgb(255,255,255)',
              $rounded: 12,
              $p: 16,
              $bxsh: '0 1px 3px rgba(0,0,0,0.1)',
              $gap: 8,
            } as any)}
          >
            <View {...({ $width: '100%', $height: 60, $bg: 'rgb(99,102,241)', $rounded: 8 } as any)} />
            <Text {...({ $fontSize: 14, $fontWeight: '600', $col: 'rgb(17,24,39)' } as any)}>
              Card Title
            </Text>
            <Text {...({ $fontSize: 12, $col: 'rgb(107,114,128)' } as any)}>
              Some description text
            </Text>
          </View>
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-card-regular"
            width={160}
            backgroundColor="rgb(255,255,255)"
            borderRadius={12}
            padding={16}
            // @ts-ignore
            boxShadow="0 1px 3px rgba(0,0,0,0.1)"
            gap={8}
          >
            <View width="100%" height={60} backgroundColor="rgb(99,102,241)" borderRadius={8} />
            <Text fontSize={14} fontWeight="600" color="rgb(17,24,39)">
              Card Title
            </Text>
            <Text fontSize={12} color="rgb(107,114,128)">
              Some description text
            </Text>
          </View>
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-card-inline"
            style={{
              width: 160,
              backgroundColor: 'rgb(255,255,255)',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ width: '100%', height: 60, backgroundColor: 'rgb(99,102,241)', borderRadius: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(17,24,39)' }}>Card Title</div>
            <div style={{ fontSize: 12, color: 'rgb(107,114,128)' }}>Some description text</div>
          </div>
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-card-tw"
            className="w-40 bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="w-full h-[60px] bg-indigo-500 rounded-lg" />
            <div className="text-sm font-semibold text-gray-900">Card Title</div>
            <div className="text-xs text-gray-500">Some description text</div>
          </div>
        </ComparisonCell>
      </ComparisonRow>

      {/* 8: hover states (interactive) */}
      <ComparisonRow label="8. Hover states" id="cmp-hover">
        <ComparisonCell label="Flat">
          <View
            id="cmp-hover-flat"
            {...({
              $width: 80,
              $height: 80,
              $bg: 'rgb(14,165,233)',
              $rounded: 8,
              '$hover:bg': 'rgb(2,132,199)',
              '$hover:scale': 1.05,
            } as any)}
          />
        </ComparisonCell>
        <ComparisonCell label="Regular">
          <View
            id="cmp-hover-regular"
            width={80}
            height={80}
            backgroundColor="rgb(14,165,233)"
            borderRadius={8}
            hoverStyle={{ backgroundColor: 'rgb(2,132,199)', scale: 1.05 }}
          />
        </ComparisonCell>
        <ComparisonCell label="Inline">
          <div
            id="cmp-hover-inline"
            className="cmp-hover-box"
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgb(14,165,233)',
              borderRadius: 8,
              transition: 'all 0.15s',
            }}
          />
        </ComparisonCell>
        <ComparisonCell label="Tailwind">
          <div
            id="cmp-hover-tw"
            className="w-20 h-20 bg-sky-500 rounded-lg hover:bg-sky-600 hover:scale-105 transition-all"
          />
        </ComparisonCell>
      </ComparisonRow>
    </YStack>
  )
}
