import { getStore } from '@tamagui/use-store'
import * as React from 'react'
import { H4, Paragraph, Separator, Spacer, styled, XStack, YStack } from 'tamagui'
import { DocsItemsStore, DocsRouteNavItem } from './DocsRouteNavItem'
import { docsRoutes } from './docsRoutes'
import { useDocsMenu } from './useDocsMenu'

const sections = {
  docs: docsRoutes.flatMap((section, sectionIndex) =>
    section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
  ),
  ui: docsRoutes.flatMap((section, sectionIndex) =>
    section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
  ),
}

const allItems = [...sections.docs, ...sections.ui]

export const DocsMenuContents = React.memo(function DocsMenuContents({
  inMenu,
}: { inMenu?: boolean }) {
  const { currentPath } = useDocsMenu()
  const activeSection = currentPath.startsWith('/ui') ? 'ui' : 'docs'
  const activeItems = inMenu ? allItems : sections[activeSection]
  const [items, setItems] = React.useState(activeItems)
  const isFiltered = items !== activeItems

  React.useEffect(() => {
    setItems(activeItems)
  }, [activeSection])

  return (
    <>
      {/* 
      {!inMenu && activeSection === 'docs' && (
        <Link href="/docs/intro/1.0.01" index={-1}>
          <XStack p="$4">
            <SizableText>Tamagui UI</SizableText>
          </XStack>
        </Link>
      )} */}

      <div
        style={{ width: '100%' }}
        onMouseEnter={() => {
          getStore(DocsItemsStore).hovered = true
        }}
        onMouseLeave={() => {
          getStore(DocsItemsStore).hovered = false
        }}
      >
        {React.useMemo(() => {
          return (
            <>
              {items.map((item, index) => {
                if (!item) return null

                const { section, page } = item

                const contents = (
                  <DocsRouteNavItem
                    inMenu={inMenu}
                    href={page.route}
                    active={currentPath === page.route}
                    pending={page['pending']}
                    key={`${page.route}${index}`}
                    // icon={page.icon}
                    index={index}
                  >
                    {page.title}
                  </DocsRouteNavItem>
                )

                const lastItem = items[index - 1]
                const nextItem = items[index + 1]
                const isStartingSection = !lastItem || item.section !== lastItem.section
                const isEndingSection = !nextItem || nextItem.section !== item.section

                if (isStartingSection) {
                  return (
                    <YStack
                      key={`${page.route}${index}`}
                      {...(isEndingSection && {
                        mb: '$5',
                      })}
                    >
                      {/* {section.label ? (
                        <DocsNavHeading inMenu={!!inMenu}>{section.label}</DocsNavHeading>
                      ) : null} */}
                      {section.title && (
                        <XStack
                          // TODO @natew i think compilation is messing this ternary up
                          // debug
                          fd={inMenu ? 'row-reverse' : 'row'}
                          py="$2"
                          px="$4"
                          ai="center"
                          gap="$3"
                        >
                          <Separator bc="$color025" o={0.25} my="$2" />

                          <Paragraph size="$4" fow="600" color="$color11">
                            {section.title}
                          </Paragraph>
                        </XStack>
                      )}
                      {contents}
                    </YStack>
                  )
                }

                if (isEndingSection) {
                  return (
                    <React.Fragment key={`${page.route}${index}`}>
                      {contents}
                      {!isFiltered && <Spacer />}
                    </React.Fragment>
                  )
                }

                return contents
              })}
            </>
          )
        }, [items, currentPath])}
      </div>
    </>
  )
})
