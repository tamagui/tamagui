import {
  GetProps,
  Stack,
  StackProps,
  TamaguiElement,
  composeEventHandlers,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { PropsWithChildren, cloneElement, forwardRef } from 'react'

const FORM_NAME = 'Form'

export const FormFrame = styled(Stack, {
  name: FORM_NAME,
  tag: 'form',
})

export type FormFrameProps = GetProps<typeof FormFrame> & {
  onSubmit: () => void
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopeForm?: Scope }
const [createFormContext] = createContextScope(FORM_NAME)

type FormContextValue = {
  onSubmit: () => unknown
}

export const [FormProvider, useFormContext] =
  createFormContext<FormContextValue>(FORM_NAME)

export type FormProps = FormFrameProps

/* -------------------------------------------------------------------------------------------------
 * FormTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'FormTrigger'

const FormTriggerFrame = styled(Stack, {
  name: TRIGGER_NAME,
})

export interface FormTriggerProps extends StackProps {}

export const FormTrigger = FormTriggerFrame.styleable(
  (props: ScopedProps<FormTriggerProps>, forwardedRef) => {
    const { __scopeForm, children, ...triggerProps } = props
    const context = useFormContext(TRIGGER_NAME, __scopeForm)

    return (
      <FormTriggerFrame
        tag="button"
        {...triggerProps}
        children={
          triggerProps.asChild
            ? cloneElement(children, { disabled: triggerProps.disabled })
            : children
        }
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress as any, context.onSubmit)}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Form
 * -----------------------------------------------------------------------------------------------*/

function FormComponent({
  onSubmit,
  ...props
}: PropsWithChildren<ScopedProps<FormProps>>) {
  return (
    <FormProvider scope={props.__scopeForm} onSubmit={onSubmit}>
      <FormFrame {...props} onSubmit={((e: any) => e.preventDefault()) as any} />
    </FormProvider>
  )
}

export const Form = withStaticProperties(FormFrame.extractable(FormComponent), {
  Trigger: FormTrigger,
})
