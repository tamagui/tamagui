import {
  createStyledHOC,
  resolveSize,
  SizeContext,
  Text,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { wrapChildrenInText } from '@tamagui/text'
import { Tabs as TabsBehavior } from '@tamagui/tabs'

const tabSizeVariant = styled.dynamic<any>((size, env) => {
  return resolveSize(size, env).frame
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

const TabsTabFrame = TabsTabBase.resolve((props, env) => {
  if (props.unstyled) return
  return tabSizeVariant(props.size ?? true, env)
})

const TabsTabText = styled(Text, {
  context: SizeContext,
  fontFamily: 'body',
  color: 'color',
  variants: {
    size: styled.dynamic<any>((size, env) => resolveSize(size, env).text),
  },
  defaultVariants: {
    size: true,
  },
})

export const TabsTab = createStyledHOC(TabsTabFrame, function TabsTab(props, ref) {
  const { children, ...frameProps } = props
  const contextSize = SizeContext.useStyledContext()?.size
  const size = props.size ?? contextSize ?? true
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
