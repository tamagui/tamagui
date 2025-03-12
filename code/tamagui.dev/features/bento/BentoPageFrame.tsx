import { YStack } from 'tamagui'

export const BentoPageFrame = ({
  children,
  simpler,
}: { children: any; simpler?: boolean }) => {
  return (
    <>
      <YStack f={1} pt={simpler ? 0 : '$2'}>
        {children}
      </YStack>
    </>
  )
}
