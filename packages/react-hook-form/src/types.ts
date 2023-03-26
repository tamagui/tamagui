import {
  Checkbox,
  CheckboxProps,
  InputProps,
  RadioGroup,
  RadioGroupProps,
  Select,
  SelectProps,
  Slider,
  SliderProps,
  Switch,
  SwitchProps,
  TextAreaProps,
  Form,
  FormProps as FormDefaultProps
} from '@tamagui/tamagui/types'
import { MutableRefObject } from 'react'
import { ControllerProps, FieldPath, FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form'

import { MessageProps } from './Message'
import { ValueProps } from './Value'
import { withController } from './withController'

export type FRef<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues>

export type FormProps<TFieldValues extends FieldValues = FieldValues> =
  UseFormProps<TFieldValues> &
    Omit<FormDefaultProps, 'onSubmit'> & {
      onSubmit: SubmitHandler<TFieldValues>
      fRef?: MutableRefObject<FRef<TFieldValues> | null>
    }

type ExtractStaticProps<El> = Omit<El, '$$typeof'>
type ExtractWithController<
  TProps,
  TFieldValues extends FieldValues = FieldValues
> = ReturnType<typeof withController<TProps, TFieldValues>>

export type StaticProps<TFieldValues extends FieldValues = FieldValues> = {
  Input: ExtractWithController<InputProps, TFieldValues>
  Checkbox: ExtractWithController<CheckboxProps, TFieldValues> &
    ExtractStaticProps<typeof Checkbox>
  RadioGroup: ExtractWithController<RadioGroupProps, TFieldValues> &
    ExtractStaticProps<typeof RadioGroup>
  Select: ExtractWithController<SelectProps, TFieldValues> & ExtractStaticProps<typeof Select>
  Slider: ExtractWithController<SliderProps, TFieldValues> & ExtractStaticProps<typeof Slider>
  Switch: ExtractWithController<SwitchProps, TFieldValues> & ExtractStaticProps<typeof Switch>
  TextArea: ExtractWithController<TextAreaProps, TFieldValues>
  Trigger: typeof Form.Trigger
  Message: ExtractWithController<MessageProps, TFieldValues>
  Value: ExtractWithController<ValueProps, TFieldValues>
}

export type WithControllerProps<
  TProps,
  TFieldValues extends FieldValues = FieldValues
> = Omit<TProps, 'name'> &
  Omit<ControllerProps<TFieldValues, FieldPath<TFieldValues>>, 'render' | 'control'>