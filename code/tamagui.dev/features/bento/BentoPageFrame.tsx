import { YStack } from 'tamagui'

export const BentoPageFrame = ({
  children,
  simpler,
}: { children: any; simpler?: boolean }) => {
  return (
    <>
      <YStack maxWidth="100%" paddingTop={simpler ? 0 : '$2'}>
        {children}
      </YStack>
    </>
  )
}
