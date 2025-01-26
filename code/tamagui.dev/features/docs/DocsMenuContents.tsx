import { getStore } from '@tamagui/use-store'
import * as React from 'react'
import { H4, Paragraph, Separator, Spacer, Theme, XStack, YStack } from 'tamagui'
import { docsRoutes } from './docsRoutes'

import { DocsNavHeading } from './DocsNavHeading'
import { DocsItemsStore, DocsRouteNavItem } from './DocsRouteNavItem'
import { useDocsMenu } from './useDocsMenu'

// const fuz = new uFuzzy({})

const sections = {
  core: docsRoutes
    .filter((x) => x.section === 'core')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
  ui: docsRoutes
    .filter((x) => x.section === 'ui')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
  compile: docsRoutes
    .filter((x) => x.section === 'compile')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
}

const allItems = [
  {
    children: (
      <H4 size="$4" o={0.5} dsp="inline-flex" px="$3" mt="$4" pb="$3">
        Style
      </H4>
    ),
  },

  ...sections.core,

  {
    children: (
      <H4 size="$4" o={0.5} dsp="inline-flex" px="$3" mt="$4" pb="$3">
        Compile
      </H4>
    ),
  },

  ...sections.compile,

  {
    children: (
      <H4 size="$4" o={0.5} dsp="inline-flex" px="$3" mt="$4" pb="$3">
        UI
      </H4>
    ),
  },
  ...sections.ui,
]

// const sectionStrings = {
//   docs: sections.docs.map((s) =>
//     `${s?.page.title || ''} ${s?.section?.title || ''}`.trim()
//   ),
//   ui: sections.ui.map((s) => `${s?.page.title || ''} ${s?.section?.title || ''}`.trim()),
// }

export const DocsMenuContents = React.memo(function DocsMenuContents({
  inMenu,
}: { inMenu?: boolean }) {
  // const store = useStore(DocsItemsStore)
  const { currentPath, section } = useDocsMenu()
  const items = inMenu ? allItems : section ? sections[section] : allItems

  console.log('items', items, section, sections)

  // const [items, setItems] = React.useState(activeItems)
  // const isFiltered = items !== activeItems

  // React.useEffect(() => {
  //   setItems(activeItems)
  // }, [section])

  return (
    <>
      {/* <Input
        size="$4"
        w="100%"
        bw={0}
        bbw={0.5}
        textContentType="none"
        autoCapitalize="none"
        autoCorrect={false}
        br="$0"
        // @ts-ignore
        name="Search"
        dsp="none"
        $pointerFine={{
          dsp: 'flex',
        }}
        borderColor="$color4"
        backgroundColor="transparent"
        focusStyle={{
          outlineWidth: 0,
          borderColor: '$color6',
        }}
        hoverStyle={{
          borderColor: '$color6',
        }}
        autoComplete="off"
        placeholder="Search..."
        // @ts-ignore
        placeholderTextColor="transparent"
        onKeyPress={(e) => {
          const event = e.nativeEvent
          if (event.key === 'Escape') {
            // closePopover()
          }
          if (event.key === 'ArrowUp') {
            e.preventDefault()
            store.index = Math.max(0, store.index - 1)
          }
          if (event.key === 'ArrowDown') {
            e.preventDefault()
            store.index = (store.index + 1) % (items.length - 1)
          }
          if (event.key === ' ' || event.key === 'Enter') {
            e.preventDefault()
            const found = items[store.index]
            if (found) {
              setItems(activeItems)
              setTimeout(() => {
                router.push(found.page?.route)
              })
            }
          }
        }}
        onChangeText={(next) => {
          if (!next) {
            setItems(activeItems)
            return
          }
          const [indexes] = fuz.search(sectionStrings[section], next)
          if (!indexes?.length) {
            setItems(activeItems)
            return
          }
          const found = indexes?.map((i) => activeItems[i]) || []
          setItems(found)
          store.index = 0
        }}
      /> */}

      <Spacer />

      {/* 
      {!inMenu && section === 'docs' && (
        <Link href="/docs/intro/1.0.01" index={-1}>
          <XStack p="$4">
            <SizableText>Tamagui UI</SizableText>
          </XStack>
        </Link>
      )} */}

      <div
        style={{ width: '100%' }}
        tabIndex={0}
        role="listbox"
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

                if ('children' in item) {
                  return <React.Fragment key={index}>{item.children}</React.Fragment>
                }

                const { section, page } = item

                const contents = (
                  <DocsRouteNavItem
                    inMenu={inMenu}
                    href={page.route}
                    active={currentPath === page.route}
                    pending={page['pending']}
                    key={`${page.route}${index}`}
                    icon={page.icon}
                    index={index}
                  >
                    {page.title}
                  </DocsRouteNavItem>
                )

                const lastItem = items[index - 1]
                const nextItem = items[index + 1]
                const isStartingSection =
                  !lastItem || item.section !== lastItem['section']
                const isEndingSection = !nextItem || nextItem['section'] !== item.section

                if (isStartingSection) {
                  return (
                    <YStack
                      key={`${page.route}${index}`}
                      {...(isEndingSection && {
                        mb: '$5',
                      })}
                    >
                      {section.label ? (
                        <DocsNavHeading inMenu={!!inMenu}>{section.label}</DocsNavHeading>
                      ) : null}
                      {section.title && (
                        <XStack
                          fd={inMenu ? 'row-reverse' : 'row'}
                          py="$2"
                          px="$4"
                          ai="center"
                          gap="$3"
                          mt="$4"
                        >
                          <Separator bc="$color02" o={0.25} my="$2" />
                          <Theme name="gray">
                            <Paragraph size="$4" fow="600" color="$color10">
                              {section.title}
                            </Paragraph>
                          </Theme>
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
                      {/* {!isFiltered && <Spacer />} */}
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
