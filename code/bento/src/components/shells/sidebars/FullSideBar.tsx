import { Bell, Menu } from '@tamagui/lucide-icons'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { useState } from 'react'
import {
  Avatar,
  Button,
  H4,
  Popover,
  PopoverTrigger,
  Text,
  View,
  isWeb,
  styled,
  useEvent,
} from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Drawer } from '../common/Drawer'

const Link = styled(Text, {
  tag: 'a',
  textTransform: 'none',
  display: 'flex',
  textDecorationLine: 'none',
  alignItems: 'center',
  paddingVertical: '$3',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  focusStyle: {
    backgroundColor: '$backgroundPress',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$backgroundPress',
      },
    },
  },
  '$group-window-xs': {
    paddingVertical: '$2.5',
  },
})

/** ------ EXAMPLE ------ */
export function FullSideBar() {
  const [triggerOpen, setTriggerOpen] = useState(false)
  const closeTrigger = useEvent(() => {
    setTriggerOpen(false)
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const { sm } = useGroupMedia('window')
  return (
    <View flexDirection="column" height={610} width="100%" marginTop="$2">
      <View flexDirection="row" height="100%" width="100%">
        {!sm && <Sidebar />}
        <View
          flexDirection="row"
          paddingHorizontal={12}
          paddingVertical="$2"
          tag="nav"
          alignItems="center"
          backgroundColor="$background"
          shadowColor="$color5"
          shadowOffset={{
            width: 0,
            height: 1,
          }}
          shadowOpacity={0.18}
          shadowRadius={1.0}
          elevationAndroid={1}
          $group-window-sm={{ paddingHorizontal: 8 }}
          flex={1}
          height={'$5'}
        >
          {sm && (
            <View
              flexDirection="row"
              {...(isWeb && {
                onKeyDown: (e: KeyboardEvent) => {
                  if (e.key === 'Escape') {
                    setOpenDrawer(false)
                  }
                },
              })}
            >
              <Button circular chromeless onPress={() => setOpenDrawer(!openDrawer)}>
                <Button.Icon>
                  <Menu size="$1" />
                </Button.Icon>
              </Button>
            </View>
          )}
          <View flexDirection="row" marginLeft="auto" alignItems="center" gap="$2">
            <Button theme="alt1" circular chromeless padding={0} size="$3">
              <Button.Icon>
                <Bell color="$color" size="$1" />
              </Button.Icon>
            </Button>
            <ProfileDropdown
              triggerOpen={triggerOpen}
              setTriggerOpen={setTriggerOpen}
              closeTrigger={closeTrigger}
            />
          </View>
        </View>
      </View>
      {sm && <FloatingSideBar open={openDrawer} setOpen={setOpenDrawer} />}
    </View>
  )
}

FullSideBar.fileName = 'FullSideBar'

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
        paddingVertical="$1.5"
        paddingHorizontal="$3.5"
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
        <DropDownItem
          hoverStyle={{
            backgroundColor: '$backgroundFocus',
          }}
          onPress={closeTrigger}
        >
          <DropDownText>Accounts</DropDownText>
        </DropDownItem>
        <DropDownItem
          hoverStyle={{
            backgroundColor: '$backgroundFocus',
          }}
          onPress={closeTrigger}
        >
          <DropDownText>Settings</DropDownText>
        </DropDownItem>
        <DropDownItem
          hoverStyle={{
            backgroundColor: '$backgroundFocus',
          }}
          onPress={closeTrigger}
        >
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
  alignItems: 'flex-start',
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

/** SIDEBAR AND DRAWER */
function Sidebar() {
  return (
    <View
      flexDirection="column"
      height="100%"
      width={300}
      borderRightWidth={1}
      borderRightColor="$color5"
      shadowColor="$shadowColor"
    >
      <SideBarContent />
    </View>
  )
}

function FloatingSideBar({
  open,
  setOpen,
}: { open: boolean; setOpen: (open: boolean) => void }) {
  const { height, width } = useContainerDim('window')
  return (
    <View
      flexDirection="column"
      {...(isWeb && {
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
        },
      })}
      marginHorizontal={-12}
      marginVertical="$-2"
      position="absolute"
    >
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Overlay
          height={height + 12}
          width={width + 12}
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          zIndex={1000000}
        />
        <Drawer.Swipeable>
          <Drawer.Content
            x={-30}
            paddingLeft={30}
            width={220}
            height={height + 20}
            enterStyle={{ x: -240 }}
            exitStyle={{ x: -260 }}
          >
            <SideBarContent />
          </Drawer.Content>
        </Drawer.Swipeable>
      </Drawer>
    </View>
  )
}

const SideBarContent = View.styleable((props, ref) => {
  return (
    <View
      flexDirection="column"
      backgroundColor="$background"
      ref={ref}
      height="100%"
      width="100%"
      {...props}
    >
      <View
        flexDirection="column"
        paddingLeft="$4"
        paddingVertical="$1.5"
        justifyContent="center"
        width="100%"
        $group-window-sm={{
          paddingVertical: '$4',
        }}
      >
        <View flexDirection="row" alignItems="center" gap="$2.5">
          <Avatar borderRadius="$true" size="$4" padding="$4">
            <Avatar.Image scale={0.6} src="/favicon.svg" />
            <Avatar.Fallback backgroundColor="$color11" borderColor="$color11" />
          </Avatar>
          <H4 fontSize="$6" col="$color12">
            Hi User!
          </H4>
        </View>
      </View>
      <View flexDirection="column" flexGrow={1} backgroundColor="$background">
        <View
          backgroundColor="$backgroundFocus"
          padding="$2.5"
          paddingLeft="$5"
          $group-window-gtXs={{
            paddingLeft: '$5',
          }}
        >
          <Text fontSize="$5" lineHeight="$5" fontWeight="400" col="$color12">
            Auth
          </Text>
        </View>
        <View flexDirection="column">
          <RovingFocusGroup>
            {['Sign In', 'Sign Up', 'Forgot Password', 'Reset Password'].map(
              (item, index) => (
                <RovingFocusGroup.Item key={index} focusable>
                  <NavLink paddingLeft="$5" href="#">
                    {item}
                  </NavLink>
                </RovingFocusGroup.Item>
              )
            )}
          </RovingFocusGroup>
        </View>
        <View backgroundColor="$backgroundFocus" padding="$2.5" paddingLeft="$5">
          <Text fontSize="$5" lineHeight="$5" fontWeight="400" col="$color12">
            User
          </Text>
        </View>
        <View flexDirection="column">
          <RovingFocusGroup loop>
            {['Profile', 'Settings', 'Feed'].map((item, index) => (
              <RovingFocusGroup.Item key={index} focusable>
                <NavLink userSelect="none" paddingLeft="$5" href="#">
                  {item}
                </NavLink>
              </RovingFocusGroup.Item>
            ))}
          </RovingFocusGroup>
        </View>
      </View>
    </View>
  )
})

const NavLink = Link.styleable(({ children, href = '#', onPress, ...rest }, ref: any) => {
  /**
   * use the following logic in to check if the route is active
   * const router = useRouter();
   * const currentPath = router.pathname;
   * const isActive = href === currentPath;
   */
  const isActive = false

  return (
    <Link
      ref={ref}
      onPress={onPress}
      href={href}
      active={isActive}
      borderRadius={5}
      /** uncomment this line in your app */
      // active={isActive}
      //@ts-ignore
      group="navLink"
      draggable={false}
      {...rest}
    >
      <Text
        fontSize="$5"
        fontWeight="$5"
        lineHeight="$5"
        color="$color11"
        opacity={0.7}
        // opacity={isActive ? 1 : 0.9}
        $group-navLink-hover={{
          opacity: 1,
        }}
        $group-navLink-focus={{
          opacity: 1,
        }}
        $group-window-xs={{
          fontSize: '$3',
          fontWeight: '$3',
          lineHeight: '$3',
        }}
      >
        {children}
      </Text>
    </Link>
  )
})
