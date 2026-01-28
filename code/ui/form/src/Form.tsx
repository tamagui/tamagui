import type { ViewProps } from '@tamagui/core'
import { View, createStyledContext, styled } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'

const FORM_NAME = 'Form'

export const FormFrame = styled(View, {
  name: FORM_NAME,
  render: 'form',
})

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

type FormContextValue = {
  onSubmit?: () => unknown
}

export const FormContext = createStyledContext<FormContextValue>({
  onSubmit: undefined,
} as FormContextValue)

export const { useStyledContext: useFormContext, Provider: FormProvider } = FormContext

type FormExtraProps = {
  scope?: string
  onSubmit?: () => void
}
export type FormProps = ViewProps & FormExtraProps

/* -------------------------------------------------------------------------------------------------
 * FormTrigger
 * -----------------------------------------------------------------------------------------------*/

const FormTriggerFrame = styled(View, {
  name: 'FormTrigger',
})

export interface FormTriggerProps extends ViewProps {
  scope?: string
}

export const FormTrigger = FormTriggerFrame.styleable<FormTriggerProps>(
  (props, forwardedRef) => {
    const { scope, children, onPress, ...triggerProps } = props
    const context = useFormContext(scope)

    return (
      <FormTriggerFrame
        render={<button type="submit" />}
        {...triggerProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(onPress, context.onSubmit)}
      >
        {children}
      </FormTriggerFrame>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Form
 * -----------------------------------------------------------------------------------------------*/

const FormComponent = FormFrame.styleable<FormExtraProps>(function Form(
  { scope, onSubmit, ...props },
  ref
) {
  return (
    <FormProvider scope={scope} onSubmit={onSubmit}>
      <FormFrame
        ref={ref}
        {...(props as any)}
        onSubmit={(e: any) => {
          e.preventDefault()
          onSubmit?.()
        }}
      />
    </FormProvider>
  )
})

export const Form = withStaticProperties(FormComponent, {
  Trigger: FormTrigger,
})
