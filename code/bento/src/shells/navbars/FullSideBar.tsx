import { Bell, Menu } from '../../icons'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { useState } from 'react'
import {
  createStyledHOC,
  Anchor,
  Button,
  H4,
  Popover,
  PopoverTrigger,
  Text,
  View,
  isWeb,
  styled,
  useEvent,
  Avatar,
} from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Drawer } from '../common/Drawer'

const Link = styled(Anchor, {
  textTransform: 'none',
  display: 'flex',
  textDecorationLine: 'none',
  items: 'center',
  py: '3 @max-sm/window:2-5',
  bg: 'hover:background-hover press:background-press focus:background-press',
})

/** ------ EXAMPLE ------ */
export function FullSideBar() {
  const [triggerOpen, setTriggerOpen] = useState(false)
  const closeTrigger = useEvent(() => {
    setTriggerOpen(false)
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const { 'max-md': compact } = useGroupMedia('window')
  return (
    <View position="relative" flexDirection="column" height={610} width="100%" mt="2">
      <View flexDirection="row" height="100%" width="100%">
        {!compact && <Sidebar />}
        <View
          flexDirection="row"
          px="12px @max-md/window:8px"
          py="2"
          items="center"
          bg="background"
          boxShadow="0 1px 1px color-5"
          flex={1}
          height="5"
          render="nav"
          elevationAndroid={1}
        >
          {compact && (
            <View
              flexDirection="row"
              {...(isWeb && {
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Escape') {
                    setOpenDrawer(false)
                  }
                },
              })}
            >
              <Button circular variant="quiet" onPress={() => setOpenDrawer(!openDrawer)}>
                <Button.Icon>
                  <Menu size="1" />
                </Button.Icon>
              </Button>
            </View>
          )}
          <View flexDirection="row" ml="auto" items="center" gap="2">
            <Button theme="accent" circular variant="quiet" p={0} size="sm">
              <Button.Icon>
                <Bell color="color" size="1" />
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
      {compact && <FloatingSideBar open={openDrawer} setOpen={setOpenDrawer} />}
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
        py="1"
        px="4"
        y="enter:-10px exit:-10px"
        opacity="enter:0 exit:0"
        transition="quick"
        overflow="hidden"
        boxShadow="0 10px 20px shadow-color"
      >
        <DropDownItem bg="hover:background-focus" onPress={closeTrigger}>
          <DropDownText>Accounts</DropDownText>
        </DropDownItem>
        <DropDownItem bg="hover:background-focus" onPress={closeTrigger}>
          <DropDownText>Settings</DropDownText>
        </DropDownItem>
        <DropDownItem bg="hover:background-focus" onPress={closeTrigger}>
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
  px: '4 @max-sm/window:2',
  py: '2 @max-sm/window:1',
  items: 'flex-start',
  justify: 'center',
})

const DropDownText = styled(Text, {
  fontWeight: '2 @max-sm/window:1',
  lineHeight: '2 @max-sm/window:1',
  fontSize: '2 @max-sm/window:1',
})

/** SIDEBAR AND DRAWER */
function Sidebar() {
  return (
    <View
      flexDirection="column"
      height="100%"
      width={300}
      borderRightWidth={1}
      borderRightColor="color-5"
    >
      <SideBarContent />
    </View>
  )
}

function FloatingSideBar({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { height, width } = useContainerDim('window')
  return (
    <View
      flexDirection="column"
      {...(isWeb && {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
        },
      })}
      mx={-12}
      my="-2"
      position="absolute"
    >
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Overlay
          height={height + 12}
          width={width + 12}
          transition="lazy"
          opacity="enter:0 exit:0"
          z={1000000}
        />
        <Drawer.Swipeable>
          <Drawer.Content
            x="-30px enter:-240px exit:-260px"
            pl={30}
            width={220}
            height={height + 20}
          >
            <SideBarContent />
          </Drawer.Content>
        </Drawer.Swipeable>
      </Drawer>
    </View>
  )
}

const SideBarContent = createStyledHOC(View, (props, ref) => {
  const [selected, setSelected] = useState('Sign In')
  return (
    <View
      flexDirection="column"
      bg="background"
      height="100%"
      width="100%"
      {...props}
      ref={ref}
    >
      <View
        flexDirection="column"
        pl="4"
        py="1 @max-md/window:4"
        justify="center"
        width="100%"
      >
        <View flexDirection="row" items="center" gap="2-5">
          <Avatar circular size="4">
            <Avatar.Image
              aria-label="User avatar"
              src="https://i.pravatar.cc/150?img=32"
            />
            <Avatar.Fallback bg="color-6" />
          </Avatar>
          <H4 fontSize="6" color="color-11">
            Hi User!
          </H4>
        </View>
      </View>
      <View flexDirection="column" grow={1} bg="background">
        <View p="2-5" pl="5" pt="4">
          <Text
            fontSize="2"
            lineHeight="2"
            fontWeight="700"
            color="color-9"
            letterSpacing={1}
            textTransform="uppercase"
          >
            Auth
          </Text>
        </View>
        <View flexDirection="column">
          <RovingFocusGroup>
            {['Sign In', 'Sign Up', 'Forgot Password', 'Reset Password'].map(
              (item, index) => (
                <RovingFocusGroup.Item key={index} tabIndex={0}>
                  <NavLink
                    pl="5"
                    href="#"
                    active={selected === item}
                    onPress={() => setSelected(item)}
                  >
                    {item}
                  </NavLink>
                </RovingFocusGroup.Item>
              )
            )}
          </RovingFocusGroup>
        </View>
        <View p="2-5" pl="5" pt="4">
          <Text
            fontSize="2"
            lineHeight="2"
            fontWeight="700"
            color="color-9"
            letterSpacing={1}
            textTransform="uppercase"
          >
            User
          </Text>
        </View>
        <View flexDirection="column">
          <RovingFocusGroup loop>
            {['Profile', 'Settings', 'Feed'].map((item, index) => (
              <RovingFocusGroup.Item key={index} tabIndex={0}>
                <NavLink select="none" pl="5" href="#">
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

const NavLink = createStyledHOC(
  Link,
  (
    {
      active = false,
      children,
      href = '#',
      onPress,
      ...rest
    }: React.ComponentProps<typeof Link> & { active?: boolean },
    ref
  ) => {
    /**
     * in a real app derive this from the router:
     * const active = href === router.pathname
     */
    return (
      <Link
        ref={ref}
        onPress={(event) => {
          // Prevent page from jumping to the top on Safari when clicking a link with href="#"
          if (href === '#') event.preventDefault()
          onPress?.(event)
        }}
        href={href}
        bg={active ? 'color-3' : undefined}
        borderLeftWidth={active ? 3 : 0}
        borderLeftColor={`${active ? 'color-8' : 'transparent'}`}
        rounded={5}
        group="navLink"
        {...rest}
      >
        <Text
          fontSize="5 @max-sm/window:3"
          fontWeight="5 @max-sm/window:3"
          lineHeight="5 @max-sm/window:3"
          color="color-10"
          opacity="0.7 group-hover/navLink:1 group-focus/navLink:1"
        >
          {children}
        </Text>
      </Link>
    )
  }
)
