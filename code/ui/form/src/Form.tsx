import type { TamaguiEventDetails, ViewProps } from '@tamagui/core'
import { createStyledContext, createStyledHOC, isWeb, styled, View } from '@tamagui/core'
import { focusFocusable } from '@tamagui/focusable'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import * as React from 'react'

const FORM_NAME = 'Form'
const EMPTY_ERRORS: FormErrors = {}

export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange'
export type FormErrors = Record<string, string | string[]>
export type FormValues = Record<string, any>

export type FormFieldRegistration = {
  name?: string
  controlId?: string
  controlRef: React.MutableRefObject<any>
  getValue: () => unknown
  validate: () => void
  validityData: {
    state: {
      valid: boolean | null
    }
  }
}

type FormRegistryContextValue = {
  validationMode: FormValidationMode
  errors: FormErrors
  formElementRef: React.MutableRefObject<HTMLFormElement | null>
  submitAttemptedRef: React.MutableRefObject<boolean>
  clearErrors: (name?: string) => void
  getValues: () => FormValues
  registerField: (id: string, registration: FormFieldRegistration) => () => void
}

const defaultSubmitAttemptedRef = { current: false }
const defaultFormElementRef = { current: null }

export const FormRegistryContext = React.createContext<FormRegistryContextValue>({
  validationMode: 'onSubmit',
  errors: EMPTY_ERRORS,
  formElementRef: defaultFormElementRef,
  submitAttemptedRef: defaultSubmitAttemptedRef,
  clearErrors: () => {},
  getValues: () => ({}),
  registerField: () => () => {},
})

export const useFormRegistryContext = () => React.useContext(FormRegistryContext)

type FormTriggerContextValue = {
  onSubmit?: (event?: unknown) => unknown
}

export const FormContext = createStyledContext<FormTriggerContextValue>({
  onSubmit: undefined,
})

export const { useStyledContext: useFormContext, Provider: FormProvider } = FormContext

export const FormFrame = styled(View, {
  name: FORM_NAME,
  render: 'form',
})

const FormTriggerFrame = styled(View, {
  name: 'FormTrigger',
})

export interface FormTriggerProps extends ViewProps {
  scope?: string
}

export const FormTrigger = createStyledHOC(FormTriggerFrame)<FormTriggerProps>(
  (props, forwardedRef) => {
    const { scope, children, onPress, ...triggerProps } = props
    const context = useFormContext(scope)

    return (
      <FormTriggerFrame
        role="button"
        {...triggerProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(onPress, context.onSubmit as any)}
      >
        {children}
      </FormTriggerFrame>
    )
  }
)

export type FormSubmitEventDetails = TamaguiEventDetails<
  'submit' | 'trigger-press',
  unknown
>

export interface FormActions {
  validate: (fieldName?: string) => void
}

type FormExtraProps<FormValue extends FormValues = FormValues> = {
  scope?: string
  validationMode?: FormValidationMode
  errors?: FormErrors
  actionsRef?: React.RefObject<FormActions | null>
  onSubmit?: (values: FormValue, details: FormSubmitEventDetails) => void | Promise<void>
}

export type FormProps<FormValue extends FormValues = FormValues> = Omit<
  ViewProps,
  'onSubmit'
> &
  FormExtraProps<FormValue>

function hasError(errors: FormErrors, name?: string) {
  if (!name || !Object.hasOwn(errors, name)) {
    return false
  }
  const error = errors[name]
  return Array.isArray(error) ? error.length > 0 : Boolean(error)
}

