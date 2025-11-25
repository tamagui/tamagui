import * as React from 'react'
import { H4, Paragraph, Separator, Theme, XStack, YStack } from 'tamagui'
import { DocsNavHeading } from './DocsNavHeading'
import { DocsRouteNavItem } from './DocsRouteNavItem'
import { docsRoutes } from './docsRoutes'
import { useDocsMenu } from './useDocsMenu'

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
  compiler: docsRoutes
    .filter((x) => x.section === 'compiler')
    .flatMap((section, sectionIndex) =>
      section.pages?.map((page, index) => ({ page, section, sectionIndex, index }))
    ),
}

const allItems = [
  {
    children: (
      <H4 size="$4" opacity={0.5} display="inline-flex" px="$3" mt="$4" pb="$3">
        Style
      </H4>
    ),
  },

  ...sections.core,

  {
    children: (
      <H4 size="$4" opacity={0.5} display="inline-flex" px="$3" mt="$4" pb="$3">
        Compiler
      </H4>
    ),
  },

  ...sections.compiler,

  {
    children: (
      <H4 size="$4" opacity={0.5} display="inline-flex" px="$3" mt="$4" pb="$3">
        UI
      </H4>
    ),
  },
  ...sections.ui,
]

export const DocsMenuContents = React.memo(function DocsMenuContents({
  section: propsSection,
  inMenu,
}: { inMenu?: boolean; section?: keyof typeof sections }) {
  const { currentPath, section: docsSection } = useDocsMenu()
  const section = propsSection ?? docsSection
  const items = section ? sections[section] : allItems

  return (
    <>
      <div style={{ width: '100%' }} aria-label="Docs Menu">
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
                    inMenu={inMenu ?? false}
                    href={page.route}
                    active={currentPath === page.route}
                    pending={page['pending']}
                    key={`${page.route}${index}`}
                    icon={page.icon}
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
                          flexDirection={inMenu ? 'row-reverse' : 'row'}
                          py="$2"
                          px="$4"
                          items="center"
                          gap="$3"
                          mt="$4"
                        >
                          <Separator borderColor="$color02" opacity={0.25} my="$2" />
                          <Theme name="gray">
                            <Paragraph
                              fontFamily="$mono"
                              size="$4"
                              fontWeight="600"
                              color="$color10"
                            >
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
