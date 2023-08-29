import { H2, Paragraph, SubmitButton, Theme, YStack, isWeb } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { z } from 'zod'

export const CreateScreen = () => {
  return (
    <SchemaForm
      onSubmit={(values) => {
        console.log('submit', values)
        console.log('submit')
      }}
      schema={z.object({
        title: formFields.text.min(10).describe('Name // Afternoon Top Rope 5.9+'),
        certified: formFields.boolean.describe('I am lead / top rope certified'),
      })}
      defaultValues={{
        title: '',
        certified: false,
      }}
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Submit</SubmitButton>
        </Theme>
      )}
    >
      {(fields) => (
        <>
          <YStack gap="$2" py="$4" pb="$8">
            {isWeb && <H2 ta="center">Post a Climb</H2>}
            <Paragraph ta="center">Find a belayer in the community</Paragraph>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}
