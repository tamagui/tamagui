import { memo } from 'react'

import { SponsorButton } from './SponsorButton'

export const MailingListSignup = memo(() => {
  return <SponsorButton />

  // return (
  //   <XStack
  //     borderWidth={1}
  //     borderColor="$borderColor"
  //     px="$7"
  //     pl="$6"
  //     height={48}
  //     ai="center"
  //     als="center"
  //     elevation="$2"
  //     bg="$background"
  //     br="$10"
  //   >
  //     <Input
  //       bc="transparent"
  //       borderWidth={0}
  //       w={200}
  //       placeholder="Signup for the newsletter"
  //       p={0}
  //       focusStyle={{
  //         borderWidth: 0,
  //       }}
  //     />
  //     <Spacer size="$6" />
  //     <TooltipSimple label="Signup for occasional updates">
  //       <Button
  //         accessibilityLabel="Signup to the mailing list"
  //         size="$3"
  //         borderRadius="$8"
  //         mr="$-6"
  //         x={-1}
  //         icon={Mail}
  //         // onPress={onCopy}
  //       />
  //     </TooltipSimple>
  //   </XStack>
  // )
})
