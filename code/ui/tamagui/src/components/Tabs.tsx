import {
  type ComponentSize,
  createStyledContext,
  createStyledHOC,
  Text,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { wrapChildrenInText } from '@tamagui/text'
import { Tabs as TabsBehavior } from '@tamagui/tabs'

export type TabsSize = ComponentSize | boolean

const TabsContext = createStyledContext<{ size?: TabsSize }>({ size: 'md' })

const tabsTabSize = {
  xs: { paddingInline: '2', paddingBlock: '1', gap: '1', borderRadius: 'sm' },
  sm: { paddingInline: '3', paddingBlock: '1.5', gap: '1.5', borderRadius: 'md' },
  md: { paddingInline: '4', paddingBlock: '2', gap: '2', borderRadius: 'md' },
  lg: { paddingInline: '6', paddingBlock: '2', gap: '2', borderRadius: 'md' },
  xl: { paddingInline: '8', paddingBlock: '2.5', gap: '2.5', borderRadius: 'lg' },
} as const

const tabsTextSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'base', lineHeight: 'base' },
  xl: { fontSize: 'lg', lineHeight: 'lg' },
} as const

export const TabsFrame = styled(TabsBehavior, {
  displayName: 'Tabs',
  context: TabsContext,
})

export const TabsList = styled(TabsBehavior.List, {
  displayName: 'TabsList',
})

const TabsTabFrame = styled(TabsBehavior.Tab, {
  displayName: 'TabsTrigger',
  context: TabsContext,
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
      ...tabsTabSize,
      true: tabsTabSize.md,
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
    size: 'md',
  },
})

const TabsTabText = styled(Text, {
  context: TabsContext,
  fontFamily: 'body',
  color: 'color',
  variants: {
    size: {
      ...tabsTextSize,
      true: tabsTextSize.md,
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const TabsTab = createStyledHOC(TabsTabFrame, function TabsTab(props, ref) {
  const { children, ...frameProps } = props
  const contextSize = TabsContext.useStyledContext()?.size
  const size = props.size ?? contextSize ?? 'md'
  return (
    <TabsTabFrame {...frameProps} ref={ref}>
      {wrapChildrenInText(TabsTabText, { children, size })}
    </TabsTabFrame>
  )
})

export const TabsContent = styled(TabsBehavior.Content, {
  displayName: 'TabsContent',
})

export const Tabs = withStaticProperties(TabsFrame, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})
