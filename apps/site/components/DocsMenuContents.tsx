import { useItemList } from 'use-item-list'
import uFuzzy from '@leeoniya/ufuzzy'
import { docsRoutes } from '@lib/docsRoutes'
import * as React from 'react'
import { Input, Paragraph, Separator, Spacer, View, XStack, YStack } from 'tamagui'

import { DocsItemContext, DocsRouteNavItem } from './DocsRouteNavItem'
import { NavHeading } from './NavHeading'
import { useDocsMenu } from './useDocsMenu'

const fuz = new uFuzzy({})

const allItems = docsRoutes.flatMap((section, sectionIndex) =>
  section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
)
const allItemsStrings = allItems.map((s) =>
  `${s?.page.title || ''} ${s?.section?.title || ''}`.trim()
)

export const DocsMenuContents = React.memo(function DocsMenuContents() {
  const { currentPath } = useDocsMenu()
  const [items, setItems] = React.useState(allItems)
  const isFiltered = items !== allItems
  const [selected, setSelected] = React.useState<any>(null)
  const itemList = useItemList({
    selected,
    onSelect: setSelected,
  })
  const itemId = itemList.useHighlightedItemId()

  return (
    <>
      <Input
        size="$3"
        w="100%"
        borderWidth={0.5}
        placeholder="Filter..."
        placeholderTextColor="$gray9"
        onKeyPress={(e) => {
          const event = e.nativeEvent
          if (event.key === 'ArrowUp') {
            e.preventDefault()
            itemList.moveHighlightedItem(-1)
          }
          if (event.key === 'ArrowDown') {
            e.preventDefault()
            itemList.moveHighlightedItem(1)
          }
          if (event.key === ' ' || event.key === 'Enter') {
            e.preventDefault()
            itemList.selectHighlightedItem()
          }
        }}
        onChangeText={(next) => {
          if (!next) {
            setItems(allItems)
            return
          }
          const [indexes] = fuz.search(allItemsStrings, next)
          if (!indexes?.length) {
            setItems(allItems)
            return
          }
          const found = indexes?.map((i) => allItems[i])
          React.startTransition(() => {
            itemList.setHighlightedItem(0)
            setItems(found || allItems)
          })
        }}
      />

      <Spacer />

      <div
        style={{ width: '100%' }}
        tabIndex={0}
        role="listbox"
        aria-activedescendant={itemId}
      >
        <DocsItemContext.Provider value={itemList}>
          {React.useMemo(() => {
            return (
              <>
                {items.map((item, i) => {
                  if (!item) return null

                  const { section, page, index } = item

                  if ('type' in section) {
                    if (section.type === 'hr') {
                      return (
                        <YStack key={`sep${i}`} mx="$4">
                          {section.title ? (
                            <XStack
                              ai="center"
                              space="$6"
                              spaceDirection="horizontal"
                              mb="$2"
                              mt="$3"
                            >
                              <Separator />
                              <Paragraph size="$4">{section.title}</Paragraph>
                            </XStack>
                          ) : (
                            <Separator my="$4" />
                          )}
                        </YStack>
                      )
                    }
                    return null
                  }

                  const contents = (
                    <DocsRouteNavItem
                      inMenu
                      href={page.route}
                      active={currentPath === page.route}
                      pending={page['pending']}
                    >
                      {page.title}
                    </DocsRouteNavItem>
                  )

                  const lastItem = items[i - 1]
                  const nextItem = items[i + 1]
                  const isEndingSection = !nextItem || nextItem.section !== item.section
                  const isStartingSection =
                    section.label && (!lastItem || item.section !== lastItem.section)

                  if (isEndingSection) {
                    return (
                      <React.Fragment key={`${page.route}${index}`}>
                        {contents}
                        {!isFiltered && <Spacer />}
                      </React.Fragment>
                    )
                  }

                  if (isStartingSection) {
                    return (
                      <React.Fragment key={`${page.route}${index}`}>
                        <NavHeading>{section.label}</NavHeading>
                        {contents}
                      </React.Fragment>
                    )
                  }

                  return contents
                })}
              </>
            )
          }, [items])}
        </DocsItemContext.Provider>
      </div>
    </>
  )
})
