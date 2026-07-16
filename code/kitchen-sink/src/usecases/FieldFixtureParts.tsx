import { Field, FieldStyledContext, Input, styled } from 'tamagui'
import * as React from 'react'

export const FixtureField = styled(Field, {
  gap: '$2',
})

export const FixtureFieldLabel = styled(Field.Label, {
  fontWeight: '600',
  color: '$color11',
})

export const FixtureFieldDescription = styled(Field.Description, {
  color: '$color10',
  fontSize: '$2',
})

export const FixtureFieldError = styled(Field.Error, {
  color: '$red10',
  fontSize: '$2',
})

const FixtureInputFrame = styled(Input, {
  context: FieldStyledContext,
  backgroundColor: '$background',

  variants: {
    invalid: {
      true: {
        borderColor: '$red9',
      },
    },
  } as const,
})

type FixtureFieldInputProps = React.ComponentProps<typeof FixtureInputFrame>

function setRef(ref: React.Ref<any> | undefined, value: any) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    const mutableRef = ref as React.MutableRefObject<any>
    mutableRef.current = value
  }
}

export function FixtureFieldInput(props: FixtureFieldInputProps) {
  const field = Field.useFieldControl()
  const {
    ref: forwardedRef,
    disabled,
    name,
    onBlur,
    onChange,
    onChangeText,
    onFocus,
    required,
    value,
    defaultValue,
    ...inputProps
  } = props as FixtureFieldInputProps & { ref?: React.Ref<any> }
  const controlRef = React.useRef<any>(null)
  const valueRef = React.useRef(value ?? defaultValue ?? '')

  React.useEffect(() => {
    if (value !== undefined) {
      valueRef.current = value
    }
  }, [value])

  React.useEffect(() => {
    return field.registerControl({
      id: field.ariaProps.id,
      name,
      controlRef,
      inputRef: controlRef,
      getValue: () => valueRef.current,
      required,
      disabled,
    })
  }, [disabled, field.ariaProps.id, field.registerControl, name, required])

  return (
    <FixtureInputFrame
      {...inputProps}
      {...field.ariaProps}
      {...field.dataProps}
      ref={(element: any) => {
        controlRef.current = element
        setRef(forwardedRef, element)
      }}
      name={field.name ?? name}
      disabled={field.disabled || disabled}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onFocus={(event: any) => {
        field.onFocus()
        onFocus?.(event)
      }}
      onBlur={(event: any) => {
        field.onBlur(valueRef.current)
        onBlur?.(event)
      }}
      onChange={(event: any) => {
        const nextValue = event?.target?.value ?? event?.nativeEvent?.text ?? ''
        valueRef.current = nextValue
        field.onChange(nextValue)
        onChangeText?.(nextValue)
        onChange?.(event)
      }}
    />
  )
}
