import {
  resolveTokenSize,
  styled,
  Tabs as TabsBehavior,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'

const tabSizeVariant = (size: any, extras: VariantSpreadExtras<any>) => {
  if (extras.props.unstyled) return
  const { frame } = resolveTokenSize(size, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    borderRadius: frame.radius,
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

export const TabsFrame = styled(TabsBehavior, {
  name: 'Tabs',
})

export const TabsList = styled(TabsBehavior.List, {
  name: 'TabsList',
})

export const TabsTab = styled(TabsBehavior.Tab, {
  name: 'TabsTrigger',
  variants: {
    unstyled: {
      false: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background hover:background-hover press:background-press',
        borderWidth: 0,
        cursor: 'pointer',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        userSelect: 'none',
        outlineColor: 'focus-visible:outline-color',
        outlineStyle: 'focus-visible:solid',
        outlineWidth: 'focus-visible:2px',
        zIndex: 'focus-visible:10',
      },
    },

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
  } as const,
  defaultVariants: {
    unstyled: false,
  },
})

export const TabsContent = styled(TabsBehavior.Content, {
  name: 'TabsContent',
})

export const Tabs = withStaticProperties(TabsFrame, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})
