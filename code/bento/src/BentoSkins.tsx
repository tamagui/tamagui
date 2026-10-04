import {
  Avatar as AvatarBehavior,
  Group as GroupBehavior,
  Tabs as TabsBehavior,
  XGroup as XGroupBehavior,
  resolveTokenSize,
  styled,
  withStaticProperties,
  type VariantSpreadExtras,
} from 'tamagui'

const AvatarImage = AvatarBehavior.Image
const AvatarFallback = AvatarBehavior.Fallback

const AvatarFrame = styled(AvatarBehavior, {
  name: 'BentoAvatar',
  borderWidth: 1,
  borderColor: 'color-1',
})

export const Avatar = withStaticProperties(AvatarFrame, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
})

const tabSizeVariant = (value: any, extras: VariantSpreadExtras<any>) => {
  const { frame } = resolveTokenSize(value, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    borderRadius: frame.radius,
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

const TabsList = styled(TabsBehavior.List, {
  name: 'BentoTabsList',
})

const TabsTab = styled(TabsBehavior.Tab, {
  name: 'BentoTabsTab',
  items: 'center',
  justify: 'center',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderWidth: 0,
  cursor: 'pointer',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  userSelect: 'none',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  z: 'focus-visible:10',
  variants: {
    size: {
      true: tabSizeVariant,
      Size: tabSizeVariant,
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
    variant: {
      plain: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        height: 'auto',
        paddingHorizontal: 0,
      },
    },
  } as const,
})

const TabsContent = styled(TabsBehavior.Content, {
  name: 'BentoTabsContent',
})

const TabsFrame = styled(TabsBehavior, {
  name: 'BentoTabs',
})

export const Tabs = withStaticProperties(TabsFrame, {
  Frame: TabsFrame,
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})

const GroupItem = GroupBehavior.Item
const XGroupItem = XGroupBehavior.Item

const GroupFrame = styled(GroupBehavior, {
  name: 'BentoGroup',
  size: true,
})

const XGroupFrame = styled(XGroupBehavior, {
  name: 'BentoXGroup',
  size: true,
})

export const Group = withStaticProperties(GroupFrame, {
  Item: GroupItem,
})

export const YGroup = Group

export const XGroup = withStaticProperties(XGroupFrame, {
  Item: XGroupItem,
})
