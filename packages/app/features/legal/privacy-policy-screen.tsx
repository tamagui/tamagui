import { H1, Paragraph, YStack, isWeb } from '@my/ui'

export const PrivacyPolicyScreen = () => {
  return (
    <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>Privacy Policy</H1>}
      <Paragraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quidem neque maxime
        soluta nostrum unde eligendi, culpa qui exercitationem modi quasi debitis voluptatibus,
        deleniti porro! Nihil magni dicta neque aliquid.
      </Paragraph>

      <Paragraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quidem neque maxime
        soluta nostrum unde eligendi, culpa qui exercitationem modi quasi debitis voluptatibus,
        deleniti porro! Nihil magni dicta neque aliquid.
      </Paragraph>

      <Paragraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quidem neque maxime
        soluta nostrum unde eligendi, culpa qui exercitationem modi quasi debitis voluptatibus,
        deleniti porro! Nihil magni dicta neque aliquid.
      </Paragraph>
    </YStack>
  )
}
