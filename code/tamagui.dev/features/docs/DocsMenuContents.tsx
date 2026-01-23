import * as React from 'react'
import { Accordion, H4, Paragraph, XStack, YStack } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { DocsRouteNavItem } from './DocsRouteNavItem'
import { docsRoutes } from './docsRoutes'
import { useDocsMenu } from './useDocsMenu'

const allItems = docsRoutes.flatMap((section, sectionIndex) =>
  section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
)

type Item = (typeof allItems)[0]
type Section = Item['section']

// group items by section title for accordion
const itemsGroupedByTitle: Record<string, Item[]> = {}
for (const item of allItems) {
  if (!item) continue
  const key = item.section.title || ''
  itemsGroupedByTitle[key] ||= []
  itemsGroupedByTitle[key].push(item)
}

// also group by section (core/ui/compiler) for the section filter
const sections = {
  core: docsRoutes
    .filter((x) => x.section === 'core' || x.section === 'compiler')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
  ui: docsRoutes
    .filter((x) => x.section === 'ui')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
  compiler: docsRoutes
    .filter((x) => x.section === 'compiler')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
}

export const DocsMenuContents = React.memo(function DocsMenuContents({
  section: propsSection,
  inMenu,
}: { inMenu?: boolean; section?: keyof typeof sections }) {
  const { currentPath, section: docsSection } = useDocsMenu()
  const section = propsSection ?? docsSection

  // track open section - start collapsed, user opens what they want
  const [openSection, setOpenSection] = React.useState('')

  // filter items based on section prop
  const filteredItems = section ? sections[section] : allItems

  // group filtered items by title
  const groupedItems: Record<string, Item[]> = {}
  for (const item of filteredItems) {
    if (!item) continue
    const key = item.section.title || ''
    groupedItems[key] ||= []
    groupedItems[key].push(item)
  }

  // for UI section, keep the flat list with labels (existing behavior)
  if (section === 'ui') {
    return (
      <UIMenuContents items={filteredItems} currentPath={currentPath} inMenu={inMenu} />
    )
  }

  return (
    <div style={{ width: '100%', paddingBottom: inMenu ? 0 : 80 }} aria-label="Docs Menu">
      <Accordion
        value={openSection}
        onValueChange={setOpenSection}
        type="single"
        collapsible
      >
        {Object.keys(groupedItems).map((sectionTitle) => {
          const items = groupedItems[sectionTitle]
          return (
            <AccordionSection
              key={sectionTitle}
              inMenu={inMenu}
              section={items?.[0]?.section}
              items={items}
              currentPath={currentPath}
            />
          )
        })}
      </Accordion>
    </div>
  )
})

// accordion section for core docs
const AccordionSection = ({
  section,
  items,
  inMenu,
  currentPath,
}: {
  section: Section
  items: Item[]
  inMenu?: boolean
  currentPath: string
}) => {
  const content = (
    <YStack paddingHorizontal="$2" paddingVertical="$2">
      {items.map(({ page }, index) => {
        return (
          <DocsRouteNavItem
            inMenu={inMenu ?? false}
            href={page.route}
            active={currentPath === page.route}
            pending={page['pending']}
            key={`${page.route}${index}`}
            icon={(page as any).icon}
          >
            {page.title}
          </DocsRouteNavItem>
        )
      })}
    </YStack>
  )

  // no title = top-level items, render without accordion
  if (!section?.title) {
    return <YStack marginBottom="$2">{content}</YStack>
  }

  return (
    <Accordion.Item value={section.title}>
      <Accordion.Trigger
        unstyled
        backgroundColor="transparent"
        borderWidth={0}
        hoverStyle={{
          backgroundColor: '$background02',
        }}
        borderRadius="$4"
        marginHorizontal="$2"
      >
        {({ open }) => {
          return (
            <XStack
              paddingVertical="$2"
              paddingHorizontal="$3"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Paragraph size="$4" fontWeight="600" color="$color11">
                {section.title}
              </Paragraph>

              <YStack rotate={open ? '180deg' : '0deg'} transition="quick">
                <ChevronDown color="$color8" size="$1" />
              </YStack>
            </XStack>
          )
        }}
      </Accordion.Trigger>

      <Accordion.HeightAnimator overflow="hidden" transition="slow">
        <Accordion.Content
          unstyled
          transition="slow"
          backgroundColor="transparent"
          exitStyle={{ opacity: 0 }}
        >
          {content}
        </Accordion.Content>
      </Accordion.HeightAnimator>
    </Accordion.Item>
  )
}

// flat list for UI section (keeps existing label-based grouping)
const UIMenuContents = ({
  items,
  currentPath,
  inMenu,
}: {
  items: Item[]
  currentPath: string
  inMenu?: boolean
}) => {
  return (
    <div style={{ width: '100%', paddingBottom: inMenu ? 0 : 80 }} aria-label="Docs Menu">
      <H4
        size="$4"
        opacity={0.5}
        display="inline-flex"
        paddingHorizontal="$3"
        marginTop="$4"
        paddingBottom="$3"
      >
        UI
      </H4>
      {items.map((item, index) => {
        if (!item) return null

        const { section, page } = item
        const lastItem = items[index - 1]
        const isStartingSection = !lastItem || item.section !== lastItem['section']

        const contents = (
          <DocsRouteNavItem
            inMenu={inMenu ?? false}
            href={page.route}
            active={currentPath === page.route}
            pending={page['pending']}
            key={`${page.route}${index}`}
            icon={(page as any).icon}
          >
            {page.title}
          </DocsRouteNavItem>
        )

        if (isStartingSection && section.label) {
          return (
            <YStack key={`${page.route}${index}`} marginTop="$4">
              <Paragraph
                fontFamily="$mono"
                size="$2"
                paddingHorizontal="$4"
                paddingVertical="$2"
                color="$color9"
                textTransform="uppercase"
                letterSpacing={1}
              >
                {section.label}
              </Paragraph>
              {contents}
            </YStack>
          )
        }

        return contents
      })}
    </div>
  )
}
