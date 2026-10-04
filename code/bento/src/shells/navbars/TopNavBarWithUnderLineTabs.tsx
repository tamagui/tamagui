import { Avatar, Tabs } from '../../BentoSkins'
import { Bell, Menu } from '../../icons'
import type { TabLayout, TabsTabProps, ViewProps } from 'tamagui'

import type React from 'react'
import { useState } from 'react'
import {
  createStyledHOC,
  Anchor,
  AnimatePresence,
  Button,
  Image,
  Popover,
  PopoverTrigger,
  Separator,
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
    <View flexDirection="column" height={610} width="100%" position="relative">
      <View
        flexDirection="row"
        p="2"
        width="100%"
        items="center"
        justify="space-between"
        bg="background"
        gap="3"
        theme="accent"
        render="nav"
      >
        {sm ? (
          <SideBar />
        ) : (
          <View flexDirection="row" p="2" items="center" bg="#FFFF00" rounded={1000_000}>
            <Image
              objectFit="contain"
              width="25px @sm/window:15px"
              height="25px @sm/window:15px"
              src="/tamagui-icon.svg"
              alt="Bento logo"
            />
          </View>
        )}
        {!sm && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} orientation="horizontal">
            <View position="relative" flexDirection="column">
              <AnimatePresence>
                {intentAt && (
                  <TabsRovingIndicator
                    width={intentAt.width}
                    height="1"
                    x={intentAt.x}
                    b={0}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeAt && (
                  <TabsRovingIndicator
                    active
                    width={activeAt.width}
                    height="1"
                    x={activeAt.x}
                    b={0}
                  />
                )}
              </AnimatePresence>
              <Tabs.List
                loop={false}
                aria-label="Manage your account"
                gap="3"
                backgroundColor="transparent"
              >
                {links.map((link, index) => (
                  <Tabs.Tab
                    key={`Tabs-${index}`}
                    variant="plain"
                    value={link.slug}
                    onInteraction={handleOnInteraction}
                    paddingHorizontal="4"
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
        <View flexDirection="row" items="center" gap="3">
          <Button circular variant="quiet" p={0} size="sm">
            <Button.Icon>
              <Bell size="1" />
            </Button.Icon>
          </Button>
          <ProfileDropdown
            triggerOpen={triggerOpen}
            setTriggerOpen={setTriggerOpen}
            closeTrigger={closeTrigger}
          />
        </View>
      </View>
      <View flexDirection="row" bg="background" height="100%" />
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
        <Button circular variant="quiet">
          <Avatar circular size="3">
            <Avatar.Image
              pointerEvents="none"
              aria-label="user photo"
              src="https://i.pravatar.cc/123"
            />
            <Avatar.Fallback bg="color-9" />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <Popover.Content
        borderWidth={1}
        borderColor="border-color"
        bg="color-1"
        p={0}
        y="enter:-10px exit:-10px"
        opacity="enter:0 exit:0"
        transition={['quick', { opacity: { overshootClamping: true } }]}
        overflow="hidden"
        boxShadow="0 10px 20px shadow-color"
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
  bg: 'background hover:background-hover press:background-press',
  width: '100%',
  cursor: 'pointer',
  px: '4 @xs/window:2',
  py: '2 @xs/window:1',
  items: 'center',
  justify: 'center',
})

const DropDownText = styled(Text, {
  fontWeight: '2 @xs/window:1',
  lineHeight: '2 @xs/window:1',
  fontSize: '2 @xs/window:1',
})

const NavLink = createStyledHOC(
  View,
  (
    {
      children,
      href = '#',
      ...rest
    }: React.ComponentProps<typeof View> & {
      href?: string
    },
    ref
  ) => {
    return (
      <View ref={ref} rounded={5} py="2" items="center" justify="center" {...rest}>
        <Link href={href}>
          <Text
            opacity="0.9 hover:1"
            fontSize="5"
            fontWeight="5"
            lineHeight="5"
            color="color-11"
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
      position="relative"
      flexDirection="row"
      {...(isWeb && {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
        },
      })}
    >
      <Button circular variant="quiet" onPress={toggle}>
        <Button.Icon>
          <Menu size="1" />
        </Button.Icon>
      </Button>
      <SideBarContent open={open} onOpenChange={() => setOpen(false)} />
    </View>
  )
}

function SideBarContent({
  onOpenChange,
  open,
}: {
  onOpenChange: () => void
  open: boolean
}) {
  const { activeAt, currentTab, handleOnInteraction, intentAt, setCurrentTab } = useTabs()
  const { height, width } = useContainerDim('window')

  /**
   * Note: we also have <Drawer.Portal/> that renders the drawer content in the root
   *  <Drawer>
   *    <Drawer.Portal>
   *  */

  return (
    <View flexDirection="column" position="absolute" mx={-12} my="-2">
      <Drawer open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay
            height={height}
            width={width + 100}
            transition="lazy"
            opacity="enter:0 exit:0"
            z={1000000}
          />
          <Drawer.Swipeable>
            <Drawer.Content
              py="2"
              height={height}
              width={240}
              items="flex-start"
              justify="flex-start"
              bg="background"
              x="-30px enter:-240px exit:-260px"
              pl={30}
              gap="4"
            >
              <View
                flexDirection="row"
                p="2"
                items="center"
                bg="#FFFF00"
                rounded={1000_000}
                ml="4"
                mt="2"
              >
                <Image
                  objectFit="contain"
                  width="30px @sm/window:15px"
                  height="30px @sm/window:15px"
                  src="/tamagui-icon.svg"
                  alt="Bento logo"
                />
              </View>
              <Separator width="100%" />
              <View flexDirection="column" width="100%" gap="2" render="ul">
                <Tabs
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  orientation="vertical"
                >
                  <View position="relative" flexDirection="column" width="100%">
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
                          theme="accent"
                          width={activeAt.width}
                          height={activeAt.height}
                          x={activeAt.x}
                          y={activeAt.y}
                        />
                      )}
                    </AnimatePresence>
                    <Tabs.List
                      loop={false}
                      aria-label="Manage your account"
                      gap="1"
                      width="100%"
                      backgroundColor="transparent"
                    >
                      {links.map((link, index) => (
                        <Tabs.Tab
                          key={`Tabs-${index}`}
                          variant="plain"
                          width="100%"
                          value={link.slug}
                          onInteraction={handleOnInteraction}
                          alignItems="flex-start"
                          justifyContent="flex-start"
                        >
                          <NavLink
                            key={index}
                            href={`/bento/shells/navbars/#`}
                            px="5"
                            mr="auto"
                            justify="flex-start"
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

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & ViewProps) => {
  return (
    <View
      flexDirection="column"
      position="absolute"
      backgroundColor="color-7"
      opacity="0.7 enter:0 exit:0"
      transition="100ms"
      {...(active && {
        backgroundColor: 'color-7',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
