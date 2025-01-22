import { LogoIcon } from '@tamagui/logo'
import { Moon, Sun, X } from '@tamagui/lucide-icons'
import { memo } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  PortalHost,
  SizableText,
  Switch,
  XStack,
  YStack,
} from 'tamagui'

import { topBarHeight } from '~/features/studio/constants'
import { useRootStore } from '../state/useGlobalState'
import { BarTabs } from './Tabs'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { usePathname, useRouter } from 'one'

export const StudioBar = memo(function Header() {
  const themeBuilderStore = useThemeBuilderStore()
  const showMinimal = !themeBuilderStore.isCentered

  return (
    <XStack
      h={topBarHeight}
      zi={100_000}
      jc="space-between"
      data-tauri-drag-region
      pos={'fixed' as any}
      als="center"
      elevation="$2"
      ai="center"
      px="$5"
      br="$10"
      ov="hidden"
      gap="$3"
      {...(themeBuilderStore.isCentered
        ? {
            mx: 'auto',
            left: 0,
            right: 0,
            b: '$2.5',
          }
        : {
            right: '$2',
            top: '$2',
          })}
      maxWidth={192}
      className="all ease-in-out ms300"
    >
      <YStack br="$10" fullscreen className="blur-medium" />
      <YStack br="$10" fullscreen bg="$background" bw={1} bc="$borderColor" />

      {/* <XStack ai="center"> */}
      {/* <YStack> */}
      {/* <NextLink href={studioRootDir}> */}
      <XStack mr="$2">
        <LogoIcon downscale={2.5} />
      </XStack>
      {/* </NextLink> */}
      {/* </YStack> */}

      {/* {state.projectName ? (
          <SizableText>Project: {state.projectName}</SizableText>
        ) : null} */}
      {/* <DesignSystemSelector /> */}
      {/* </XStack> */}

      <PortalHost name="studio-header" />
      {/* <XStack
        ai="center"
        className="all ease-in-out ms300"
        // w={showMinimal ? 0 : 'auto'}
        o={showMinimal ? 0 : 1}
        ov="hidden"
      >
        <StudioTabs />

        <AccountButton />
      </XStack> */}
      {/* <ThemeSwitch /> */}
    </XStack>
  )
})

const AccountButton = () => {
  // todo
  return null
  // const { data } = useUser()
  // const user = data?.session?.user

  // return (
  //   <XStack ai="center" jc="center" space="$2">
  //     <Anchor href={`${siteRootDir}/account`}>
  //       <TooltipSimple label="Account">
  //         {data?.userDetails ? (
  //           <Avatar size="$2" circular>
  //             <Avatar.Image
  //               source={{
  //                 uri:
  //                   data.userDetails?.avatar_url ??
  //                   getDefaultAvatarImage(
  //                     data.userDetails?.full_name ?? user?.email ?? 'User'
  //                   ),
  //               }}
  //             />
  //           </Avatar>
  //         ) : (
  //           <Button fontWeight="900" icon={User} size="$2" />
  //         )}
  //       </TooltipSimple>
  //     </Anchor>
  //   </XStack>
  // )
}

