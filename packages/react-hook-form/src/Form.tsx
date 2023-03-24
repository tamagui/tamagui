import { Form as FormDefault, FormProps as FormDefaultProps } from '@tamagui/form'
import { withStaticProperties } from '@tamagui/web'
import { PropsWithChildren } from 'react'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  useForm,
} from 'react-hook-form'

import { CheckboxControlled } from './Checkbox'
import { InputControlled } from './Input'
import { Message } from './Message'
import { RadioGroupControlled } from './RadioGroup'
import { SelectControlled } from './Select'
import { SliderControlled } from './Slider'
import { SwitchControlled } from './Switch'
import { TextAreaControlled } from './Textarea'

export type FormProps = UseFormProps &
  Omit<FormDefaultProps, 'onSubmit'> & { onSubmit: SubmitHandler<FieldValues> }

export const Form = withStaticProperties(
  ({
    children,
    onSubmit,
    mode,
    reValidateMode,
    defaultValues,
    values,
    resetOptions,
    resolver,
    context,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    criteriaMode,
    delayError,
    ...formProps
  }: PropsWithChildren<FormProps>) => {
    const form = useForm({
      mode,
      reValidateMode,
      defaultValues,
      values,
      resetOptions,
      resolver,
      context,
      shouldFocusError,
      shouldUnregister,
      shouldUseNativeValidation,
      criteriaMode,
      delayError,
    })
    console.log(formProps)
    return (
      <FormProvider {...form}>
        <FormDefault
          onSubmit={form.handleSubmit(onSubmit)}
          {...formProps}
          children={children}
        />
      </FormProvider>
    )
  },
  {
    Checkbox: CheckboxControlled,
    Input: InputControlled,
    RadioGroup: RadioGroupControlled,
    Select: SelectControlled,
    Slider: SliderControlled,
    Switch: SwitchControlled,
    TextArea: TextAreaControlled,
    Trigger: FormDefault.Trigger,
    Message,
  }
)
