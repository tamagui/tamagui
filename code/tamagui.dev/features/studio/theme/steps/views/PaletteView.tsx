import {
  Anchor,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
} from '@tamagui/lucide-icons'
import { PALETTE_BACKGROUND_OFFSET, getThemeSuitePalettes } from '@tamagui/theme-builder'
import { Store, getStore, useStore } from '@tamagui/use-store'
import { parseToHsla } from 'color2k'
import { memo } from 'react'
import type { XStackProps } from 'tamagui'
import {
  Button,
  Label,
  Separator,
  SizableText,
  TooltipSimple,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import type { HSLA } from '~/features/studio/colors/ColorPicker'
import { ColorPickerContents } from '~/features/studio/colors/ColorPicker'
import { useDoublePress } from '~/features/studio/hooks/useDoublePress'
import { rootStore } from '../../../state/RootStore'
import { toastController } from '../../../ToastProvider'
import { defaultScaleGrouped } from '../../constants/defaultScaleGrouped'
import type { BuildPalette, BuildThemeAnchor } from '../../types'
import { XLabeledItem } from '../../views/XLabeledItem'

type Props = {
  palette: BuildPalette
  onUpdate: (next: Partial<BuildPalette>) => void
}

class PaletteStore extends Store<{ name: string }> {
  hoveredColor = 0
  selectedColor = 0

  get activeColor() {
    return this.hoveredColor === -1 ? this.selectedColor : this.hoveredColor
  }

  setHoveredColor(index: number) {
    this.hoveredColor = index
  }

  setSelectedColor(index: number) {
    this.selectedColor = index
    this.hoveredColor = -1
  }
}

const usePaletteStore = (name: string) => {
  return useStore(PaletteStore, { name })
}

export const PaletteView = memo((props: Props) => {
  const { palette, onUpdate } = props
  const store = usePaletteStore(palette.name)
  const isDark = useThemeName().startsWith('dark')
  const palettes = getThemeSuitePalettes(palette)
  const darkPalette = palettes['dark']!
  const lightPalette = palettes['light']!

  const colors = {
    light: sliceToPalette(lightPalette),
    dark: sliceToPalette(darkPalette),
  }

  const { activeColor } = store

  const hoveredItem = defaultScaleGrouped[activeColor]

  const { anchors } = palette

  const anchorRealIndex = +hoveredItem?.value - PALETTE_BACKGROUND_OFFSET

  const anchorIndex = anchors.findIndex((x) => x.index === anchorRealIndex)

  const anchor = anchors[anchorIndex]
  const nextAnchor = anchors[anchorIndex + 1]
  const prevAnchor = anchors[anchorIndex - 1]

  const toggleAnchorAt = async (index: number) => {
    if (anchor) {
      // DELETE
      if (index === 0) {
        toastController.show(`Can't delete anchor at index 0`)
        return
      }
      if (anchors.length === 2) {
        await rootStore.confirmDialog('alert', {
          title: `Can't delete anchor`,
          message: `You must have at least 2 anchors to create a palette.`,
        })
        return
      }

      if (
        await rootStore.confirmDialog('confirm-delete', {
          thingName: `anchor at ${index}`,
        })
      ) {
        onUpdate({
          anchors: anchors.filter((x) => x !== anchor),
        })
      }
    } else {
      const [lightHSLA, darkHSLA] = [
        // adjusts for our transparent indices
        parseToHsla(lightPalette[index + PALETTE_BACKGROUND_OFFSET]),
        parseToHsla(darkPalette[index + PALETTE_BACKGROUND_OFFSET]),
      ]

      const anchor: BuildThemeAnchor = {
        index,
        hue: {
          light: lightHSLA[0],
          dark: darkHSLA[0],
        },
        sat: {
          light: lightHSLA[1],
          dark: darkHSLA[1],
        },
        lum: {
          light: lightHSLA[2],
          dark: darkHSLA[2],
        },
      }

      const next = [...anchors]
      const insertIndex = next.findIndex((x) => x.index > index) ?? next.length - 1
      next.splice(insertIndex, 0, anchor)

      // ADD
      onUpdate({
        anchors: next,
      })
    }
  }

  const onChangeAnchorColor = (scheme: 'light' | 'dark') => (_: string, hsla: HSLA) => {
    const oppScheme = scheme === 'dark' ? 'light' : 'dark'

    const anchors = palette.anchors.map((a, i) => {
      if (a !== anchor) return a

      const next = {
        ...a,
        hue: {
          ...a.hue,
          [scheme]: hsla.hue,
        },
        sat: {
          ...a.sat,
          [scheme]: hsla.sat,
        },
        lum: {
          ...a.lum,
          [scheme]: hsla.light,
        },
      }

      function syncOppositeSchemeHue(_: BuildThemeAnchor) {
        if (_.hue.sync) {
          _.hue[oppScheme] = hsla.hue
        }
      }

      function syncOppositeSchemeSat(_: BuildThemeAnchor) {
        if (_.sat.sync) {
          _.sat[oppScheme] = hsla.sat
        }
      }

      syncOppositeSchemeHue(next)
      syncOppositeSchemeSat(next)

      // sync left does two way sync technically
      // since its "syncing" the left one, they should both sync

      // sync left
      const prevAnchor = palette.anchors[i - 1]
      if (prevAnchor) {
        if (a.hue.syncLeft) {
          prevAnchor.hue[scheme] = hsla.hue
          syncOppositeSchemeHue(prevAnchor)
        }
        if (a.sat.syncLeft) {
          prevAnchor.sat[scheme] = hsla.sat
          syncOppositeSchemeSat(prevAnchor)
        }
      }

      // sync right
      const nextAnchor = palette.anchors[i + 1]
      if (nextAnchor) {
        if (nextAnchor.hue.syncLeft) {
          nextAnchor.hue[scheme] = hsla.hue
          syncOppositeSchemeHue(nextAnchor)
        }
        if (nextAnchor.sat.syncLeft) {
          nextAnchor.sat[scheme] = hsla.sat
          syncOppositeSchemeSat(nextAnchor)
        }
      }

      return next
    })

    onUpdate({
      anchors,
    })
  }

  const lightDarkSynced = anchors.every((a) => a.hue.sync && a.sat.sync)

  return (
    <YStack contain="paint" p="$4" mx="$-4" mb="$0" f={1} gap="$4">
      <XLabeledItem label={<SizableText size="$4">Light</SizableText>}>
        <StepThemeHoverablePalette
          isActive={!isDark}
          palette={palette}
          colors={colors.light}
          onSelect={(color, index) => toggleAnchorAt(index)}
        />
      </XLabeledItem>

      <PaletteIndices />

      <XLabeledItem label={<SizableText size="$4">Dark</SizableText>}>
        <StepThemeHoverablePalette
          isActive={isDark}
          palette={palette}
          colors={colors.dark}
          onSelect={(color, index) => toggleAnchorAt(index)}
        />
      </XLabeledItem>

      <XLabeledItem label="">
        <YStack gap="$4">
          <XStack gap="$4" separator={<Separator vertical />}>
            <DataItem
              width={50}
              labelTop=""
              labelBottom={
                <SizableText
                  userSelect="none"
                  textAlign="right"
                  miw={60}
                  px="$2"
                  display="block"
                  size="$9"
                  fow="bold"
                >
                  {activeColor + 1}
                </SizableText>
              }
            />

            <DataItem
              width={200}
              labelTop={hoveredItem?.name ?? '-'}
              labelBottom={hoveredItem?.keys.join(', ') ?? '-'}
            />

            <DataItem
              labelTop={anchor ? 'Anchor' : 'Sync'}
              labelBottom={
                <XStack w={50} ov="hidden" ai="center" jc="center">
                  <Button
                    chromeless
                    size="$2"
                    scaleIcon={1.4}
                    circular
                    icon={anchor ? <Anchor /> : <ArrowLeftRight />}
                    onPress={() => {
                      toggleAnchorAt(activeColor)
                    }}
                  />
                </XStack>
              }
            />

            {/* {!anchor && <DataItem top="" bottom={<Button size="$2">Edit</Button>} />} */}
          </XStack>
        </YStack>
      </XLabeledItem>

      <XLabeledItem label="Light">
        <ColorPickerContents
          isActive={!isDark}
          disabled={!anchor}
          value={lightPalette[hoveredItem?.value ?? 0]}
          onChange={onChangeAnchorColor('light')}
          shouldDim={lightDarkSynced && isDark}
        />
      </XLabeledItem>

      <YStack my={-12}>
        <XLabeledItem label="">
          <XStack w={115}>
            <Label pe="none" miw={115} jc="flex-end" size="$1" col="$color10" o={0.5}>
              Sync:
            </Label>
          </XStack>

          <XStack gap="$4" ai="center" ml={10}>
            <XStack jc="space-between" w={100}>
              <SyncButtons
                anchorKey="hue"
                {...props}
                anchor={anchor}
                prevAnchor={prevAnchor}
                nextAnchor={nextAnchor}
              />
            </XStack>
            <XStack jc="space-between" w={80}>
              <SyncButtons
                anchorKey="sat"
                {...props}
                anchor={anchor}
                prevAnchor={prevAnchor}
                nextAnchor={nextAnchor}
              />
            </XStack>
          </XStack>
        </XLabeledItem>
      </YStack>

      <XLabeledItem label="Dark">
        <ColorPickerContents
          isActive={isDark}
          disabled={!anchor}
          value={darkPalette[hoveredItem?.value ?? 0]}
          onChange={onChangeAnchorColor('dark')}
          shouldDim={lightDarkSynced && !isDark}
        />
      </XLabeledItem>
    </YStack>
  )
})

const SyncButtons = memo(
  ({
    anchorKey,
    onUpdate,
    anchor,
    prevAnchor,
    nextAnchor,
    palette,
  }: Props & {
    anchorKey: 'hue' | 'sat'
    anchor: BuildThemeAnchor
    prevAnchor: BuildThemeAnchor
    nextAnchor: BuildThemeAnchor
  }) => {
    return (
      <>
        <TooltipSimple label="Sync to last anchor">
          <Button
            size={16}
            scaleIcon={1.4}
            circular
            icon={ArrowLeft}
            themeInverse={anchor?.[anchorKey].syncLeft}
            onPress={() => {
              onUpdate({
                anchors: palette.anchors.map((a) =>
                  a === anchor
                    ? {
                        ...a,
                        [anchorKey]: {
                          ...a[anchorKey],
                          syncLeft: !a[anchorKey].syncLeft,
                        },
                      }
                    : a
                ),
              })
            }}
            {...(!prevAnchor
              ? {
                  o: 0.1,
                  disabled: true,
                }
              : null)}
          />
        </TooltipSimple>

        <TooltipSimple label="Sync light and dark">
          <Button
            size={16}
            scaleIcon={1.4}
            circular
            icon={ArrowUpDown}
            themeInverse={anchor?.[anchorKey].sync}
            onPress={() => {
              onUpdate({
                anchors: palette.anchors.map((a) =>
                  a === anchor
                    ? {
                        ...a,
                        [anchorKey]: {
                          ...a[anchorKey],
                          sync: !a[anchorKey].sync,
                        },
                      }
                    : a
                ),
              })
            }}
          />
        </TooltipSimple>

        <TooltipSimple label="Sync to next anchor">
          <Button
            size={16}
            scaleIcon={1.4}
            circular
            icon={ArrowRight}
            themeInverse={nextAnchor?.[anchorKey].syncLeft}
            onPress={() => {
              onUpdate({
                anchors: palette.anchors.map((a) =>
                  a === nextAnchor
                    ? {
                        ...a,
                        [anchorKey]: {
                          ...a[anchorKey],
                          syncLeft: !a[anchorKey].syncLeft,
                        },
                      }
                    : a
                ),
              })
            }}
            {...(!nextAnchor
              ? {
                  o: 0.1,
                  disabled: true,
                }
              : null)}
          />
        </TooltipSimple>
      </>
    )
  }
)

const DataItem = ({
  labelTop,
  labelBottom,
  width,
}: { labelTop: any; labelBottom: any; width?: any }) => {
  return (
    <YStack w={width} maw={width}>
      <SizableText userSelect="none">{labelTop}</SizableText>
      <SizableText
        userSelect="none"
        size="$2"
        theme={typeof labelBottom === 'string' ? 'alt2' : null}
      >
        {labelBottom}
      </SizableText>
    </YStack>
  )
}

// get the center 12 items:
const sliceToPalette = (colors: string[]) => {
  const toRemove = colors.length - 12
  return colors.slice(toRemove / 2, colors.length - toRemove / 2)
}

type PaletteProps = {
  colors: string[]
  size?: 'small' | 'medium'
  children?: (color: string, index: number) => JSX.Element
  palette: BuildPalette
  onSelect?: (color: string, index: number) => void
  isActive?: boolean
}

export const StepThemeHoverablePalette = memo((props: PaletteProps) => {
  const { colors, size = 'medium' } = props
  const borderRadius = size === 'medium' ? 10 : 6

  return (
    <XStack f={1} br={borderRadius} bw={1} bc="$color7">
      {colors.map((color, i) => {
        return <PaletteColor {...props} color={color} index={i} key={i} />
      })}
    </XStack>
  )
})

// add some delay but no delay if moving across

const delay = 360
let hovered = -1
let tm

const mouseEnter = (i: number, name: string) => {
  clearTimeout(tm)
  const alreadyHovered = hovered !== -1
  const paletteStore = getStore(PaletteStore, { name })
  if (alreadyHovered) {
    // right away
    hovered = i
    paletteStore.setHoveredColor(i)
    return
  }
  tm = setTimeout(() => {
    hovered = i
    paletteStore.setHoveredColor(i)
  }, delay)
}

const mouseLeave = (i: number) => {
  clearTimeout(tm)
  if (hovered === i) {
    tm = setTimeout(() => {
      hovered = -1
    }, delay / 2)
  }
}

const PaletteColor = memo(
  (
    props: PaletteProps & {
      color: string
      index: number
    }
  ) => {
    const {
      color,
      index,
      colors,
      size = 'medium',
      children,
      palette,
      onSelect,
      isActive,
    } = props
    const store = usePaletteStore(palette.name)
    const { hoveredColor, selectedColor } = store
    const borderRadius = size === 'medium' ? 10 : 6
    const { anchors } = palette

    const anchor = anchors.find((x) => x.index === index)

    const doublePressProps = useDoublePress({
      eagerSingle: true,
      onSinglePress() {
        store.setSelectedColor(index)
        store.setHoveredColor(index)
      },
      onDoublePress() {
        onSelect?.(color, index)
      },
    })

    const radiusStyle = {
      ...(index === 0 && {
        bblr: borderRadius - 1.333,
        btlr: borderRadius - 1.333,
      }),
      ...(index === colors.length - 1 && {
        btrr: borderRadius - 1.333,
        bbrr: borderRadius - 1.333,
      }),
    } satisfies XStackProps

    return (
      <XStack
        h={isActive ? 42 : 26}
        // size === 'small' ? 32 : 42}
        w={`${(1 / colors.length) * 100}%`}
        ov="hidden"
        borderWidth={2}
        // @ts-expect-error
        borderColor={color}
        onMouseEnter={() => {
          mouseEnter(index, palette.name)
        }}
        {...(hoveredColor === index && {
          zi: 10000,
          outlineColor: '$blue10',
          outlineStyle: 'solid',
          outlineWidth: 1.5,
          shadowColor: '$blue10',
          shadowRadius: 5,
          shadowOpacity: 1,
        })}
        {...(selectedColor === index && {
          zi: 10000,
          outlineColor: 'color-mix(in srgb, currentColor 60%, transparent)',
          outlineStyle: 'solid',
          outlineWidth: 2,
        })}
        {...(selectedColor === hoveredColor &&
          hoveredColor === index && {
            shadowColor: '$blue10',
            shadowRadius: 10,
            shadowOpacity: 1,
          })}
        {...radiusStyle}
        {...doublePressProps}
        onMouseLeave={() => {
          mouseLeave(index)
          doublePressProps.onMouseLeave()
          if (store.hoveredColor === index) {
            store.hoveredColor = store.selectedColor
          }
        }}
      >
        {anchor && (
          <>
            <XStack
              pos="absolute"
              t={1}
              l={1}
              r={1}
              b={1}
              zi={10}
              pe="none"
              {...radiusStyle}
              bw={1}
              o={1}
              bc="$color8"
            />
            <XStack
              fullscreen
              zi={10}
              pe="none"
              {...radiusStyle}
              bw={1}
              o={0.5}
              bc="$background"
            />
          </>
        )}
        <XStack fullscreen bg={color as any} ai="center" jc="center">
          <SizableText
            selectable={false}
            color={index > 4 ? '$background' : '$color'}
            size="$1"
            scale={size === 'small' ? 0.8 : 1}
          >
            {children?.(color, index)}
          </SizableText>
        </XStack>
      </XStack>
    )
  }
)

const PaletteIndices = () => (
  <YStack my="$-3">
    <XLabeledItem label="">
      <XStack f={1}>
        {new Array(12).fill(0).map((_, i) => {
          return (
            <SizableText
              w={`${1 / 12}%`}
              f={1}
              key={i}
              size="$1"
              theme="alt2"
              ff="$mono"
              als="center"
              ta="center"
            >
              {i + 1}
            </SizableText>
          )
        })}
      </XStack>
    </XLabeledItem>
  </YStack>
)
