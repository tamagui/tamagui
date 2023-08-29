import { H2, Paragraph, SubmitButton, Theme, YStack, isWeb } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { z } from 'zod'
// Monday - Friday
// 7AM - 11PM

// Saturday + Sunday
// 9AM - 10PM

export const CreateScreen = () => {
  return (
    <SchemaForm
      onSubmit={(values) => {
        console.log('submit')
        console.log(values)
      }}
      schema={z.object({
        title: formFields.text.min(10).describe('Name // Afternoon Top Rope 5.9+'),
        // billingAddress: formFields.address.describe('Billing Address'),
        climb: formFields.climb,
        certified: formFields.boolean.describe('I am lead / top rope certified'),
      })}
      defaultValues={{
        title: '',
        certified: false,
        climb: {
          type: 'top_rope',
          location: 'Gowanus',
        },
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
            {isWeb && <H2 ta="center">New Project</H2>}
            <Paragraph ta="center">Dummy page showing a form</Paragraph>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}
