import { Code, Eye, Link, Minus, Plus } from '~/components/icons'
import React, { forwardRef, useEffect, useState } from 'react'
import type { ComponentSize } from '@tamagui/core'
import type { ThemeName } from 'tamagui'

import useSWR from 'swr'
import {
  H2,
  Spinner,
  Text,
  toast,
  ToggleGroup,
  View,
  XGroup,
  XStack,
  YStack,
  createStyledContext,
  createStyledHOC,
  styled,
} from 'tamagui'
import { Button } from '~/components/Button'

import { useCurrentRouteParams } from '@tamagui/bento'
import { CodeWindow } from './CodeWindow'
// import { ThemeButton } from './ThemeButton'
import { type ShowcaseTheme, ShowcaseProvider } from './ShowcaseProvider'

type Props = {
  children: React.ReactNode
  title: string
  fileName: string
  short?: boolean
  theme?: ShowcaseTheme
  defaultSize?: ComponentSize
}

export const Showcase = (props: Props) => {
  const [theme, setTheme] = useState<ShowcaseTheme>('default')

  return (
    <ShowcaseProvider theme={theme} setTheme={setTheme}>
      <ShowcaseView {...props} />
    </ShowcaseProvider>
  )
}

const ShowcaseView = forwardRef<any, Props>(
  ({ children, title, short, fileName, theme, defaultSize = 'md', ...rest }, ref) => {
    const [view, setView] = useState<'code' | 'preview'>('preview')

    const { section, part } = useCurrentRouteParams()

    const codePath = `/api/bento/code?${new URLSearchParams({
      section,
      part,
      fileName,
    })}`

    const fetcher = async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Couldn't load source (${res.status})`)
      }
      return res.text()
    }

    const { data, error, isLoading } = useSWR<string>(
      view === 'code' ? codePath : null, // Only fetch when view is set to 'code'
      fetcher,
      { shouldRetryOnError: false, revalidateOnFocus: false }
    )

    const minHeight = short ? 300 : 510

    return (
      <SizeProvider defaultSize={defaultSize}>
        <YStack
          {...(theme !== 'default' && {
            theme: theme as ThemeName,
          })}
          data-bento-demo={fileName}
          gap="3"
          {...rest}
          ref={ref}
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" rowGap="2">
            <XStack items="center" flex={1} gap="3" minW="max-sm:100%">
              <H2 size="7" fontWeight="600">
                {title}
              </H2>
            </XStack>

            <XStack self="flex-end" justify="space-between" gap="3">
              {view === 'preview' ? <SizeController /> : null}
              <Button
                //@ts-ignore
                title="copy link"
                id={fileName}
                circular
                variant="quiet"
                size="sm"
                onPress={() => {
                  navigator?.clipboard?.writeText?.(
                    window.location.href.split('#')[0] + `#${fileName}`
                  )
                  toast('Link copied to clipboard')
                }}
              >
                <Button.Icon>
                  <Link />
                </Button.Icon>
              </Button>
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(val) => val && setView(val as 'preview' | 'code')}
                disableDeactivation
              >
                <XGroup rounded="10" position="relative" overflow="visible">
                  <ToggleGroup.Item value="preview" aria-label="Preview" asChild>
                    <XGroup.Item>
                      <Button
                        theme={view === 'preview' ? 'accent' : null}
                        size="sm"
                        icon={Eye}
                      />
                    </XGroup.Item>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value="code" aria-label="Code" asChild>
                    <XGroup.Item>
                      <Button
                        size="sm"
                        icon={<Code size={16} />}
                        theme={view === 'code' ? 'accent' : null}
                      >
                        Code
                      </Button>
                    </XGroup.Item>
                  </ToggleGroup.Item>
                </XGroup>
              </ToggleGroup>
            </XStack>
          </XStack>

          <ShowcaseFrame minHeight={minHeight}>
            {view === 'preview' ? (
              <View
                width="100%"
                justify="center"
                items="center"
                minH={minHeight}
                overflow="hidden"
              >
                <YStack
                  justify="center"
                  height="100%"
                  width="100%"
                  maxW={short ? 400 : '100%'}
                >
                  {children}
                </YStack>
              </View>
            ) : isLoading ? (
              <View width="100%" justify="center" items="center">
                <Spinner color="color" size="large" />
              </View>
            ) : error ? (
              <Text text="center" color="red-10" fontSize="@max-md/window:2">
                Source unavailable. Please try again later.
              </Text>
            ) : data ? (
              <CodeWindow code={data} />
            ) : null}
          </ShowcaseFrame>
        </YStack>
      </SizeProvider>
    )
  }
)

