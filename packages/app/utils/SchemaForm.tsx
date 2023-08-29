import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'

import {
  AddressField,
  AddressSchema,
  ClimbSchema,
  ClimbField,
  BooleanCheckboxField,
  BooleanField,
  BooleanSwitchField,
  FieldError,
  Form,
  FormProps,
  FormWrapper,
  NumberField,
  SelectField,
  TamaguiComponent,
  TextAreaField,
  TextField,
  Theme,
} from '@my/ui'
import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const formFields = {
  text: z.string(),
  textarea: createUniqueFieldSchema(z.string(), 'textarea'),
  /**
   * input that takes number
   */
  number: z.number(),
  /**
   * adapts to native switch on native, and native checkbox on web
   */
  boolean: z.boolean(),
  /**
   * switch field on all platforms
   */
  boolean_switch: createUniqueFieldSchema(z.boolean(), 'boolean_switch'),
  /**
   * checkbox field on all platforms
   */
  boolean_checkbox: createUniqueFieldSchema(z.boolean(), 'boolean_checkbox'),
  /**
   * make sure to pass options={} to props for this
   */
  select: createUniqueFieldSchema(z.string(), 'select'),
  /**
   * example of how to handle more complex fields
   */
  address: createUniqueFieldSchema(AddressSchema, 'address'),
  climb: createUniqueFieldSchema(ClimbSchema, 'climb'),
}

// function createFormSchema<T extends ZodRawShape>(getData: (fields: typeof formFields) => T) {
//   return z.object(getData(formFields))
// }

const mapping = [
  [formFields.text, TextField] as const,
  [formFields.textarea, TextAreaField] as const,
  [formFields.number, NumberField] as const,
  [formFields.boolean, BooleanField] as const,
  [formFields.boolean_switch, BooleanSwitchField] as const,
  [formFields.boolean_checkbox, BooleanCheckboxField] as const,
  [formFields.select, SelectField] as const,
  [formFields.address, AddressField] as const,
  [formFields.climb, ClimbField] as const,
] as const

const FormComponent = (props: FormProps) => {
  return (
    <Form asChild {...props}>
      <FormWrapper tag="form">{props.children}</FormWrapper>
    </Form>
  )
}

const _SchemaForm = createTsForm(mapping, {
  FormComponent: FormComponent,
})

export const SchemaForm = forwardRef<TamaguiComponent, React.ComponentProps<typeof _SchemaForm>>(
  function SchemaFormComponent({ schema, renderAfter, ...props }) {
    return (
      <_SchemaForm
        formProps={{
          ...props.formProps,
        }}
        schema={schema}
        renderAfter={
          renderAfter
            ? (vars) => <FormWrapper.Footer>{renderAfter(vars)}</FormWrapper.Footer>
            : undefined
        }
        {...props}
      >
        {(fields, context) => (
          <FormWrapper.Body>
            {props.children ? props.children(fields, context) : Object.values(fields)}
          </FormWrapper.Body>
        )}
      </_SchemaForm>
    )
  }
) as typeof _SchemaForm

// handle manual errors (most commonly coming from a server) for cases where it's not for a specific field - make sure to wrap inside a provider first
// stopped using it cause of state issues it introduced - set the errors to specific fields instead of root for now
export const RootError = () => {
  const context = useFormContext()
  const errorMessage = context?.formState?.errors?.root?.message

  return (
    <Theme name="red">
      <FieldError message={errorMessage} />
    </Theme>
  )
}