const FormComponent = createStyledHOC(FormFrame)<FormExtraProps>(function Form(
  {
    scope,
    validationMode = 'onSubmit',
    errors: externalErrors,
    actionsRef,
    onSubmit,
    ...props
  },
  forwardedRef
) {
  const registryRef = React.useRef(new Map<string, FormFieldRegistration>())
  const formElementRef = React.useRef<HTMLFormElement | null>(null)
  const submittedRef = React.useRef(false)
  const submitAttemptedRef = React.useRef(false)
  const pendingSubmitDetailsRef = React.useRef<FormSubmitEventDetails | null>(null)
  const onSubmitRef = React.useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const [errors, setErrors] = React.useState<FormErrors>(externalErrors ?? EMPTY_ERRORS)
  const errorsRef = React.useRef(errors)
  errorsRef.current = errors

  React.useEffect(() => {
    const next = externalErrors ?? EMPTY_ERRORS
    errorsRef.current = next
    setErrors(next)
  }, [externalErrors])

  const registerField = React.useCallback(
    (id: string, registration: FormFieldRegistration) => {
      registryRef.current.set(id, registration)
      return () => {
        if (registryRef.current.get(id) === registration) {
          registryRef.current.delete(id)
        }
      }
    },
    []
  )

  const getValues = React.useCallback(() => {
    const values: FormValues = {}
    for (const field of registryRef.current.values()) {
      if (field.name) {
        values[field.name] = field.getValue()
      }
    }
    return values
  }, [])

  const clearErrors = React.useCallback((name?: string) => {
    if (!name || !hasError(errorsRef.current, name)) {
      return
    }
    const next = { ...errorsRef.current }
    delete next[name]
    errorsRef.current = next
    setErrors(next)
  }, [])

  const focusFirstInvalid = React.useCallback(() => {
    let hasInvalid = false

    for (const field of registryRef.current.values()) {
      if (
        !hasError(errorsRef.current, field.name) &&
        field.validityData.state.valid !== false
      ) {
        continue
      }

      hasInvalid = true
      const control = field.controlRef.current as {
        focus?: () => void
        select?: () => void
        tagName?: string
      } | null

      if (isWeb && control?.focus) {
        control.focus()
        if (control.tagName === 'INPUT' || control.tagName === 'TEXTAREA') {
          control.select?.()
        }
        return true
      }

      if (!isWeb && field.controlId) {
        focusFocusable(field.controlId)
        return true
      }

      if (control?.focus) {
        control.focus()
        return true
      }
    }

    return hasInvalid
  }, [])

  const performSubmit = React.useCallback(
    (details: FormSubmitEventDetails) => {
      submitAttemptedRef.current = true

      for (const field of registryRef.current.values()) {
        field.validate()
      }

      if (focusFirstInvalid()) {
        return
      }

      submittedRef.current = true
      void onSubmitRef.current?.(getValues(), details)
    },
    [focusFirstInvalid, getValues]
  )

  const requestSubmit = React.useCallback(
    (event?: any) => {
      event?.preventDefault?.()
      const details: FormSubmitEventDetails = {
        reason: 'trigger-press',
        event: event?.nativeEvent ?? event,
        trigger: event?.currentTarget,
      }

      if (isWeb && formElementRef.current?.requestSubmit) {
        pendingSubmitDetailsRef.current = details
        formElementRef.current.requestSubmit()
        return
      }

      performSubmit(details)
    },
    [performSubmit]
  )

  React.useEffect(() => {
    if (!submittedRef.current) {
      return
    }
    submittedRef.current = false
    focusFirstInvalid()
  }, [errors, focusFirstInvalid])

  React.useImperativeHandle(
    actionsRef,
    () => ({
      validate(fieldName?: string) {
        if (fieldName) {
          for (const field of registryRef.current.values()) {
            if (field.name === fieldName) {
              field.validate()
              return
            }
          }
          return
        }

        for (const field of registryRef.current.values()) {
          field.validate()
        }
      },
    }),
    []
  )

  const registryContext = React.useMemo<FormRegistryContextValue>(
    () => ({
      validationMode,
      errors,
      formElementRef,
      submitAttemptedRef,
      clearErrors,
      getValues,
      registerField,
    }),
    [clearErrors, errors, getValues, registerField, validationMode]
  )

  return (
    <FormRegistryContext.Provider value={registryContext}>
      <FormProvider scope={scope} onSubmit={requestSubmit}>
        <FormFrame
          {...(props as any)}
          ref={(element: any) => {
            formElementRef.current = element
            if (typeof forwardedRef === 'function') {
              forwardedRef(element)
            } else if (forwardedRef) {
              forwardedRef.current = element
            }
          }}
          noValidate
          onSubmit={(event: any) => {
            event.preventDefault()
            const pendingDetails = pendingSubmitDetailsRef.current
            pendingSubmitDetailsRef.current = null
            performSubmit(
              pendingDetails ?? {
                reason: 'submit',
                event: event.nativeEvent ?? event,
                trigger: event.nativeEvent?.submitter,
              }
            )
          }}
        />
      </FormProvider>
    </FormRegistryContext.Provider>
  )
})

type FormComponentType = <FormValue extends FormValues = FormValues>(
  props: FormProps<FormValue> & { ref?: React.Ref<any> }
) => React.ReactElement

export const Form = withStaticProperties(FormComponent as FormComponentType, {
  Trigger: FormTrigger,
})

export namespace Form {
  export type Actions = FormActions
  export type Errors = FormErrors
  export type Props<FormValue extends FormValues = FormValues> = FormProps<FormValue>
  export type SubmitEventDetails = FormSubmitEventDetails
  export type ValidationMode = FormValidationMode
  export type Values<FormValue extends FormValues = FormValues> = FormValue
}