// a hairline box and nothing else, so the component is the only thing on show
const ShowcaseFrame = (props: { minHeight: number; children: React.ReactNode }) => {
  const { minHeight, children } = props
  return (
    <YStack
      width="100%"
      position="relative"
      minH={minHeight}
      rounded="3"
      overflow="hidden"
      borderWidth={1}
      borderColor="border-color"
    >
      {/* demos read their own width through the window container group */}
      <YStack
        flexGrow={1}
        width="100%"
        overflow="hidden"
        justify="center"
        items="center"
        group="window"
        container
        containerName="window"
      >
        {children}
      </YStack>
    </YStack>
  )
}

// centers a demo with room around it, and grows with it so nothing clips
export const ShowcaseChildWrapper = styled(View, {
  width: '100%',
  flexGrow: 1,
  items: 'center',
  justify: 'center',
  px: '24px @max-md/window:5px',
  py: '24px @max-md/window:0px',
})

/** ---------- SIZE CONTROLLER ----------- */

export const { Provider: RawSizeProvider, useStyledContext: useSize } =
  createStyledContext({
    sizes: [] as ComponentSize[],
    setSizes: (sizes: ComponentSize[]) => {},
    size: 'md' as ComponentSize,
    setSize: (size: ComponentSize) => {},
    showController: false,
    setShowController: (val: boolean) => {},
  })

const SizeProvider = ({
  children,
  defaultSize = 'md',
}: {
  children: any
  defaultSize?: ComponentSize
}) => {
  const [sizes, setSizes] = useState<ComponentSize[]>(['xs', 'sm', 'md', 'lg', 'xl'])
  const [size, setSize] = useState<ComponentSize>(defaultSize)
  const [showController, setShowController] = useState(false)

  return (
    <RawSizeProvider
      sizes={sizes}
      setSizes={setSizes}
      showController={showController}
      setShowController={setShowController}
      size={size}
      setSize={setSize}
    >
      {children}
    </RawSizeProvider>
  )
}

export const WithSize = ({ children }: { children: any }) => {
  const { size, showController, setShowController } = useSize()

  useEffect(() => {
    if (!showController) {
      setShowController(true)
    }
  }, [showController])

  return React.cloneElement(children, { size })
}

export const SizeController = createStyledHOC(XGroup, (props, ref) => {
  const { size, sizes, setSize, showController } = useSize()

  if (!showController) return null

  return (
    <XGroup
      ref={ref}
      justify="center"
      items="center"
      bg="background-press"
      gap="0-5"
      overflow="hidden"
      rounded={1_000_000_000}
      {...props}
    >
      <XGroup.Item>
        <Button
          size="sm"
          variant="quiet"
          py="1-5"
          onPress={() => {
            const index = sizes.indexOf(size)
            setSize(sizes[Math.max(index - 1, 0)])
          }}
        >
          <Button.Icon>
            <Minus />
          </Button.Icon>
        </Button>
      </XGroup.Item>

      <XGroup.Item>
        <Button
          size="sm"
          variant="quiet"
          py="1-5"
          onPress={() => {
            const index = sizes.indexOf(size)
            setSize(sizes[Math.min(index + 1, sizes.length - 1)])
          }}
        >
          <Button.Icon>
            <Plus />
          </Button.Icon>
        </Button>
      </XGroup.Item>
    </XGroup>
  )
})
