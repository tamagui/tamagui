import {
  AnimatePresence,
  FontSizeTokens,
  SizableText,
  Stack,
  StackProps,
  TabLayout,
  Tabs,
  TabsProps,
  TabsTabProps,
} from '@my/ui'
import { useRouter as useNextRouter } from 'next/router'
import { useState } from 'react'
import { useRouter } from 'solito/router'

/**
 * this component is web-only
 */
export const NavTabs = (props: TabsProps) => {
  const nextRouter = useNextRouter()
  const router = useRouter()
  const currentTab = nextRouter.pathname
  const setCurrentTab = (newRoute: string) => router.push(newRoute)
  /**
   * Layout of the Tab user might intend to select (hovering / focusing)
   */
  const [intentAt, setIntentIndicator] = useState<TabLayout | null>(null)
  /**
   * Layout of the Tab user selected
   */
  const [activeAt, setActiveIndicator] = useState<TabLayout | null>(null)

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      $gtSm={{ mb: '$-0.75' }} // for the active TabsRovingIndicator to look good
      value={currentTab}
      onValueChange={setCurrentTab}
      activationMode="manual"
      {...props}
    >
      <AnimatePresence>
        {intentAt && (
          <TabsRovingIndicator
            key="intent-indicator"
            borderRadius="$4"
            width={intentAt.width}
            height={intentAt.height - 8}
            x={intentAt.x}
            y={intentAt.y + 4}
            $sm={{ display: 'none' }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeAt && (
          <TabsRovingIndicator
            zIndex={1}
            key="active-indicator"
            theme="active"
            active
            {...(props.orientation === 'vertical'
              ? {
                  y: activeAt.y,
                  right: '$-1',
                  height: activeAt.height,
                  width: 3,
                }
              : {
                  x: activeAt.x,
                  bottom: '$-1',
                  height: 3,

                  width: activeAt.width,
                })}
          />
        )}
      </AnimatePresence>
      <Tabs.List
        unstyled
        aria-label="Navigate through the pages"
        disablePassBorderRadius
        loop={false}
        w="100%"
        f={1}
        flexDirection={props.orientation === 'horizontal' ? 'row' : 'column'} // temp fix: would be fixed after https://github.com/tamagui/tamagui/pull/1313
      >
        <Tab value="/" onInteraction={handleOnInteraction}>
          Home
        </Tab>
        <Tab value="/settings" onInteraction={handleOnInteraction}>
          Settings
        </Tab>
      </Tabs.List>
    </Tabs>
  )
}

const Tab = (props: TabsTabProps) => (
  <Tabs.Tab unstyled jc="flex-end" margin="$1.5" {...props}>
    <SizableText size={props.size as FontSizeTokens}>{props.children}</SizableText>
  </Tabs.Tab>
)

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => (
  <Stack
    position="absolute"
    backgroundColor="$color5"
    animation="100ms"
    opacity={1}
    enterStyle={{
      opacity: 0,
    }}
    exitStyle={{
      opacity: 0,
    }}
    {...(active && {
      backgroundColor: '$color9',
    })}
    {...props}
  />
)
