import * as React from 'react'
import { Accordion, Button, Paragraph, TooltipSimple, XStack, YStack } from 'tamagui'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from '@tamagui/lucide-icons'
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

// also group by section (core/ui) for the section filter
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
}

export const DocsMenuContents = React.memo(function DocsMenuContents({
  section: propsSection,
  inMenu,
}: { inMenu?: boolean; section?: keyof typeof sections }) {
  const { currentPath, section: docsSection } = useDocsMenu()
  // compiler pages now show core section (merged)
  const rawSection = propsSection ?? docsSection
  const section = rawSection === 'compiler' ? 'core' : rawSection

  // filter items based on section prop
  const filteredItems = section ? sections[section as keyof typeof sections] : allItems

  // find section key for a given path
  const getSectionKeyForPath = (path: string) => {
    for (const item of filteredItems) {
      if (!item) continue
      if (item.page.route === path) {
        return section === 'ui' ? item.section.label : item.section.title
      }
    }
    return ''
  }

  // compute initial open section synchronously (SSR-safe)
  const currentSectionKey = currentPath ? getSectionKeyForPath(currentPath) : ''

  // track open sections - initialized with current section
  const [openSections, setOpenSections] = React.useState<string[]>(
    currentSectionKey ? [currentSectionKey] : []
  )

  // update when navigating to a different section
  React.useEffect(() => {
    if (currentSectionKey && !openSections.includes(currentSectionKey)) {
      setOpenSections((prev) => [...prev, currentSectionKey])
    }
  }, [currentSectionKey])

  // group filtered items by title
  const groupedItems: Record<string, Item[]> = {}
  for (const item of filteredItems) {
    if (!item) continue
    const key = item.section.title || ''
    groupedItems[key] ||= []
    groupedItems[key].push(item)
  }

  // get all section keys for toggle all
  const allSectionKeys = Object.keys(groupedItems).filter((k) => k !== '')

  // for UI section, group by label and use accordions
  if (section === 'ui') {
    // group UI items by label
    const uiGroupedItems: Record<string, Item[]> = {}
    for (const item of filteredItems) {
      if (!item) continue
      const key = item.section.label || ''
      uiGroupedItems[key] ||= []
      uiGroupedItems[key].push(item)
    }

    const uiSectionKeys = Object.keys(uiGroupedItems).filter((k) => k !== '')
    const allExpanded =
      uiSectionKeys.length > 0 && uiSectionKeys.every((k) => openSections.includes(k))

    const toggleAll = () => {
      if (allExpanded) {
        setOpenSections([])
      } else {
        setOpenSections(uiSectionKeys)
      }
    }

    return (
      <div
        style={{ width: '100%', paddingBottom: inMenu ? 0 : 80 }}
        aria-label="Docs Menu"
      >
        {!inMenu && (
          <XStack justifyContent="flex-end" pr="$2" mb="$2">
            <ToggleAllButton expanded={allExpanded} onPress={toggleAll} />
          </XStack>
        )}
        <Accordion value={openSections} onValueChange={setOpenSections} type="multiple">
          {Object.keys(uiGroupedItems).map((label) => {
            const items = uiGroupedItems[label]
            return (
              <AccordionSection
                key={label}
                inMenu={inMenu}
                section={{ ...items?.[0]?.section, title: label } as Section}
                items={items}
                currentPath={currentPath}
              />
            )
          })}
        </Accordion>
      </div>
    )
  }

  const allExpanded =
    allSectionKeys.length > 0 && allSectionKeys.every((k) => openSections.includes(k))

  const toggleAll = () => {
    if (allExpanded) {
      setOpenSections([])
    } else {
      setOpenSections(allSectionKeys)
    }
  }

  return (
    <div style={{ width: '100%', paddingBottom: inMenu ? 0 : 80 }} aria-label="Docs Menu">
      {!inMenu && (
        <XStack justifyContent="flex-end" pr="$2" mb="$2">
          <ToggleAllButton expanded={allExpanded} onPress={toggleAll} />
        </XStack>
      )}
      <Accordion value={openSections} onValueChange={setOpenSections} type="multiple">
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

// toggle all button component
const ToggleAllButton = ({
  expanded,
  onPress,
}: {
  expanded: boolean
  onPress: () => void
}) => {
  return (
    <TooltipSimple label={expanded ? 'Collapse all' : 'Expand all'} placement="right">
      <Button
        circular
        size="$3"
        my="$-3"
        chromeless
        hoverStyle={{ opacity: 1, backgroundColor: '$color3' }}
        pressStyle={{ opacity: 0.8, backgroundColor: '$color2' }}
        onPress={onPress}
        aria-label={expanded ? 'Collapse all sections' : 'Expand all sections'}
      >
        {expanded ? (
          <ChevronsDownUp size={14} color="$color10" />
        ) : (
          <ChevronsUpDown size={14} color="$color10" />
        )}
      </Button>
    </TooltipSimple>
  )
}

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
          backgroundColor: '$color2',
        }}
        pressStyle={{
          backgroundColor: '$color1',
        }}
        borderRadius="$4"
        marginHorizontal="$2"
      >
        {({ open }) => {
          return (
            <XStack
              paddingVertical="$3"
              paddingHorizontal="$3"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Paragraph size="$5" fontWeight="600" color="$color12">
                {section.title}
              </Paragraph>

              <YStack
                transition="quick"
                rotate={open ? '180deg' : '0deg'}
                animateOnly={['transform']}
              >
                <ChevronDown color="$color8" size="$1" />
              </YStack>
            </XStack>
          )
        }}
      </Accordion.Trigger>

      <Accordion.HeightAnimator overflow="hidden" transition="200ms">
        <Accordion.Content
          unstyled
          transition="200ms"
          backgroundColor="transparent"
          exitStyle={{ opacity: 0 }}
        >
          {content}
        </Accordion.Content>
      </Accordion.HeightAnimator>
    </Accordion.Item>
  )
}
