import * as React from 'react'
import {
  Button,
  Field,
  FieldStyledContext,
  Form,
  Input,
  Paragraph,
  styled,
  YStack,
} from 'tamagui'

const DemoField = styled(Field, {
  gap: '$2',
})

const DemoLabel = styled(Field.Label, {
  color: '$color11',
  fontWeight: '500',
})

const DemoDescription = styled(Field.Description, {
  color: '$color9',
  fontSize: '$2',
})

const DemoError = styled(Field.Error, {
  color: '$red10',
  fontSize: '$2',
})

const DemoInput = styled(Input, {
  context: FieldStyledContext,

  variants: {
    valid: {
      true: {},
    },
    invalid: {
      true: {
        borderColor: '$red9',
      },
    },
    touched: {
      true: {},
    },
    dirty: {
      true: {},
    },
    filled: {
      true: {},
    },
    focused: {
      true: {},
    },
  } as const,
})

export function FieldInput(props: React.ComponentProps<typeof DemoInput>) {
  const field = Field.useFieldControl()
  const controlRef = React.useRef<any>(null)
  const valueRef = React.useRef(props.value ?? props.defaultValue ?? '')

  React.useEffect(() => {
    return field.registerControl({
      id: field.ariaProps.id,
      controlRef,
      inputRef: controlRef,
      getValue: () => valueRef.current,
      required: props.required,
      disabled: props.disabled,
    })
  }, [field.ariaProps.id, field.registerControl, props.disabled, props.required])

  return (
    <DemoInput
      {...props}
      {...field.ariaProps}
      {...field.dataProps}
      ref={controlRef}
      name={field.name}
      disabled={field.disabled || props.disabled}
      onFocus={(event) => {
        field.onFocus()
        props.onFocus?.(event)
      }}
      onBlur={(event) => {
        field.onBlur(valueRef.current)
        props.onBlur?.(event)
      }}
      onChange={(event) => {
        valueRef.current = event.target.value
        field.onChange(event.target.value)
        props.onChange?.(event)
      }}
    />
  )
}

export function FieldDemo() {
  const [status, setStatus] = React.useState('Fill out the form')

  return (
    <Form
      width={360}
      maxW="90%"
      gap="$4"
      p="$5"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$7"
      bg="$color2"
      boxShadow="0 2px 3px rgba(0, 0, 0, 0.06), 0 14px 30px rgba(0, 0, 0, 0.10), 0 36px 72px rgba(0, 0, 0, 0.12)"
      onSubmit={(values) => {
        setStatus(`Welcome, ${String(values.name)}`)
      }}
    >
      <DemoField name="name">
        <DemoLabel>Name</DemoLabel>
        <FieldInput placeholder="Ada Lovelace" required />
        <DemoDescription>This is shown on your profile.</DemoDescription>
        <DemoError />
      </DemoField>

      <DemoField
        name="email"
        validationMode="onBlur"
        validate={(value) =>
          String(value).endsWith('@example.com') ? null : 'Use an @example.com address'
        }
      >
        <DemoLabel>Email</DemoLabel>
        <FieldInput type="email" placeholder="ada@example.com" required />
        <DemoError />
      </DemoField>

      <Form.Trigger asChild>
        <Button
          self="flex-end"
          height={40}
          px="$5"
          rounded="$5"
          bg="$color12"
          color="$color1"
          fontSize="$2"
          fontWeight="500"
          hoverStyle={{ bg: '$color11' }}
        >
          Create account
        </Button>
      </Form.Trigger>

      <Paragraph color="$color9" size="$2">
        {status}
      </Paragraph>
    </Form>
  )
}
