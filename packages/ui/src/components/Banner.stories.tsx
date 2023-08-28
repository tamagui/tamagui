import { Meta, StoryObj } from '@storybook/react'
import { H4, Paragraph } from 'tamagui'
import { Banner } from './Banner'

const meta: Meta<typeof Banner> = {
  title: 'ui/Banner',
  parameters: { layout: 'centered' },
  component: Banner,
}

type Story = StoryObj<typeof Banner>

export const Basic: Story = {
  args: {
    children: (
      <>
        <H4>Call To Action!</H4>
        <Paragraph size="$2" mt="$1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos optio vero, iste minima iure
          id sapiente incidunt eveniet impedit corrupti sequi suscipit.
        </Paragraph>
      </>
    ),
  },
}

export default meta
