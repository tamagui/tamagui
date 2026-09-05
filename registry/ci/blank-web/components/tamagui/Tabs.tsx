import {
  resolveSize,
  styled,
  Tabs as TabsBehavior,
  withStaticProperties,
} from '@tamagui/ui'

const tabSizeVariant = styled.dynamic<any>((size, env) => {
  const { frame, text } = resolveSize(size, env)
  // the tab label is a bare string child, so the frame carries its font
  return { ...frame, ...text }
})

export const TabsFrame = styled(TabsBehavior, {
  displayName: 'Tabs',
})

export const TabsList = styled(TabsBehavior.List, {
  displayName: 'TabsList',
})

const TabsTabBase = styled(TabsBehavior.Tab, {
  displayName: 'TabsTrigger',
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

    size: styled.dynamic<any>(),

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

export const TabsTab = TabsTabBase.resolve((props, env) => {
  if (props.unstyled) return
  return tabSizeVariant(props.size ?? true, env)
})

export const TabsContent = styled(TabsBehavior.Content, {
  displayName: 'TabsContent',
})

export const Tabs = withStaticProperties(TabsFrame, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})
