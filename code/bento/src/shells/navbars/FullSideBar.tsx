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
import { tone } from '../../tone'

const Link = styled(Anchor, {
  textTransform: 'none',
  display: 'flex',
  textDecorationLine: 'none',
  items: 'center',
  mx: '2',
  px: '3',
  py: '2',
  rounded: '3',
  bg: `transparent ${tone.rowHover}`,
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
    <View
      position="relative"
      flexDirection="column"
      height={480}
      width="100%"
      bg="background"
    >
      <View flexDirection="row" height="100%" width="100%">
        {!compact && <Sidebar />}
        <View
          flexDirection="row"
          px="12px @max-md/window:8px"
          py="2"
          items="center"
          bg={tone.surface}
          borderBottomWidth={1}
          borderColor={tone.border}
          flex={1}
          self="flex-start"
          render="nav"
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
        borderColor={tone.border}
        bg={tone.surface}
        rounded="6"
        p="1"
        y="enter:-10px exit:-10px"
        opacity="enter:0 exit:0"
        transition="quick"
        overflow="hidden"
        boxShadow="0 8px 24px shadow-color"
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
  bg: `transparent ${tone.rowHover}`,
  rounded: '3',
  minW: 140,
  cursor: 'pointer',
  px: '4 @max-sm/window:2',
  py: '2 @max-sm/window:1',
  items: 'flex-start',
  justify: 'center',
})

const DropDownText = styled(Text, {
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'color-12',
})

/** SIDEBAR AND DRAWER */
function Sidebar() {
  return (
    <View
      flexDirection="column"
      height="100%"
      width={240}
      borderRightWidth={1}
      borderRightColor={tone.border}
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
      bg={tone.surface}
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
          <H4 fontSize="base" fontWeight="600" color="color-12">
            Hi User!
          </H4>
        </View>
      </View>
      <View flexDirection="column" grow={1}>
        <View px="5" pt="4" pb="1">
          <Text
            fontSize="xs"
            fontWeight="600"
            color={tone.muted}
            letterSpacing={0.5}
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
        <View px="5" pt="4" pb="1">
          <Text
            fontSize="xs"
            fontWeight="600"
            color={tone.muted}
            letterSpacing={0.5}
            textTransform="uppercase"
          >
            User
          </Text>
        </View>
        <View flexDirection="column">
          <RovingFocusGroup loop>
            {['Profile', 'Settings', 'Feed'].map((item, index) => (
              <RovingFocusGroup.Item key={index} tabIndex={0}>
                <NavLink select="none" href="#">
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
        {...(active && { bg: tone.fill })}
        {...rest}
      >
        <Text
          fontFamily="body"
          fontSize="sm"
          fontWeight="500"
          color={active ? 'color-12' : 'color-11'}
        >
          {children}
        </Text>
      </Link>
    )
  }
)
