import { Meta, StoryObj } from '@storybook/react'
import { FormProvider, useForm } from 'react-hook-form'
import { Form } from 'tamagui'
import { SubmitButton } from './SubmitButton'

const meta: Meta<typeof SubmitButton> = {
  title: 'ui/SubmitButton',
  parameters: { layout: 'centered' },
  component: SubmitButton,
  render: function WrappedInForm(props) {
    const form = useForm({})
    return (
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit(async () => {
            await new Promise<void>((res) => setTimeout(() => res(), 2000))
          })}
        >
          <Form.Trigger>
            <SubmitButton {...props}>Submit</SubmitButton>
          </Form.Trigger>
        </Form>
      </FormProvider>
    )
  },
}

type Story = StoryObj<typeof SubmitButton>

export const Basic: Story = {
  args: {},
}

export default meta
