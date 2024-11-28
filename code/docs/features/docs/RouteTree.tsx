import { File, Folder, Plus, Minus } from '@tamagui/lucide-icons'
import { Paragraph, ScrollView, XStack, YStack } from 'tamagui'

type RouteNode = {
  name: string
  description?: string
  highlight?: boolean
  children?: RouteNode[]
  delete?: boolean
  add?: boolean
}

export const RouteTree = ({
  routes,
  indent = 0,
}: { routes: RouteNode[]; indent?: number }) => {
  return (
    <YStack
      ov="hidden"
      theme="light"
      {...(!indent && {
        bw: 2,
        bc: '$color4',
        br: '$4',
        my: '$4',
      })}
      {...(indent && {
        btc: '$color4',
        zi: 1000,
        btw: 1,
      })}
    >
      <ScrollView
        horizontal
        contentContainerStyle={{
          flex: 1,
          miw: '100%',
        }}
      >
        <YStack f={1}>
          {routes.map((route, i) => {
            const Icon = route.children ? Folder : File
            const StatusIcon = route.delete ? Minus : route.add ? Plus : null
            const statusColor = route.delete
              ? '$red10'
              : route.add
                ? '$green10'
                : undefined

            return (
              <YStack
                componentName="RouteTree"
                key={i}
                bbw={1}
                theme={route.delete ? 'light_gray' : route.add ? 'add' : undefined}
                bbc="$color3"
                bg="$color1"
                {...((route.highlight || route.add) && {
                  bg: '$color2',
                })}
                {...(i === routes.length - 1 && {
                  mb: -1,
                })}
              >
                <XStack px="$2">
                  <XStack
                    w="30%"
                    miw={130}
                    ov="hidden"
                    p="$2.5"
                    ai="center"
                    gap="$3"
                    {...(indent && {
                      pl: '$7',
                    })}
                  >
                    <Icon
                      size={12}
                      color="$color10"
                      {...(!route.children && {
                        opacity: 0.5,
                      })}
                    />
                    {StatusIcon && <StatusIcon size={12} color={statusColor} />}
                    <Paragraph f={1} ww="normal" ov="hidden" ellipsis ff="$mono">
                      {route.name}
                    </Paragraph>
                  </XStack>
                  <YStack p="$2.5">
                    <Paragraph size="$4" color="$color11">
                      {route.description}
                    </Paragraph>
                  </YStack>
                </XStack>

                {route.children && (
                  <YStack>
                    <RouteTree routes={route.children} indent={indent + 1} />
                  </YStack>
                )}
              </YStack>
            )
          })}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
