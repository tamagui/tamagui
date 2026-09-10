import { SizableText, Tabs, XStack, YStack } from 'tamagui'
import { Code } from './Code'
import { PACKAGE_MANAGERS } from '~/hooks/useBashCommand'
import { Image } from '@tamagui/image'
import { ScrollView } from 'react-native'

export function CodeBlockTabs({
  className,
  children,
  command,
  size,
  headerRight,
  ...rest
}) {
  const { showTabs, transformedCommand, selectedPackageManager, setPackageManager } =
    command
  const codeLineHeight: string = typeof size === 'number' ? `${size}px` : (size ?? '4')

  const codeContent = (
    <ScrollView
      style={{ width: '100%' }}
      contentContainerStyle={{
        minWidth: '100%',
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Code
        p="4"
        bg="transparent"
        flex={1}
        lineHeight={codeLineHeight}
        {...(showTabs && {
          whiteSpace: 'nowrap',
        })}
        {...rest}
        className={className}
        size={size ?? '4'}
      >
        {showTabs ? transformedCommand : children}
      </Code>
    </ScrollView>
  )

  return (
    <>
      {showTabs ? (
        <Tabs
          activationMode="manual"
          orientation="horizontal"
          size="4"
          rounded="4"
          group
          mt={1}
          value={selectedPackageManager}
          onPress={(e) => e.stopPropagation()}
          onValueChange={setPackageManager}
        >
          <YStack width="100%">
            {/* one row: the pickers sit on the same line as the copy button
                rather than stacking a second header under the title row */}
            <XStack items="center" gap="2" pl="2" pr="3" py="2">
              <Tabs.List loop={false} aria-label="package manager" gap="1">
                <>
                  {PACKAGE_MANAGERS.map((pkgManager) => (
                    <Tab
                      key={pkgManager}
                      active={selectedPackageManager === pkgManager}
                      pkgManager={pkgManager}
                    />
                  ))}
                </>
              </Tabs.List>
              {headerRight && <XStack ml="auto">{headerRight}</XStack>}
            </XStack>

            <Tabs.Content value={selectedPackageManager} forceMount>
              {codeContent}
            </Tabs.Content>
          </YStack>
        </Tabs>
      ) : (
        codeContent
      )}
    </>
  )
}

/**
 * A package manager chip: level with the code block's copy button, and marked
 * by a solid `color1` pill against the block's `color2` field.
 */
function Tab({
  active,
  pkgManager,
  logo,
}: {
  active?: boolean
  pkgManager: string
  logo?: string
}) {
  const imageName = logo ?? pkgManager
  return (
    <Tabs.Tab
      height={28}
      minH={28}
      pl="2"
      pr="2-5"
      py={0}
      gap="1-5"
      items="center"
      bg={active ? 'color1' : 'transparent'}
      opacity={active ? 1 : 0.5}
      rounded="4"
      cursor="pointer"
      value={pkgManager}
    >
      <XStack gap="1-5" items="center" justify="center">
        <Image
          width={16}
          height={16}
          scale={imageName === 'pnpm' ? 0.7 : 0.8}
          src={`/logos/${imageName}.svg`}
        />
        <SizableText y={-0.5} color={active ? 'color12' : 'color11'} size="2">
          {pkgManager}
        </SizableText>
      </XStack>
    </Tabs.Tab>
  )
}
