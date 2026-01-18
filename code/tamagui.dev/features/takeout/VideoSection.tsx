import { ThemeTintAlt } from '@tamagui/logo'
import { H2, SizableText, XStack, YStack, useThemeName } from 'tamagui'
import { HighlightText } from './HighlightText'

export const VideoSection = () => {
  const isDark = useThemeName().startsWith('dark')

  return (
    <YStack items="center" gap="$6" maxW={1000} mx="auto" width="100%">
      <H2
        fontSize={32}
        fontWeight="700"
        text="center"
        color="$color12"
        style={{ lineHeight: '1.2' }}
        $sm={{ fontSize: 40 }}
      >
        See it{' '}
        <ThemeTintAlt>
          <HighlightText tag="span">in action.</HighlightText>
        </ThemeTintAlt>
      </H2>

      <YStack position="relative" width="100%" maxW={800}>
        <YStack
          bg={isDark ? '#2a2a2a' : '#d4d0c8'}
          rounded="$6"
          p="$5"
          borderWidth={4}
          borderColor={isDark ? '#444' : '#a0a0a0'}
          style={{
            boxShadow: isDark
              ? 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.3), 4px 4px 12px rgba(0,0,0,0.4)'
              : 'inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.2), 4px 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <YStack
            bg={isDark ? '#1a1a1a' : '#333'}
            rounded="$4"
            p="$3"
            borderWidth={3}
            borderColor={isDark ? '#111' : '#222'}
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            <YStack
              position="absolute"
              t={12}
              l={12}
              r={12}
              b={12}
              rounded="$3"
              z={2}
              pointerEvents="none"
              opacity={0.03}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              }}
            />

            <YStack
              position="relative"
              width="100%"
              style={{
                paddingBottom: '56.25%',
              }}
              rounded="$2"
              overflow="hidden"
              bg="#000"
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src="https://www.youtube.com/embed/HWeUin_9asM"
                title="Takeout Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </YStack>
          </YStack>

          <XStack mt="$4" justify="space-between" items="center" px="$2">
            <YStack>
              <SizableText
                fontFamily="$silkscreen"
                size="$2"
                color={isDark ? '#666' : '#888'}
                letterSpacing={2}
              >
                TAMAGUI
              </SizableText>
            </YStack>

            <XStack gap="$4" items="center">
              <YStack items="center" gap="$1">
                <YStack
                  width={24}
                  height={24}
                  rounded={100}
                  bg={isDark ? '#444' : '#888'}
                  borderWidth={2}
                  borderColor={isDark ? '#555' : '#999'}
                  style={{
                    boxShadow: isDark
                      ? 'inset 1px 1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(0,0,0,0.3)'
                      : 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  VOL
                </SizableText>
              </YStack>

              <YStack items="center" gap="$1">
                <YStack
                  width={24}
                  height={24}
                  rounded={100}
                  bg={isDark ? '#444' : '#888'}
                  borderWidth={2}
                  borderColor={isDark ? '#555' : '#999'}
                  style={{
                    boxShadow: isDark
                      ? 'inset 1px 1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(0,0,0,0.3)'
                      : 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  CH
                </SizableText>
              </YStack>

              <YStack items="center" gap="$1">
                <YStack
                  width={8}
                  height={8}
                  rounded={100}
                  bg="#00ff00"
                  style={{
                    boxShadow: '0 0 6px #00ff00, 0 0 12px #00ff0080',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  PWR
                </SizableText>
              </YStack>
            </XStack>
          </XStack>
        </YStack>

        <XStack justify="center" gap="$10" mt={-2}>
          <YStack
            width={60}
            height={12}
            bg={isDark ? '#333' : '#bbb'}
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
            style={{
              boxShadow: isDark
                ? '2px 2px 4px rgba(0,0,0,0.3)'
                : '2px 2px 4px rgba(0,0,0,0.15)',
            }}
          />
          <YStack
            width={60}
            height={12}
            bg={isDark ? '#333' : '#bbb'}
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
            style={{
              boxShadow: isDark
                ? '2px 2px 4px rgba(0,0,0,0.3)'
                : '2px 2px 4px rgba(0,0,0,0.15)',
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