export const ThemeSwitch = memo(() => {
  const rootStore = useRootStore()
  const themeBuilderStore = useThemeBuilderStore()

  const tip = themeBuilderStore.themeSwitchTip
  const tipOpen = themeBuilderStore.themeSwitchOpen && !!themeBuilderStore.themeSwitchTip
  const isLight = rootStore.theme === 'light'

  return (
    <Popover open={tipOpen} stayInFrame={{ padding: 10 }} size="$3">
      <Popover.Trigger>
        <XStack mx="$2" ai="center">
          <Switch
            checked={isLight}
            size="$2"
            y={0.5}
            onCheckedChange={(light) => {
              if (themeBuilderStore.schemes.dark && themeBuilderStore.schemes.light) {
                rootStore.theme = light ? 'light' : 'dark'
                themeBuilderStore.themeSwitchOpen = false
              }
            }}

            // rotate="-45deg"
          >
            <XStack fullscreen zi={100} x={2} y={0.5}>
              {isLight && (
                <Button
                  tag="span"
                  color="$color"
                  disabled
                  chromeless
                  // rotate="45deg"

                  size="$1"
                  scaleIcon={1}
                  o={0.44}
                  x={-1.5}
                  y={-1.5}
                  icon={Moon}
                />
              )}
            </XStack>

            <XStack pos="absolute" t={0} r={0} zi={100} x={1} y={0}>
              {!isLight && (
                <Button
                  tag="span"
                  color="$color"
                  disabled
                  chromeless
                  // rotate="45deg"

                  size="$1"
                  scaleIcon={1}
                  o={0.25}
                  x={-1.5}
                  y={-1.5}
                  icon={Sun}
                />
              )}
            </XStack>

            <Switch.Thumb animation="quickest">
              <YStack
                ai="center"
                // rotate="45deg"
              >
                {isLight && (
                  <Button
                    tag="span"
                    color="$background"
                    disabled
                    chromeless
                    size="$1"
                    scaleIcon={1.2}
                    o={0.8}
                    y={-0.75}
                    icon={Sun}
                  />
                )}
                {!isLight && (
                  <Button
                    tag="span"
                    color="$background"
                    disabled
                    chromeless
                    size="$1"
                    scaleIcon={1.2}
                    o={0.5}
                    y={-0.75}
                    icon={Moon}
                  />
                )}
              </YStack>
            </Switch.Thumb>
          </Switch>
        </XStack>
      </Popover.Trigger>

      <Popover.Content
        theme="yellow"
        trapFocus={false}
        borderWidth={2}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        // maw={400}
        animation={[
          'quickest',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow size="$5" borderWidth={2} borderColor="$borderColor" />

        <Paragraph size="$2">{tip}</Paragraph>
        <Button
          size="$1"
          circular
          pos="absolute"
          t="$-2"
          r="$-2"
          icon={X}
          onPress={() => {
            themeBuilderStore.themeSwitchOpen = false
          }}
        ></Button>
      </Popover.Content>
    </Popover>
  )
})

const StudioTabs = memo(function StudioTabs() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <BarTabs
      currentTab={pathname.split('/').pop() as string}
      onTabChange={(val) => router.push(val)}
      tabs={[
        {
          component: (
            <SizableText size="$2" fow="500">
              Theme Studio
            </SizableText>
          ),
          value: 'builder',
          hasChanges: false,
        },
        {
          component: (
            <SizableText size="$2" fow="500">
              Config
            </SizableText>
          ),
          value: 'config',
          hasChanges: false,
        },
        // {
        //   component: <SizableText size="$2" fow="500">Tokens</SizableText>,
        //   value: 'tokens',
        //   hasChanges: false,
        // },
        // {
        //   component: <SizableText size="$2" fow="500">Colors</SizableText>,
        //   value: 'colors',
        //   hasChanges: useObserve(() => colorsStore.hasChanges),
        // },
        {
          component: (
            <SizableText size="$2" fow="500">
              Themes
            </SizableText>
          ),
          value: 'themes',
          hasChanges: false,
        },
        // {
        //   component: <SizableText size="$2" fow="500">Animations</SizableText>,
        //   value: 'animations',
        //   hasChanges: useObserve(() => animationsStore.hasChanges),
        // },
      ]}
    />
  )
})

// function DesignSystemSelector() {
//   return (
//     <XStack space="$2">
//       <Select size="$2" defaultValue="blueberry">
//         <Select.Trigger w={150} iconAfter={ChevronDown}>
//           <Select.Value placeholder="Something" />
//         </Select.Trigger>

//         <Select.Content>
//           <Select.ScrollUpButton>☝️</Select.ScrollUpButton>

//           <Select.Viewport minWidth={200}>
//             <Select.Group>
//               <Select.Label>Fruits</Select.Label>
//               <Select.Item value="apple" index={0}>
//                 <Select.ItemText>Apple</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="banana" index={1}>
//                 <Select.ItemText>Banana</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="blueberry" index={2}>
//                 <Select.ItemText>Blueberry</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="berry" index={3}>
//                 <Select.ItemText>Berry</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="strawberry" index={4}>
//                 <Select.ItemText>Strawberry</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="kiwi" index={5}>
//                 <Select.ItemText>Kiwi</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="grape" index={6}>
//                 <Select.ItemText>Grape</Select.ItemText>
//               </Select.Item>
//               <Select.Item value="orange" index={7}>
//                 <Select.ItemText>Orange</Select.ItemText>
//               </Select.Item>
//             </Select.Group>
//           </Select.Viewport>

//           <Select.ScrollDownButton>👇</Select.ScrollDownButton>
//         </Select.Content>
//       </Select>

//       <TooltipSimple label="New workspace">
//         <Dialog.Trigger asChild>
//           <Button
//             size="$2"
//             icon={Plus}
//             onPress={() => {
//               rootStore.showDialog('create-workspace', {})
//             }}
//           />
//         </Dialog.Trigger>
//       </TooltipSimple>
//     </XStack>
//   )
// // }

const getDefaultAvatarImage = (name: string) => {
  const params = new URLSearchParams()
  params.append('name', name)
  return `https://ui-avatars.com/api/?${params.toString()}`
}
