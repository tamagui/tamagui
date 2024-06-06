import { useEffect, useState } from 'react'
import type { TabLayout, TabsTabProps } from 'tamagui'
import { YStack, SizableText, Tabs, Anchor } from 'tamagui'

export function PublishedDateSidebar({ mdxData, section }) {
  const [tabState, setTabState] = useState<{
    currentTab: string
    // Layout of the Tab user might intend to select (hovering / focusing)
    intentAt: TabLayout | null
    // Layout of the Tab user selected
    activeAt: TabLayout | null
  }>({
    activeAt: null,
    currentTab: `0-${mdxData[0].frontmatter.publishedAt}` as string,
    intentAt: null,
  })

  useEffect(() => {
    setTabState({ ...tabState, currentTab: section })
  }, [section])

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) => setTabState({ ...tabState, activeAt })

  const { activeAt, intentAt, currentTab } = tabState

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      orientation="vertical"
      size="$4"
      fd="column"
      br="$4"
      activationMode="manual"
      value={currentTab}
      onValueChange={setCurrentTab}
    >
      <YStack>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="changelog-dates"
          gap={0}
          ai="flex-end"
        >
          {mdxData.map((data, id) => (
            <Tabs.Tab
              key={`${id}-${data.frontmatter.publishedAt}`}
              unstyled
              py="$2"
              transformOrigin="right"
              value={`${id}-${data.frontmatter.publishedAt}`}
              onInteraction={handleOnInteraction}
              hoverStyle={{ scale: 1.025 }}
              pressStyle={{ scale: 0.95 }}
              scale={
                Number(currentTab.charAt(0)) < id
                  ? (10 - id + Number(currentTab.charAt(0))) / 10
                  : (10 + id - Number(currentTab.charAt(0))) / 10
              }
              {...(Number(currentTab.charAt(0)) === id && {
                scale: 1,
              })}
              {...(intentAt && {
                scale: 1,
              })}
              animation="quicker"
            >
              <Anchor href={`#${data.frontmatter.publishedAt}`}>
                <TabText
                  intentAt={!!intentAt}
                  currentTab={currentTab}
                  id={id}
                  publishedAt={data.frontmatter.publishedAt}
                />
              </Anchor>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>
    </Tabs>
  )
}

const TabText = ({
  intentAt,
  currentTab,
  id,
  publishedAt,
}: { intentAt?: boolean; currentTab: string; id: number; publishedAt: string }) => {
  return (
    <SizableText
      ta="right"
      fow="bold"
      col={
        `$color${
          Number(currentTab.charAt(0)) < id
            ? 12 - id + Number(currentTab.charAt(0))
            : 12 + id - Number(currentTab.charAt(0))
        }` as any
      }
      {...(Number(currentTab.charAt(0)) === id && {
        col: '$color12',
      })}
      {...(intentAt && {
        col: '$color10',
      })}
      {...(intentAt &&
        Number(currentTab.charAt(0)) === id && {
          col: '$color11',
        })}
      hoverStyle={{ col: '$color12' }}
      className="all ease-in-out ms100"
    >
      {Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }).format(new Date(publishedAt || ''))}
    </SizableText>
  )
}
