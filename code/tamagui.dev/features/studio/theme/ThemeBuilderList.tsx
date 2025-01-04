import { MoreVertical, Pencil, Plus, Trash, X } from '@tamagui/lucide-icons'
import { type Href, Slot, useRouter } from 'one'
import { useState } from 'react'
import type { DialogProps } from 'tamagui'
import {
  Adapt,
  AlertDialog,
  Button,
  Circle,
  Dialog,
  Fieldset,
  Form,
  Input,
  Label,
  ListItem,
  Paragraph,
  Popover,
  ScrollView,
  Separator,
  Sheet,
  Unspaced,
  useThemeName,
  XStack,
  YGroup,
  YStack,
} from 'tamagui'
import {
  ModalTitle,
  ThemeBuilderModalFrame,
} from '~/features/studio/theme/ThemeBuilderModalFrame'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import type { ThemeSuiteItem } from '~/features/studio/theme/types'
import { defaultThemeSuiteItem } from './constants/defaultThemeSuiteItem'

export function ThemeBuilderList() {
  const { themeSuites } = useThemeBuilderStore()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <CreateDialog
        onCreate={() => {
          setCreateDialogOpen(false)
        }}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <YStack pe="none" fullscreen zi={100}>
        <ThemeBuilderModalFrame noBottomBar isCentered>
          <YStack pe="auto" f={1}>
            <YStack py="$3" px="$4" gap="$5">
              <XStack ai="center" jc="space-between" gap="$4">
                <ModalTitle>Theme Suites</ModalTitle>
                <Button
                  iconAfter={Plus}
                  onPress={() => setCreateDialogOpen(true)}
                  size="$3"
                  br="$4"
                >
                  Create
                </Button>
              </XStack>
            </YStack>

            <Separator o={0.5} />

            <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
              {themeSuites.length > 0 ? (
                <XStack fw="wrap" gap="$3" p="$3" f={1}>
                  {themeSuites.map((themeSuite) =>
                    !themeSuite.name ? null : (
                      <ThemeSuiteCard key={themeSuite.id} themeSuite={themeSuite} />
                    )
                  )}
                </XStack>
              ) : (
                <YStack ai="center" jc="center" f={1} gap="$4">
                  <Paragraph ta="center" theme="alt2">
                    You don't have any theme suites yet.
                  </Paragraph>
                  <Button icon={Plus} onPress={() => setCreateDialogOpen(true)}>
                    Create your first
                  </Button>
                </YStack>
              )}
            </ScrollView>
          </YStack>
        </ThemeBuilderModalFrame>
      </YStack>

      <YStack pe="none" fullscreen zi={1000}>
        <Slot />
      </YStack>
    </>
  )
}

