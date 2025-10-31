import type { StackProps, TamaguiElement } from '@tamagui/core'
import { Stack, View, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'

const FORM_NAME = 'Form'

export const FormFrame = styled(Stack, {
  name: FORM_NAME,
  tag: 'form',
})

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopeForm?: Scope }
const [createFormContext] = createContextScope(FORM_NAME)

type FormContextValue = {
  onSubmit?: () => unknown
}

export const [FormProvider, useFormContext] =
  createFormContext<FormContextValue>(FORM_NAME)

type FormExtraProps = {
  onSubmit?: () => void
}
export type FormProps = StackProps & FormExtraProps

/* -------------------------------------------------------------------------------------------------
 * FormTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'FormTrigger'

const FormTriggerFrame = styled(View, {
  name: TRIGGER_NAME,
})

export interface FormTriggerProps extends StackProps {}

export const FormTrigger = FormTriggerFrame.styleable<ScopedProps<FormTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeForm, children, onPress, ...triggerProps } = props
    const context = useFormContext(TRIGGER_NAME, __scopeForm)

    return (
      <FormTriggerFrame
        tag="button"
        {...(triggerProps as any)}
        ref={forwardedRef}
        onPress={composeEventHandlers(onPress as any, context.onSubmit)}
      >
        {children}
      </FormTriggerFrame>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Form
 * -----------------------------------------------------------------------------------------------*/

const FormComponent = FormFrame.styleable<ScopedProps<FormExtraProps>>(function Form(
  { onSubmit, ...props },
  ref
) {
  return (
    <FormProvider scope={props.__scopeForm} onSubmit={onSubmit}>
      <FormFrame
        ref={ref}
        {...(props as any)}
        onSubmit={(e: any) => e.preventDefault()}
      />
    </FormProvider>
  )
})

export const Form = withStaticProperties(FormComponent, {
  Trigger: FormTrigger,
})
