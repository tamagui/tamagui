import {
  type ComponentSize,
  createStyledContext,
  createStyledHOC,
  resolveSizing,
  styled,
  Text,
  withStaticProperties,
} from '@tamagui/core'
import { wrapChildrenInText } from '@tamagui/text'
import { Tabs as TabsBehavior } from '@tamagui/tabs'

export type TabsSize = ComponentSize | boolean

const TabsContext = createStyledContext<{ size?: TabsSize }>({ size: 'md' })

const getTabsTabSize = styled.dynamic<TabsSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return {
    paddingInline: sizing.paddingInline,
    paddingBlock: sizing.paddingBlock,
    gap: sizing.gap,
    borderRadius: sizing.radius,
  }
})

const getTabsTextSize = styled.dynamic<TabsSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return {
    fontSize: sizing.fontSize,
    lineHeight: sizing.lineHeight,
  }
})

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
        zIndex: 'focus-visible:1',
      },
    },

    size: getTabsTabSize,

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
    size: getTabsTextSize,
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
