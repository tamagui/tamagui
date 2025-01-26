import { Bell, Menu } from '@tamagui/lucide-icons'
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui'

import { useState } from 'react'
import {
  Anchor,
  AnimatePresence,
  Avatar,
  Button,
  Image,
  Popover,
  PopoverTrigger,
  Separator,
  Tabs,
  Text,
  View,
  isWeb,
  styled,
  useEvent,
} from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const Link = Anchor

import { useContainerDim } from '../../hooks/useContainerDim'
import { Drawer } from '../common/Drawer'

// how to use with URL params:
// import { createParam } from 'solito'
// const { useParam, useParams } = createParam()

const links = [
  {
    title: 'Products',
    slug: 'products',
  },
  {
    title: 'People',
    slug: 'people',
  },
  {
    title: 'Company',
    slug: 'company',
  },
  {
    title: 'Blog',
    slug: 'blog',
  },
  {
    title: 'Contact',
    slug: 'contact',
  },
]

const useTabs = () => {
  const [tabState, setTabState] = useState<{
    currentTab: string
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,

    currentTab: 'tab1',

    intentAt: null,

    prevActiveAt: null,
  })
  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })

  const setIntentIndicator = (intentAt: TabLayout | null) =>
    setTabState({ ...tabState, intentAt })

  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })

  const { activeAt, intentAt, currentTab } = tabState
  /**

   * -1: from left

   *  0: n/a

   *  1: from right

   */

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  // Note: the following code is very important
  // const params = useParams()
  // useEffect(() => {
  //   /**
  //    * Note: read the current tab from the url and then set it as the current tab
  //    */
  //   setCurrentTab(params.tab)
  // }, [params])

  return {
    currentTab,
    setCurrentTab,
    activeAt,
    intentAt,
    handleOnInteraction,
  }
}

