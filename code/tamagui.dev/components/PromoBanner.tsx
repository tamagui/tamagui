import { ChevronRight } from '@tamagui/lucide-icons'
import { memo, useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  ScrollView,
  Separator,
  Spacer,
  TooltipSimple,
  XGroup,
  XStack,
} from 'tamagui'
import { Link } from '~/components/Link'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import type { ThemeSuiteItemData } from '~/features/studio/theme/types'
import { ContainerLarge } from './Containers'

const HomeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48a16,16,0,0,1,21.66,0l80,75.48A16,16,0,0,1,224,115.55Z" />
  </svg>
)

const bannerEnabled = true
const bannerHeight = 42

export const useBannerHeight = () => {
  return bannerEnabled ? bannerHeight : 0
}

type ThemeWithData = {
  id: number
  name: string
  slug: string
  search_query: string
  theme_data: ThemeSuiteItemData | null
}

// featured theme ids with display names
const featuredThemesMeta = [
  { id: 1980, name: 'B/W', slug: 'black-and-white-hi-contrast' },
  { id: 1951, name: 'Ocean', slug: 'ocean-blue-theme' },
  { id: 82, name: 'SUPER', slug: 'supreme' },
  { id: 53, name: 'Cactus', slug: 'desert' },
  { id: 37, name: 'Neon', slug: 'nike-neon' },
] as const

// initialize with static data so buttons render on SSR
const initialFeaturedThemes: ThemeWithData[] = featuredThemesMeta.map((meta) => ({
  ...meta,
  search_query: meta.name,
  theme_data: null,
}))

export const PromoBanner = () => {
  if (!bannerEnabled) {
    return null
  }

  return (
    <XStack
      bg="$background02"
      width="100%"
      items="center"
      justify="center"
      z={10001}
      position="relative"
    >
      <ContainerLarge px={0} flexDirection="row">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            justify: 'center',
            minW: '100%',
          }}
        >
          <XStack flex={1} items="center" gap="$4" px="$4" py="$2">
            <XStack items="center" gap="$4">
              <Link href="/">
                <Button chromeless size="$2" circular icon={HomeIcon} scaleIcon={1.5} />
              </Link>

              <TooltipSimple label="Tamagui 2 is here! It's a massive new release »">
                <Link href="/blog/version-two">
                  <Paragraph
                    size="$2"
                    color="$color11"
                    hoverStyle={{ color: '$color12' }}
                    cursor="pointer"
                    ellipsis
                  >
                    Version 2 is here 🎉
                  </Paragraph>
                </Link>
              </TooltipSimple>

              <Separator vertical height={16} borderColor="$color5" />

              <TooltipSimple label="Ever wished there was a Rails for cross-platform React?">
                <Link href="/takeout">
                  <Paragraph
                    size="$2"
                    color="$color10"
                    hoverStyle={{ color: '$color11' }}
                    cursor="pointer"
                    ellipsis
                  >
                    Takeout 2 is here, too!
                  </Paragraph>
                </Link>
              </TooltipSimple>

              {/* <Separator vertical height={16} borderColor="$color5" /> */}
            </XStack>

            <Spacer flex={1} />

            <BannerThemes />
          </XStack>
        </ScrollView>
      </ContainerLarge>
    </XStack>
  )
}

const BannerThemes = memo(() => {
  const [featuredThemes, setFeaturedThemes] =
    useState<ThemeWithData[]>(initialFeaturedThemes)
  // const [recentThemes, setRecentThemes] = useState<ThemeWithData[]>([])
  const { updateGenerate, clearTheme, currentThemeId } = useThemeBuilderStore()

  useEffect(() => {
    fetch('/api/theme/recent')
      .then((res) => res.json())
      .then((data) => {
        // if (data.recent) {
        //   setRecentThemes(
        //     data.recent.slice(0, 3).map((t: any) => ({
        //       id: t.id,
        //       name: t.search_query,
        //       slug: '',
        //       search_query: t.search_query,
        //       theme_data: t.theme_data,
        //     }))
        //   )
        // }

        if (data.featured) {
          const featuredWithMeta = featuredThemesMeta.map((meta) => {
            const apiTheme = data.featured.find((t: any) => t.id === meta.id)
            return {
              ...meta,
              search_query: apiTheme?.search_query || meta.name,
              theme_data: apiTheme?.theme_data || null,
            }
          })
          setFeaturedThemes(featuredWithMeta)
        }
      })
      .catch(console.error)
  }, [])

  const handleThemeClick = (theme: ThemeWithData) => {
    setTimeout(() => {
      // toggle off if already active
      if (currentThemeId === String(theme.id)) {
        clearTheme()
        return
      }
      if (theme.theme_data) {
        updateGenerate(theme.theme_data, theme.search_query, theme.id)
      }
    })
  }

  return (
    <>
      <XStack items="center" gap="$4">
        <TooltipSimple label="To celebrate v2, here's some free themes!">
          <Paragraph size="$2" select="none" color="$color9">
            Themes:
          </Paragraph>
        </TooltipSimple>

        <XStack my={-3} items="center" gap="$2">
          {featuredThemes.map((theme) => {
            const isActive = currentThemeId === String(theme.id)
            return (
              <XGroup key={theme.id} size="$2" rounded="$10">
                <XGroup.Item>
                  <Button
                    // theme={isActive ? 'white' : null}
                    bg="transparent"
                    hoverStyle={{
                      bg: '$background02',
                    }}
                    size="$2.5"
                    rounded="$10"
                    borderWidth={0}
                    onPress={() => handleThemeClick(theme)}
                  >
                    <Paragraph
                      size="$2"
                      fontWeight="500"
                      fontFamily="$mono"
                      color={isActive ? '$color12' : '$color9'}
                    >
                      {theme.name}
                    </Paragraph>
                  </Button>
                </XGroup.Item>
                <Link href={`/theme/${theme.id}/${theme.slug}`}>
                  <XGroup.Item>
                    <Button
                      size="$2.5"
                      bg="transparent"
                      hoverStyle={{
                        bg: '$background02',
                      }}
                      rounded="$10"
                      borderWidth={0}
                      icon={<ChevronRight mx={-3} ml={-6} size={12} opacity={0.15} />}
                      scaleIcon={0.8}
                    />
                  </XGroup.Item>
                </Link>
              </XGroup>
            )
          })}
        </XStack>
      </XStack>

      {/* <AnimatePresence>
        {recentThemes.length > 0 && (
          <XStack key="recent-themes" items="center" gap="$2">
            <Separator vertical height={16} bg="$color5" />

            <Paragraph size="$1" color="$color8">
              Recently:
            </Paragraph>

            {recentThemes.map((theme) => {
              const isActive = currentThemeId === String(theme.id)
              return (
                <Theme key={`recent-${theme.id}`} name={isActive ? 'green' : null}>
                  <Button
                    size="$2"
                    rounded="$10"
                    borderWidth={0}
                    onPress={() => handleThemeClick(theme)}
                    {...(isActive && { bg: '$color5' })}
                    hoverStyle={{ bg: '$color4' }}
                    pressStyle={{ bg: '$color5' }}
                  >
                    <Paragraph
                      ellipsis
                      display="inline-flex"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      size="$2"
                      maxW={80}
                      fontFamily="$mono"
                      fontWeight="500"
                    >
                      {theme.search_query}
                    </Paragraph>
                  </Button>
                </Theme>
              )
            })}
          </XStack>
        )}
      </AnimatePresence> */}
    </>
  )
})
