import { Button, ButtonFrame } from '@tamagui/button'
import { Check } from '@tamagui/lucide-icons'
import { FRef, createForm, withController } from '@tamagui/react-hook-form'
import { ForwardedRef, useRef, useState } from 'react'
import { Label, SizableStack, SizableText, Stack, XGroup, XStack, styled } from 'tamagui'
import { YStack } from 'tamagui'

interface SignUpValues {
  pseudo: ''
  description: ''
  age: number[]
  theme: ''
  level: ''
  cgu: false
  prefer: "cat" | "dog" | ""
}

const ButtonThemed = styled(ButtonFrame, {
  variants: {
    selected: {
      true: {
        backgroundColor: '$backgroundHover',
      },
    },
  },
})

type CustomFieldProps = { value: string; onChange: (e: string) => void, id?: string }
const CustomField = ({ onChange, value, id }: CustomFieldProps) => {
  return (
    <XGroup id={id}>
      <XGroup.Item>
        <ButtonThemed flex={1} selected={value === 'dog'} onPress={() => onChange('dog')}>
          Dog
        </ButtonThemed>
      </XGroup.Item>
      <XGroup.Item>
        <ButtonThemed flex={1} selected={value === 'cat'} onPress={() => onChange('cat')}>
          Cat
        </ButtonThemed>
      </XGroup.Item>
    </XGroup>
  )
}

const CustomFieldControlled = withController<CustomFieldProps, SignUpValues>(CustomField)

const Form = createForm<SignUpValues>()

export const FormHookFormDemo = () => {
  const [values, setValues] = useState<SignUpValues>()
  const formRef = useRef<FRef<SignUpValues>>(null)

  return (
    <Form
      fRef={formRef}
      onSubmit={(values) => {
        setValues(values)
        formRef.current?.reset()
      }}
      space="$4"
      defaultValues={{ pseudo: '', description: '', age: [], prefer: '' }}
    >
      <YStack>
        <Label htmlFor="pseudo">Pseudo</Label>
        <Form.Input
          id="pseudo"
          name="pseudo"
          rules={{
            required: 'Field required',
            minLength: { value: 3, message: 'Must be greater than 3 characters' },
            maxLength: { value: 6, message: 'Must be less than 6 characters' },
          }}
        />
        <Form.Message name="pseudo" />
      </YStack>

      <YStack>
        <Label htmlFor="description">Description</Label>
        <Form.TextArea id="description" name="description" />
        <Form.Message name="description" />
      </YStack>

      <Form.Field name="age">
        <XStack alignItems="center" justifyContent="space-between">
          <Label htmlFor="age">Age</Label>
          <Form.Value />
        </XStack>
        <Form.Slider
          id="age"
          max={100}
          step={1}
          rules={{ required: 'Required field' }}
          marginTop="$2"
          marginBottom="$4"
        >
          <Form.Slider.Track>
            <Form.Slider.TrackActive />
          </Form.Slider.Track>
          <Form.Slider.Thumb index={0} circular elevate />
        </Form.Slider>
        <Form.Message />
      </Form.Field>

      <YStack>
        <Label htmlFor="theme">Dark mode</Label>
        <Form.Switch id="theme" name="theme">
          <Form.Switch.Thumb animation="quick" />
        </Form.Switch>
      </YStack>

      <YStack>
        <SizableText>Level</SizableText>
        <Form.RadioGroup name="level">
          <XStack space="$2" alignItems="center">
            <Form.RadioGroup.Item id="junior" value={'junior'}>
              <Form.RadioGroup.Indicator />
            </Form.RadioGroup.Item>
            <Label htmlFor="junior" height="$2">
              Junior
            </Label>
          </XStack>

          <XStack space="$2" alignItems="center">
            <Form.RadioGroup.Item id="novice" value={'novice'}>
              <Form.RadioGroup.Indicator />
            </Form.RadioGroup.Item>
            <Label htmlFor="novice" height="$2">
              Novice
            </Label>
          </XStack>
          <XStack space="$2" alignItems="center">
            <Form.RadioGroup.Item id="expert" value={'expert'}>
              <Form.RadioGroup.Indicator />
            </Form.RadioGroup.Item>
            <Label htmlFor="expert" height="$2">
              Expert
            </Label>
          </XStack>
        </Form.RadioGroup>
      </YStack>

      <YStack>
        <Label htmlFor='prefer'>What do you prefer?</Label>
        <CustomFieldControlled id="prefer" name="prefer" />
      </YStack>

      <YStack>
        <XStack alignItems="center" space="$2">
          <Form.Checkbox
            id="cgu"
            name="cgu"
            value="true"
            rules={{
              required: 'Field required',
            }}
          >
            <Form.Checkbox.Indicator>
              <Check />
            </Form.Checkbox.Indicator>
          </Form.Checkbox>
          <Label htmlFor={'cgu'} height="$2">
            Accept terms and conditions
          </Label>
        </XStack>
        <Form.Message name="cgu" />
      </YStack>

      <Form.Trigger asChild>
        <Button>Submit</Button>
      </Form.Trigger>

      {values && (
        <SizableStack
          bordered
          borderRadius="$4"
          padding="$2"
          backgroundColor="$background"
        >
          <SizableText tag="pre" whiteSpace="pre">
            {JSON.stringify(values, null, 2)}
          </SizableText>
        </SizableStack>
      )}
    </Form>
  )
}