function ThemeSuiteCard({ themeSuite }: { themeSuite: ThemeSuiteItem }) {
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [renameDialog, setRenameDialog] = useState(false)
  const router = useRouter()
  const [name, setName] = useState(themeSuite.name || '')
  const isDark = useThemeName().startsWith('dark')
  const id = themeSuite.id

  function handleDeleteTheme() {
    themeBuilderStore.deleteTheme(themeSuite.id)
    setDeleteDialog(false)
  }

  function handleRenameThemeName() {
    themeBuilderStore.updateThemeSuite({
      ...themeSuite,
      name,
    })
    setRenameDialog(false)
  }

  const menu = (
    <Popover size="$5" allowFlip placement="bottom">
      <Popover.Trigger asChild>
        <Button
          onPress={(event) => {
            event.stopPropagation()
          }}
          circular
          chromeless
          icon={<MoreVertical size="$1" />}
          zi={1000}
        />
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        p={0}
        animation={[
          'quickest',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YGroup>
          <ListItem
            hoverTheme
            icon={Pencil}
            onPress={(event) => {
              event.stopPropagation()
              setRenameDialog(true)
            }}
          >
            Rename
          </ListItem>
          <ListItem
            hoverTheme
            icon={Trash}
            onPress={(event) => {
              event.stopPropagation()
              setDeleteDialog(true)
            }}
          >
            Delete
          </ListItem>
        </YGroup>
      </Popover.Content>
    </Popover>
  )

  const themePalettes = themeBuilderStore.getPalettesForTheme(
    themeSuite.baseTheme,
    themeSuite.palettes
  )
  const accentPalettes = themeSuite.baseTheme.accent
    ? themeBuilderStore.getPalettesForTheme(
        themeSuite.baseTheme.accent,
        themeSuite.palettes
      )
    : []

  const scheme = isDark ? 'dark' : 'light'
  const accentPalette = accentPalettes[scheme]
  const palette = themePalettes[scheme]

  return (
    <>
      <YStack
        br="$4"
        ov="hidden"
        bg={palette[3] as any}
        hoverStyle={{
          bg: palette[4] as any,
          outlineColor: '$gray6',
          outlineWidth: '$1',
          outlineStyle: 'solid',
        }}
        pressStyle={{
          bg: palette[2] as any,
        }}
        elevation="$1"
        onPress={() => {
          router.push(`/builder/${id}` as Href)
        }}
        cursor="pointer"
        // w="calc(50% - var(--size-4))"
        w="100%"
        h={300}
        shadowColor="$shadowColor"
        shadowOffset={{ height: 3, width: 0 }}
        shadowRadius="$2"
        f={1}
      >
        <XStack jc="space-between" p="$4">
          <YStack gap="$2">
            <Paragraph size="$6" cursor="pointer" color={palette[14] as any}>
              {themeSuite.name || 'Untitled'}
            </Paragraph>

            <Paragraph theme="alt1" cursor="pointer" size="$2" color={palette[13] as any}>
              Created{' '}
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'medium',
              }).format(themeSuite.createdAt)}
            </Paragraph>
          </YStack>
          {menu}
        </XStack>

        <XStack fullscreen ov="hidden">
          {/* sun */}
          <Circle size="$12" pos="absolute" t="$12" r="$4" bg={palette[5] as any} />

          {/* mountain 0 */}
          <YStack zi={1} fullscreen x={-140} y={90} scaleX={1.4}>
            <svg width="400px" height="234px" viewBox="0 0 400 234">
              <g transform="translate(0.000000, -107.000000)" fill={palette[9]}>
                <polygon points="12 313 40 266 59 250 72 230 102 211 132 165 160 155 176 132 200 107 236 137 264 184 291 236 344 250 369 291 400 341 0 341"></polygon>
              </g>
            </svg>
          </YStack>

          {/* mountain 1 */}
          <YStack zi={0} fullscreen x={30} y={100} scale={0.9} scaleX={1.4}>
            <svg width="359px" height="220px" viewBox="0 0 359 220">
              <g transform="translate(-169.000000, -27.000000)" fill={palette[6]}>
                <polygon points="181 219 209 172 228 156 241 136 267 100 288 61 326 27 364 43 413 89 439 136 472 156 497 197 528 247 169 247"></polygon>
              </g>
            </svg>
          </YStack>

          {/* mountain 2 */}
          <YStack fullscreen x={150} y={90} scale={0.75} scaleX={1.1}>
            <svg width="400px" height="234px" viewBox="0 0 400 234">
              <g transform="translate(0.000000, -107.000000)" fill={palette[7]}>
                <polygon points="12 313 40 266 59 250 72 230 102 211 132 165 160 155 176 132 200 107 236 137 264 184 291 236 344 250 369 291 400 341 0 341"></polygon>
              </g>
            </svg>
          </YStack>

          {/* tree */}
          <YStack fullscreen y={78} x={100} scale={0.5} scaleX={-0.95}>
            <svg
              height="532pt"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 300 532"
              width="300pt"
            >
              <path
                fill={accentPalette[10] ?? palette[10]}
                d="m1367 5263c-4-21-7-74-7-118v-80l-53 55c-48 51-52 53-55 31-4-22 12-50 80-142 15-20 18-39 16-95l-3-69-22 38c-13 21-23 51-23 67 0 68-51 109-58 47l-3-28-44 25c-24 15-48 26-54 26-20 0-11-43 17-78 51-67 54-75 26-97-23-18-24-22-10-40 14-19 16-19 46-3l30 17v-39c0-43-13-50-46-25-50 38-62-9-14-57 35-35 36-38 11-38-10 0-21-7-25-15-9-24-31-18-108 30-40 25-80 45-90 45-29 0-21-30 16-65 35-33 37-45 6-45-28 0-43-25-25-40 8-7 21-10 29-7 14 6 50-25 41-35-3-3 4-13 15-23 28-25 25-32-16-38-20-3-42-11-50-18-13-10-12-14 2-30 13-15 25-17 61-12s47 3 55-10c11-21 42-22 58-2 14 17 50 21 50 5 0-5-9-14-20-20-22-12-27-36-7-43 6-2 25 2 41 10 28 15 29 15 22-11-7-29 17-47 36-28 6 6 16 8 23 5 7-2 16 5 20 16 3 12 10 21 15 21 11 0 34-69 25-78-4-4-50-9-103-11-94-3-97-2-169 35-59 30-76 35-86 25-9-10-6-18 18-37 65-52-72-5-144 50-19 14-45 26-58 26-20 0-23-5-21-27 3-27 1-28-53-34-94-10-104-29-32-61 35-15 58-19 95-15l49 6-32-30c-29-27-31-32-17-46 18-17 40-9 91 33 16 13 38 24 50 24 18 0 15-4-16-25-40-28-45-40-22-49 8-3 15-15 15-26 0-23 17-25 44-5 11 8 27 15 37 15 9 0 33 11 53 25 51 34 45 14-9-30-25-21-42-41-39-46 7-12 51-11 59 1 11 18 25 11 25-12 0-20 2-20 34 11 22 21 36 29 41 21s10-8 21 1c8 6 30 14 50 16 45 5 81 28 105 68l19 30v-29c0-21-11-40-38-66-40-37-189-130-211-130-6 0-38 14-71 30-84 42-108 40-75-8 16-21 15-22-17-15-18 3-48 12-67 19-37 16-53 11-44-13 6-14-1-15-54-11-64 6-83-2-83-34 0-12 7-18 22-18 17 0 19-3 10-12-19-19-14-28 18-28 23 0 30-4 30-20 0-15 7-20 25-20 19 0 25-5 25-21 0-18 4-20 30-14 37 8 60-8 60-40 0-29-20-37-42-17-13 11-30 13-73 7l-56-7 25-29c15-17 23-37 20-47-3-9-8-23-10-30-3-10-19-3-53 22-61 45-75 46-66 5l7-31-71 7c-49 5-71 4-71-4 0-12 72-51 95-51 12 0 14-4 6-19-13-24-5-31 35-31 23 0 37-6 44-20 6-12 21-20 36-20 16 0 27-7 32-21 8-20 8-20 26 0s18 20 44-9c15-15 40-47 56-69 17-23 34-41 40-41 5 0 20-9 32-21 18-17 26-19 43-10 12 7 21 9 21 7 0-14-86-47-162-62-84-18-84-18-129 4-63 30-81 29-73-5l7-26-61 6c-44 5-63 3-71-7-9-11-4-18 24-35 25-14 35-27 35-45 0-19 6-25 28-28 19-2 28-9 30-25 4-27 25-35 57-23 22 9 25 7 25-15s4-25 40-25c46 0 52-12 14-29-55-25-110-25-149-1-34 21-73 21-60 0 4-6-15-10-49-10-31 0-56-3-56-7 0-5 17-17 37-28 21-11 39-29 42-40 5-28 21-36 59-29 30 6 32 4 32-21 0-22 4-26 23-23 16 2 22-2 21-14-1-13 5-18 21-18 13 0 25-6 27-12 4-12 11-8 104 66 19 16 28 18 49 8 36-16 31-32-10-32-39 0-47-21-20-56 20-27 19-32-14-39-16-3-35-13-42-21-6-8-19-14-28-14s-22-5-28-11-42-15-79-20c-38-6-88-13-112-16-33-4-46-11-52-28-11-28-29-35-91-35-27 0-49-5-49-10 0-14 58-49 92-57 29-6 36-17 18-28-17-11-11-25 11-25 12 0 23-8 26-19 4-17 12-18 64-14 55 5 59 4 59-16 0-27 16-27 32-1 16 25 28 26 28 1 0-29 74-40 101-15 10 9 19 23 19 30 0 25 20 25 30-1l10-26 25 28c24 27 24 27 25 6 0-34 24-28 39 10 7 17 15 26 18 20 2-7 20-13 39-13s34-5 34-10c0-15-59-49-105-60-22-6-52-17-67-25-14-8-47-15-71-15-25 0-48-4-52-9-10-16 46-51 82-51 45 0 39-22-8-32-19-4-108-12-199-18-244-15-310-21-316-31-3-5-18-9-35-9-54 0-26-37 35-47 20-3 36-9 36-13 0-5-16-18-35-30-44-27-44-40-1-40 19 0 38-5 41-11 4-6 13-8 20-5 8 3 19-2 25-10 17-19 30-18 57 8 29 27 40 18 18-15-21-33-3-45 32-21 26 17 27 16 50-12l23-29 39 22c22 13 42 23 45 23s2-16-1-35c-5-29-2-35 12-35 9 0 28 9 42 20 33 26 41 25 36-4-4-21-1-24 34-28 21-3 44 0 52 6 11 8 17 6 29-12 10-16 24-22 49-22 75 0 2-38-146-76-105-27-187-31-216-10-11 7-30 16-42 20-28 9-31-11-6-30 15-12 7-13-57-8-41 3-105 12-142 21-37 8-73 13-80 11-16-6 74-59 115-68l32-7-37-8c-43-8-51-32-13-40 85-17 79-14 60-36-22-23-14-35 13-20 28 15 32 14 32-5 0-15 9-16 61-10 54 5 60 4 49-9s-8-15 15-15c18 0 28-6 32-20 7-25 11-25 41 3l25 22-17-32c-9-18-16-37-16-44 0-16 48-3 83 22 23 17 27 17 27 4 0-49-34-71-168-110l-91-26-67 20c-96 30-150 27-121-7 10-13 7-14-28-8-80 15-125 18-125 10 0-4 10-18 22-31 27-29 21-35-25-22-44 12-122 8-122-6 1-16 56-38 107-43 27-2 48-8 48-12 0-3-11-17-25-30-29-28-34-62-7-58 11 2 18-5 20-20 2-16 15-28 37-38 19-7 36-18 40-24 10-16 29-12 54 11 21 20 23 20 42 3 34-31 19-92-21-81-12 3-37-1-55-9-19-8-50-14-70-14-41 0-45-13-11-35 18-12 37-14 77-9l54 7-43-32c-46-34-47-56-1-47 22 4 27 2 22-9-4-11 2-15 22-15 15 0 24-4 20-10-8-14 18-13 50 2 31 14 43 5 24-18-13-16-11-17 29-11 24 4 42 3 42-2s8-11 17-14c14-3 12-6-10-15-18-8-92-12-196-12-92 0-171-3-174-6-4-4 8-14 26-23 17-9 31-20 30-26-2-13-38-23-84-24-42-1-72-27-48-42 21-13 91-11 138 6 48 17 53 7 16-37-14-16-25-34-25-40 0-10 37-7 88 8 19 5 22 3 22-22 0-62 31-67 92-16l31 26-7-53-7-53 29 21c16 11 35 27 42 36s31 30 54 48l41 32-23-36c-21-34-29-69-16-69 3 0 19 9 35 21l29 20v-20c0-31-36-48-130-61-73-10-90-9-122 4-42 18-92 21-83 6 4-6-10-10-34-10-36 0-40-3-38-22 2-20-2-22-35-19-44 3-88-16-67-30 8-5 25-9 37-9 25 0 26-18 1-31-82-42-110-62-101-71 7-7 32-4 78 10 38 12 70 19 73 16 2-2-5-14-18-25-28-26-22-45 13-41 25 3 26 1 16-18-18-34-5-35 46-5l47 27-7-28c-6-23-5-27 5-16 15 14 33 16 24 2-10-16 11-12 25 5 18 21 40 19 40-5 0-25 15-25 60-1 27 14 45 17 75 12l40-7-40-12c-22-6-66-18-97-27-60-16-77-30-60-47 8-8 25-7 58 1 25 7 49 9 52 6s-12-24-34-46l-39-41 40 7c21 4 52 13 67 21s34 14 43 14c15 0 14-4-4-34-27-42-26-46 3-46 13 0 27-7 30-16 5-13 10-13 36 6l30 21v-20c0-35 52-27 96 14l37 35-6-36c-9-51 15-55 62-10 44 43 61 46 61 9 0-16 5-35 10-43 7-12 13-11 34 9 25 23 27 24 45 7s19-17 26 3c3 12 13 21 20 21 8 0 22 14 30 31 16 29 17 30 35 14 28-26 52-14 81 38 36 66 49 78 49 44 0-15 4-27 9-27 11 0 61 47 61 58 0 6 8 9 18 8 13-1 18 8 20 42 3 40 5 43 20 29 9-8 26-17 37-19 18-3 20-11 18-83-3-82-17-150-47-218l-16-37h165c184 0 176-4 150 71-19 54-25 170-9 176 7 2 22-12 34-32 24-39 37-44 42-17 3 12 10 5 26-25 23-44 41-54 101-57 20-1 48-9 61-19 32-23 44-21 37 4-4 16-2 19 11 14 20-8 185-15 178-7-3 2-1 13 5 24 7 14 7 23-2 34-20 24-3 26 40 5 50-26 54-26 46-2-5 17-2 19 19 13 13-4 34-19 46-34 18-24 24-26 43-17 18 10 24 8 43-14l22-25 11 25c11 24 13 24 30 9 22-20 30-20 51-1 16 14 16 20 3 57-7 22-12 43-9 45 2 2 27-16 55-41 58-52 75-56 92-23 6 12 13 23 14 25 2 2 20-8 40-23 35-23 75-33 75-18 0 3-8 15-17 25-15 17-15 20-3 28 8 6 24 10 34 10 17 0 15 5-14 35-42 43-23 45 45 5 51-30 85-38 85-20 0 6-7 13-15 16-27 11-16 24 20 24 37 0 85 18 85 32 0 4-19 8-42 8-62 0-275 45-304 65-31 20-23 38 12 25 39-15 47-12 40 15-6 23-4 25 19 19 14-3 37-3 52 1l28 7-25 19-25 19h35c43 0 80 10 80 20 0 5-15 14-32 21-32 12-32 12-8 16 38 7 47 21 24 38-17 13-13 14 51 15s68 2 51 15c-11 8-27 15-37 15-9 0-22 7-29 15-11 13-5 15 44 15 31 0 56 4 56 9 0 9-22 14-113 27-26 3-50 10-52 14-3 5 34 21 82 35 96 29 119 43 104 58-8 8-127-12-181-31-8-3 0 11 18 29 58 63 37 65-79 9-100-48-144-51-250-15-155 53-378 180-355 202 3 4 20-6 36-22 17-16 30-25 30-21 0 5 7 3 15-4 12-10 16-9 21 4 5 14 12 12 43-13l37-29-4 34c-5 45 11 44 78-1 29-19 54-35 56-35 3 0 2 16-2 35-7 38-3 41 27 24 24-12 59-3 59 17 0 19 29 18 36-1 7-18 73-60 81-51 3 3-6 21-21 40-14 19-26 38-26 43 0 17 76 44 103 38 18-5 35-2 51 8 18 12 32 13 62 7 53-13 94-12 94 1 0 5-30 24-66 40-71 32-80 47-17 30 21-6 61-11 88-11 97 0 100 39 4 48-51 5-52 5-26 19 56 29 32 36-92 30-123-7-145-1-120 29 19 23 2 29-46 16-98-26-207-8-398 64-69 26-128 67-116 79 13 13 105 8 145-8 48-19 200-25 197-8-4 16 12 14 27-4s37-20 42-3c4 10 11 10 33 0 25-12 33-10 72 10 44 23 51 32 33 43-23 14-8 22 22 12 24-9 32-9 35 0 2 7 50 26 106 43 142 44 136 41 105 53-19 8-28 18-28 33 0 13-8 27-17 33-16 9-15 11 7 19 123 48 144 64 63 51-71-12-243-11-243 1 0 6 5 10 10 10 6 0 10 5 10 10 0 6-21 10-47 10-96 1-253 38-253 60 0 5 12 13 28 16 15 4 33 11 39 17 7 5 13 6 13 2s6-2 14 4c11 10 21 9 45-3 16-9 42-16 56-16h26l-28 25-28 24 38 2c20 1 42 3 47 4 6 1 16 3 23 4 6 1-4 10-23 20l-34 19 37 10c21 6 53 24 73 41 19 17 39 31 44 31s14 9 21 21c19 37-2 42-78 20-89-26-93-26-93 4 0 29-11 31-70 10-23-8-59-15-79-15-59 0-231 61-231 82 0 4 13 8 30 8 16 0 40 5 54 11 19 9 29 8 47-5 27-18 66-21 105-6 26 10 26 11 8 32-19 20-19 21 6 13 14-4 31-10 38-12 7-3 12 3 12 16 0 12 6 21 15 21 20 0 40 49 25 64-17 17-11 38 18 69l27 29-30-5c-16-2-66-14-109-26-103-27-165-27-200 0-14 11-26 27-26 36 0 12 10 14 61 8 59-7 60-6 50 13-6 11-17 22-26 26-25 9-17 26 13 26 15 0 34 4 42 10 12 8 12 10-4 16s-15 9 9 31c30 29 28 37-6 25-70-26-319-20-384 10-26 11-26 12-6 20 12 4 21 16 21 28 0 25 5 25 38 0 28-22 60-21 110 6 15 8 33 14 40 14 21 0 13 17-23 49-19 17-35 32-35 34 0 3 19 1 43-4 23-4 57-8 75-9 27 0 32 4 32 24 0 29 17 44 59 52 21 5 30 11 27 20-3 8 1 14 9 14 18 0 45 27 45 46 0 8-13 17-29 20-17 4-32 12-35 19-3 8-13 11-25 8-15-4-21-1-21 11 0 19 1 19-75 1-81-20-83-19-50 15 31 33 29 48-5 30-27-15-38-5-22 20 18 29-1 25-54-12-42-31-51-33-122-32-109 1-190 34-215 88-19 40-16 61 6 34 8-10 37-18 80-23 64-6 69-5 74 14 7 26 5 26 45 1 43-26 62-26 55 0-5 19-1 20 71 18 93-3 108 4 86 36-14 23-14 24 16 34 31 11 39 26 18 36-10 5-10 7 0 12 28 13 106 71 109 81 3 7-11 15-31 19-20 3-39 10-42 15s-22 9-42 9c-28 0-33 3-24 12 30 30-11 40-53 12-30-19-135-32-135-15 0 6 4 11 9 11 13 0 23 34 15 53-5 14-12 13-55-8-56-29-104-31-180-9-68 20-201 89-225 116-20 23-21 23 34 1 7-3 12 2 12 12 0 17 1 17 18 2 10-10 25-17 33-17s24-7 35-15c25-17 34-11 34 21v23l36-24c45-31 58-31 72-2 9 18 11 19 11 4 1-11 15-24 37-33 35-15 38-14 60 7 13 12 24 33 24 47 0 22 3 24 36 17 33-6 35-5 29 16-4 13-2 24 5 29 9 6 9 12-1 28-19 31-4 38 27 13 39-31 99-27 73 5-13 16-3 34 19 34 9 0 33 10 52 21l35 22-25 9c-14 5-42 7-62 4-41-7-43-5-28 25 15 26 2 24-50-11-49-32-75-39-67-16 3 8 1 17-6 19-9 3-9 10 1 27 22 37 8 33-55-15-45-33-70-45-95-45-90 0-268 91-268 137 0 21 37 15 66-12 33-31 54-32 54-3v21l23-20c54-49 93-52 84-5-11 56 13 67 59 27 16-14 34-25 41-25 6 0 18-3 27-6 28-11 18 22-14 49-29 25-39 47-21 47 5 0 14-7 21-16 15-17 74-44 98-44 13 0 13 2-1 18-24 26-22 30 25 43 38 10 41 12 25 24-25 18-21 25 11 19 38-8 84 12 80 33-2 13-17 20-53 25-27 4-55 14-61 22-15 21-29 20-94-8-53-23-77-25-65-5 4 5-1 12-9 15-9 3-16 15-16 26 0 15-4 18-22 13-38-12-42-11-46 13-2 12-5 22-8 22-2 0-24-15-48-34-54-41-86-50-136-36-46 12-55 23-35 40 31 25 17 40-36 40-65 0-87 12-109 63-24 56-30 125-10 112 6-3 10-23 10-43 0-42 32-102 54-102 8 0 20 16 26 36l12 36 14-28c19-35 43-53 73-54 17 0 21 4 17 15-3 8-8 21-11 28-3 6 5 18 17 26 19 12 23 12 27 0 6-20 76-89 90-89 6 0 14 12 17 28 9 35 23 43 48 27 18-11 29-10 74 5 68 22 84 38 58 54-11 6-30 21-43 34-13 12-45 27-71 33-58 13-77 27-61 45 27 33-41 48-86 18-13-8-34-14-47-12-22 3-21 4 9 21 23 12 30 22 26 37s0 20 14 20c21 0 63 26 63 39 0 5-26 13-57 17-61 9-78 29-52 60 10 13 15 13 36-1 22-15 25-14 54 15 17 16 39 30 49 30s20 7 24 15c6 17-22 35-54 35-38 0-34 28 10 70 23 22 39 44 35 50-3 5-24 10-46 10-21 0-39 2-39 5s12 23 26 45c46 70 10 91-41 24-31-40-40-42-66-11l-19 22-20-25c-11-14-25-41-31-60s-20-49-30-66c-20-34-105-104-125-104-8 0-14 25-18 73-3 39-8 91-12 114-5 34-2 45 16 63 27 27 56 23 52-8-4-27 23-30 50-5 12 11 32 16 54 14 19-1 34 2 34 8 0 20-73 81-97 81-22 0-31 14-15 23 4 3 30 1 57-3 51-8 105-3 105 10 0 4-10 12-22 19-13 6-34 18-46 25l-24 14 41 33c70 56 45 62-51 13l-48-24v26c0 26-1 27-19 10-11-10-28-37-37-60-10-23-28-50-41-59-23-18-23-18-23 16 0 51 19 96 65 157 60 79 70 99 50 106-20 8-62-20-70-46-3-11-12-20-20-20-9 0-14 21-17 70-3 54-8 75-24 91l-21 21zm-54-461c31-32 50-87 41-115-8-24-18-12-34 38-7 22-21 55-32 73-24 40-11 42 25 4zm-18-192c31-19 64-74 52-86-7-8-104 73-111 92-8 20 21 17 59-6zm335-99c0-15-62-63-107-83-23-10-45-23-48-28-12-20-26-9-23 18 3 25 7 27 49 30 37 2 48 7 52 23 3 10 12 19 21 19s16 7 16 15 9 15 20 15 20-4 20-9zm-84-207c33 9 40-12 9-24-21-8-33-6-56 7-37 22-38 36-2 22 15-5 37-8 49-5zm104-29c0-14-45-37-54-28-3 4-6 14-6 23 0 12 9 17 30 17 17 0 30-6 30-12zm158-46c-2-6-8-10-13-10s-11 4-13 10 4 11 13 11 15-5 13-11zm-308-280c0-57-11-77-24-43-8 20-8 78 0 98 12 31 24 4 24-55zm-110-119c0-5-4-10-10-10-5 0-10 5-10 10 0 6 5 10 10 10 6 0 10-4 10-10zm-56-41c-3-5-10-7-15-3-5 3-7 10-3 15 3 5 10 7 15 3 5-3 7-10 3-15zm163-11c-3-7-5-2-5 12s2 19 5 13c2-7 2-19 0-25zm-477-23c41-30 54-31 87-5 31 24 43 25 43 5 0-18 14-19 40-3 23 15 37 4 21-16-16-19-96-36-166-36-58 0-75 14-75 59 0 27 9 26 50-4zm250 15c0-5-4-10-10-10-5 0-10 5-10 10 0 6 5 10 10 10 6 0 10-4 10-10zm950-730c0-5-4-10-10-10-5 0-10 5-10 10 0 6 5 10 10 10 6 0 10-4 10-10zm-1136-161c-10-16-87-49-98-41-6 3 12 16 39 29 56 25 69 28 59 12zm1186-579c11-7 1-10-35-9-37 0-45 3-30 9 27 12 47 12 65 0zm277-77c-4-3-10-3-14 0-3 4 0 7 7 7s10-3 7-7zm23-343c8-5 12-11 9-14s-14 1-25 9c-21 16-8 20 16 5zm-2340-550c0-5-7-10-16-10-8 0-12 5-9 10 3 6 10 10 16 10 5 0 9-4 9-10zm240-140c12-16 25-30 29-30 3 0 15 14 25 31 16 27 20 29 34 16 10-8 22-12 29-10 6 2 14-5 18-16 7-22 31-28 37-10 2 6 17 9 33 7l30-3-35-17c-45-21-256-25-276-6-7 7 36 68 47 68 4 0 17-13 29-30zm290 10c0-5-10-10-22-10-19 0-20 2-8 10 19 13 30 13 30 0zm-140-570c0-5-4-10-10-10-5 0-10 5-10 10 0 6 5 10 10 10 6 0 10-4 10-10z"
                transform="matrix(.1 0 0 -.1 0 532)"
              />
            </svg>
          </YStack>
        </XStack>
      </YStack>
      <AlertDialog modal open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialog.Portal zi={9999999999}>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            width={400}
            borderWidth={1}
            borderColor="$borderColor"
            elevate
            key="content"
            animation={[
              'quickest',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap="$3">
              <AlertDialog.Title size="$7">Delete Theme</AlertDialog.Title>
              <AlertDialog.Description>
                This will delete the theme. This action is irreversible.
              </AlertDialog.Description>

              <XStack mt="$4" gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button theme="red_active" onPress={() => handleDeleteTheme()}>
                    Delete
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      <Dialog modal open={renameDialog} onOpenChange={setRenameDialog}>
        <Adapt when="sm" platform="touch">
          <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4" gap="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              animation={[
                'quickest',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              opacity={1}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Dialog.Portal zi={9999999999}>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            width={400}
            borderWidth={1}
            borderColor="$borderColor"
            elevate
            key="content"
            animation={[
              'quickest',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <Form onSubmit={handleRenameThemeName} gap="$4">
              <Dialog.Title>Rename</Dialog.Title>
              <Dialog.Description>
                Name doesn't change the output code. It's just a way for you to
                distinguish between the themes.
              </Dialog.Description>
              <Fieldset gap="$4" horizontal>
                <Label width={160} justifyContent="flex-end" htmlFor={`edit_name_${id}`}>
                  Name
                </Label>
                <Input
                  autoFocus
                  autoComplete="off"
                  flex={1}
                  id={`edit_name_${id}`}
                  value={name}
                  onChange={(event) => setName((event.target as any).value)}
                />
              </Fieldset>

              <XStack alignSelf="flex-end" gap="$4">
                <Form.Trigger asChild>
                  <Button themeInverse aria-label="Close">
                    Save changes
                  </Button>
                </Form.Trigger>
              </XStack>

              <Unspaced>
                <Dialog.Close asChild>
                  <Button
                    position="absolute"
                    top="$-2"
                    right="$-2"
                    size="$2"
                    circular
                    icon={X}
                  />
                </Dialog.Close>
              </Unspaced>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}

function CreateDialog(
  props: DialogProps & {
    onCreate?: () => void
  }
) {
  const [name, setName] = useState('')
  const disabled = !name

  const addNewThemeSuite = (name = 'Untitled') => {
    if (disabled) return
    themeBuilderStore.addThemeSuite({
      ...defaultThemeSuiteItem,
      name,
    })
    props.onCreate?.()
  }

  return (
    <Dialog modal {...props}>
      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          borderRadius="$4"
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          p="$5"
          miw={320}
          maw={400}
        >
          <Form
            gap="$3"
            onSubmit={() => {
              console.info(`adding`, name)
              addNewThemeSuite(name)
            }}
          >
            <Dialog.Title size="$7">New Theme Suite</Dialog.Title>
            <Dialog.Description>
              Choose a name for your suite of themes, something like <b>Tamagui Site</b>.
            </Dialog.Description>
            <Fieldset gap="$4" horizontal>
              <Label pl="$4" justifyContent="flex-end" htmlFor="name">
                Name
              </Label>
              <Input
                autoFocus
                autoComplete="off"
                flex={1}
                id="name"
                value={name}
                onChangeText={(newVal) => setName(newVal)}
                placeholder=""
              />
            </Fieldset>

            <XStack alignSelf="flex-end" gap="$4">
              <Form.Trigger>
                <Button
                  themeInverse={!disabled}
                  disabled={disabled}
                  opacity={disabled ? 0.5 : 1}
                  aria-label="Continue"
                >
                  Continue
                </Button>
              </Form.Trigger>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$-3"
                  right="$-3"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