/** ------ EXAMPLE ------ */
export function TopNavBarWithUnderLineTabs() {
  const { currentTab, setCurrentTab, activeAt, intentAt, handleOnInteraction } = useTabs()
  const [triggerOpen, setTriggerOpen] = useState(false)
  const closeTrigger = useEvent(() => {
    setTriggerOpen(false)
  })
  const { sm } = useGroupMedia('window')
  return (
    <View flexDirection="column" height={610} width="100%">
      <View
        flexDirection="row"
        themeInverse
        padding="$2"
        width="100%"
        tag="nav"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="$background"
        gap="$3"
      >
        {sm ? (
          <SideBar />
        ) : (
          <View
            flexDirection="row"
            padding="$2"
            alignItems="center"
            backgroundColor="#fff"
            borderRadius={1000_000}
          >
            <Image
              resizeMode="contain"
              width={25}
              height={25}
              $group-window-sm={{ width: 15, height: 15 }}
              source={{ uri: '/bento/tamagui-icon.png' }}
              alt="Bento logo"
            />
          </View>
        )}
        {!sm && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} orientation="horizontal">
            <View flexDirection="column">
              <AnimatePresence>
                {intentAt && (
                  <TabsRovingIndicator
                    width={intentAt.width}
                    height="$0.5"
                    x={intentAt.x}
                    bottom={0}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeAt && (
                  <TabsRovingIndicator
                    theme="active"
                    active
                    width={activeAt.width}
                    height="$0.5"
                    x={activeAt.x}
                    bottom={0}
                  />
                )}
              </AnimatePresence>
              <Tabs.List
                disablePassBorderRadius
                loop={false}
                aria-label="Manage your account"
                gap="$3"
                backgroundColor="transparent"
              >
                {links.map((link, index) => (
                  <Tabs.Tab
                    unstyled
                    value={link.slug}
                    onInteraction={handleOnInteraction}
                    paddingHorizontal="$4"
                  >
                    <NavLink
                      key={index}
                      // Note: replace href with /bento/shells/navbars/${link.slug}
                      href={`/bento/shells/navbars/#`}
                    >
                      {link.title}
                    </NavLink>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </View>
          </Tabs>
        )}
        <View flexDirection="row" alignItems="center" gap="$3">
          <Button theme="alt1" circular chromeless padding={0} size="$3">
            <Button.Icon>
              <Bell size="$1" />
            </Button.Icon>
          </Button>
          <ProfileDropdown
            triggerOpen={triggerOpen}
            setTriggerOpen={setTriggerOpen}
            closeTrigger={closeTrigger}
          />
        </View>
      </View>
      <View flexDirection="row" backgroundColor="$background" height="100%" />
    </View>
  )
}

TopNavBarWithUnderLineTabs.fileName = 'TopNavBarWithUnderLineTabs'

function ProfileDropdown({
  triggerOpen,
  setTriggerOpen,
  closeTrigger,
}: {
  triggerOpen: boolean
  setTriggerOpen: (open: boolean) => void
  closeTrigger: () => void
}) {
  return (
    <Popover
      offset={{
        mainAxis: 5,
      }}
      placement="bottom-end"
      open={triggerOpen}
      onOpenChange={setTriggerOpen}
    >
      <PopoverTrigger asChild>
        <Button circular chromeless>
          <Avatar circular size="$3">
            <Avatar.Image
              pointerEvents="none"
              aria-label="user photo"
              src="https://i.pravatar.cc/123"
            />
            <Avatar.Fallback backgroundColor="$gray10" />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$color1"
        padding={0}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevation={5}
        overflow="hidden"
      >
        <DropDownItem onPress={closeTrigger}>
          <DropDownText>Accounts</DropDownText>
        </DropDownItem>
        <DropDownItem onPress={closeTrigger}>
          <DropDownText>Settings</DropDownText>
        </DropDownItem>
        <DropDownItem onPress={closeTrigger}>
          <DropDownText>Sign Out</DropDownText>
        </DropDownItem>
      </Popover.Content>
    </Popover>
  )
}

const DropDownItem = styled(View, {
  backgroundColor: '$background',
  width: '100%',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
  cursor: 'pointer',
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  '$group-window-xs': {
    paddingHorizontal: '$2',
    paddingVertical: '$1',
  },
})

const DropDownText = styled(Text, {
  fontWeight: '$2',
  lineHeight: '$2',
  fontSize: '$2',
  '$group-window-xs': {
    fontWeight: '$1',
    fontSize: '$1',
    lineHeight: '$1',
  },
})

const NavLink = View.styleable<{ href: string }>(
  ({ children, href = '#', ...rest }, ref) => {
    return (
      <View
        ref={ref}
        borderRadius={5}
        paddingVertical="$2"
        alignItems="center"
        justifyContent="center"
        {...rest}
      >
        <Link href={href}>
          <Text
            opacity={0.9}
            fontSize="$5"
            fontWeight="$5"
            lineHeight="$5"
            color="$color12"
            hoverStyle={{
              opacity: 1,
            }}
          >
            {children}
          </Text>
        </Link>
      </View>
    )
  }
)

/** SIDEBAR */
function SideBar() {
  const [open, setOpen] = useState(false)
  const toggle = useEvent(() => setOpen(!open))
  return (
    <View
      flexDirection="row"
      {...(isWeb && {
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
        },
      })}
    >
      <Button circular chromeless onPress={toggle}>
        <Button.Icon>
          <Menu size="$1" />
        </Button.Icon>
      </Button>
      <SideBarContent open={open} onOpenChange={() => setOpen(false)} />
    </View>
  )
}

function SideBarContent({
  onOpenChange,
  open,
}: { onOpenChange: () => void; open: boolean }) {
  const { activeAt, currentTab, handleOnInteraction, intentAt, setCurrentTab } = useTabs()
  const { height, width } = useContainerDim('window')

  /**
   * Note: we also have <Drawer.Portal/> that renders the drawer content in the root
   *  <Drawer>
   *    <Drawer.Portal>
   *  */

  return (
    <View
      flexDirection="column"
      position="absolute"
      marginHorizontal={-12}
      marginVertical="$-2"
    >
      <Drawer open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay
            height={height}
            width={width + 100}
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            zIndex={1000000}
          />
          <Drawer.Swipeable>
            <Drawer.Content
              themeInverse
              paddingVertical="$2"
              height={height}
              width={240}
              alignItems="flex-start"
              justifyContent="flex-start"
              backgroundColor="$background"
              x={-30}
              pl={30}
              gap="$4"
              enterStyle={{ x: -240 }}
              exitStyle={{ x: -260 }}
            >
              <View
                flexDirection="row"
                padding="$2"
                alignItems="center"
                backgroundColor="#fff"
                borderRadius={1000_000}
                marginLeft="$4"
                marginTop="$2"
              >
                <Image
                  resizeMode="contain"
                  width={30}
                  height={30}
                  $group-window-sm={{ width: 15, height: 15 }}
                  source={{ uri: '/bento/tamagui-icon.png' }}
                  alt="Bento logo"
                />
              </View>
              <Separator width="100%" />
              <View flexDirection="column" width="100%" tag="ul" gap="$2">
                <Tabs
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  orientation="vertical"
                >
                  <View flexDirection="column" width="100%">
                    <AnimatePresence>
                      {intentAt && (
                        <TabsRovingIndicator
                          width={intentAt.width}
                          height={intentAt.height}
                          x={intentAt.x}
                          y={intentAt.y}
                        />
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {activeAt && (
                        <TabsRovingIndicator
                          theme="active"
                          width={activeAt.width}
                          height={activeAt.height}
                          x={activeAt.x}
                          y={activeAt.y}
                        />
                      )}
                    </AnimatePresence>
                    <Tabs.List
                      disablePassBorderRadius
                      loop={false}
                      aria-label="Manage your account"
                      gap="$1"
                      width="100%"
                      backgroundColor="transparent"
                    >
                      {links.map((link, index) => (
                        <Tabs.Tab
                          unstyled
                          width="100%"
                          value={link.slug}
                          onInteraction={handleOnInteraction}
                          alignItems="flex-start"
                          justifyContent="flex-start"
                        >
                          <NavLink
                            key={index}
                            // Note: replace href with /bento/shells/navbars/${link.slug}
                            href={`/bento/shells/navbars/#`}
                            paddingHorizontal="$5"
                            marginRight="auto"
                            justifyContent="flex-start"
                          >
                            {link.title}
                          </NavLink>
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                  </View>
                </Tabs>
              </View>
            </Drawer.Content>
          </Drawer.Swipeable>
        </Drawer.Portal>
      </Drawer>
    </View>
  )
}

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
  return (
    <View
      flexDirection="column"
      position="absolute"
      backgroundColor="$color8"
      opacity={0.7}
      animation="100ms"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
