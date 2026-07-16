import type { GetProps } from '@tamagui/core'
import {
  createStyledHOC,
  isWeb,
  styled,
  Text,
  useIsomorphicLayoutEffect,
  View,
  withStaticProperties,
} from '@tamagui/core'
import type { FormFieldRegistration } from '@tamagui/form'
import { useFormRegistryContext } from '@tamagui/form'
import { focusFocusable } from '@tamagui/focusable'
import * as React from 'react'
import {
  FieldControlContext,
  FieldStateContext,
  FieldStyledContext,
  useFieldControl,
  useFieldState,
} from './FieldContext'
import type {
  FieldControlContextValue,
  FieldControlRegistration,
  FieldDataProps,
  FieldState,
  FieldStyleState,
  FieldValidationMode,
  FieldValidator,
  FieldValidityData,
  FieldValidityState,
} from './types'
import {
  createDefaultValidityState,
  createValidationCommitter,
  getValidationResult,
  isFilled,
  normalizeNativeValidity,
  shouldValidateOnChange,
} from './validation'

const fieldStateVariants = {
  valid: { true: {} },
  invalid: { true: {} },
  touched: { true: {} },
  dirty: { true: {} },
  filled: { true: {} },
  focused: { true: {} },
  disabled: { true: {} },
} as const

export const FieldFrame = styled(View, {
  name: 'Field',
  context: FieldStyledContext,
  variants: fieldStateVariants,
})

export const FieldLabelFrame = styled(Text, {
  name: 'FieldLabel',
  render: 'label',
  context: FieldStyledContext,
  variants: fieldStateVariants,
})

export const FieldDescriptionFrame = styled(Text, {
  name: 'FieldDescription',
  render: 'p',
  context: FieldStyledContext,
  variants: fieldStateVariants,
})

export const FieldErrorFrame = styled(Text, {
  name: 'FieldError',
  render: 'span',
  context: FieldStyledContext,
  variants: fieldStateVariants,
})

export const FieldItemFrame = styled(View, {
  name: 'FieldItem',
  context: FieldStyledContext,
  variants: fieldStateVariants,
})

const validityKeys: Array<Exclude<keyof FieldValidityState, 'valid'>> = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
]

type AssociationContextValue = {
  controlId: string
  labelId?: string
  labelText?: string
  messageIds: string[]
  messageTexts: string[]
  registerControlId: (id: string) => () => void
  registerLabel: (id: string, text?: string) => () => void
  registerMessage: (id: string, text?: string) => () => void
}

const AssociationContext = React.createContext<AssociationContextValue | null>(null)
const FieldRootContext = React.createContext<FieldRootContextValue | null>(null)
const FieldItemContext = React.createContext(false)

type FieldRootContextValue = {
  state: FieldState
  validityData: FieldValidityData
  name?: string
  rootDisabled: boolean
  registerControl: (
    registration: FieldControlRegistration,
    reportDisabled?: boolean
  ) => () => void
  onFocus: () => void
  onBlur: (value?: unknown) => void
  onChange: (value: unknown) => void
  onDisabledChange: (disabled: boolean) => void
}

function getText(children: React.ReactNode): string | undefined {
  const text: string[] = []

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text.push(String(child))
      return
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
      const nested = getText(child.props.children)
      if (nested) {
        text.push(nested)
      }
    }
  })

  return text.join(' ').trim() || undefined
}

function useAssociation(prefix: string, parent?: AssociationContextValue | null) {
  const defaultControlId = `${prefix}-control`
  const controlIdsRef = React.useRef(new Map<symbol, string>())
  const labelsRef = React.useRef(new Map<symbol, { id: string; text?: string }>())
  const messagesRef = React.useRef(new Map<symbol, { id: string; text?: string }>())
  const [, update] = React.useReducer((value) => value + 1, 0)

  const registerControlId = React.useCallback((id: string) => {
    const source = Symbol()
    controlIdsRef.current.set(source, id)
    update()
    return () => {
      controlIdsRef.current.delete(source)
      update()
    }
  }, [])

  const registerLabel = React.useCallback((id: string, text?: string) => {
    const source = Symbol()
    labelsRef.current.set(source, { id, text })
    update()
    return () => {
      labelsRef.current.delete(source)
      update()
    }
  }, [])

  const registerMessage = React.useCallback((id: string, text?: string) => {
    const source = Symbol()
    messagesRef.current.set(source, { id, text })
    update()
    return () => {
      messagesRef.current.delete(source)
      update()
    }
  }, [])

  const controlId = Array.from(controlIdsRef.current.values()).at(-1) ?? defaultControlId
  const label = Array.from(labelsRef.current.values()).at(-1)
  const messages = Array.from(messagesRef.current.values())

  return React.useMemo<AssociationContextValue>(
    () => ({
      controlId,
      labelId: [parent?.labelId, label?.id].filter(Boolean).join(' ') || undefined,
      labelText: [parent?.labelText, label?.text].filter(Boolean).join(' ') || undefined,
      messageIds: Array.from(
        new Set([...(parent?.messageIds ?? []), ...messages.map((message) => message.id)])
      ),
      messageTexts: [
        ...(parent?.messageTexts ?? []),
        ...messages.flatMap((message) => (message.text ? [message.text] : [])),
      ],
      registerControlId,
      registerLabel,
      registerMessage,
    }),
    [
      controlId,
      label?.id,
      label?.text,
      messages,
      parent?.labelId,
      parent?.labelText,
      parent?.messageIds,
      parent?.messageTexts,
      registerControlId,
      registerLabel,
      registerMessage,
    ]
  )
}

function getStyleState(state: FieldState, disabled = state.disabled): FieldStyleState {
  return {
    valid: state.valid === true,
    invalid: state.valid === false,
    touched: state.touched,
    dirty: state.dirty,
    filled: state.filled,
    focused: state.focused,
    disabled,
  }
}

function getDataProps(state: FieldState, disabled = state.disabled): FieldDataProps {
  if (!isWeb) {
    return {}
  }

  return {
    'data-valid': state.valid === true ? '' : undefined,
    'data-invalid': state.valid === false ? '' : undefined,
    'data-touched': state.touched ? '' : undefined,
    'data-dirty': state.dirty ? '' : undefined,
    'data-filled': state.filled ? '' : undefined,
    'data-focused': state.focused ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
  }
}

function useControlContext(
  root: FieldRootContextValue,
  association: AssociationContextValue,
  itemDisabled = false,
  isItem = false
) {
  const disabled = root.state.disabled || itemDisabled
  const controlIdRef = React.useRef(association.controlId)
  const registrationDisabledRef = React.useRef(root.rootDisabled || itemDisabled)
  controlIdRef.current = association.controlId
  registrationDisabledRef.current = root.rootDisabled || itemDisabled
  const registerControl = React.useCallback(
    (registration: FieldControlRegistration) => {
      const id = registration.id ?? controlIdRef.current
      const unregisterId = association.registerControlId(id)
      const nextRegistration = {
        ...registration,
        id,
        get disabled() {
          return registrationDisabledRef.current || registration.disabled
        },
      }
      const unregisterControl = root.registerControl(nextRegistration, !isItem)

      return () => {
        unregisterControl()
        unregisterId()
      }
    },
    [association.registerControlId, isItem, root.registerControl]
  )

  return React.useMemo<FieldControlContextValue>(
    () => ({
      name: root.name,
      disabled,
      ariaProps: {
        id: association.controlId,
        'aria-labelledby': association.labelId,
        'aria-describedby': association.messageIds.join(' ') || undefined,
        'aria-invalid': root.state.valid === false ? true : undefined,
        accessibilityLabel: association.labelText,
        accessibilityHint: association.messageTexts.join(' ') || undefined,
        accessibilityState: disabled ? { disabled: true } : undefined,
      },
      dataProps: getDataProps(root.state, disabled),
      onFocus: root.onFocus,
      onBlur: root.onBlur,
      onChange: root.onChange,
      onDisabledChange: isItem ? () => {} : root.onDisabledChange,
      registerControl,
    }),
    [
      association.controlId,
      association.labelId,
      association.labelText,
      association.messageIds,
      association.messageTexts,
      disabled,
      isItem,
      registerControl,
      root.name,
      root.onBlur,
      root.onChange,
      root.onDisabledChange,
      root.onFocus,
      root.state,
    ]
  )
}

function getRegistrationValue(registration?: FieldControlRegistration) {
  return registration?.getValue ? registration.getValue() : registration?.value
}

function getInput(registration: FieldControlRegistration) {
  return registration.inputRef?.current
}

function canValidateInput(input: any): input is {
  disabled?: boolean
  validity: ValidityState
  validationMessage: string
  setCustomValidity: (message: string) => void
} {
  return Boolean(
    input &&
    input.validity &&
    typeof input.setCustomValidity === 'function' &&
    !input.disabled
  )
}

function isEligibleInput(input: any, formElement: HTMLFormElement | null) {
  if (input.matches?.(':disabled')) {
    return false
  }
  if (!formElement || input.form === formElement) {
    return true
  }
  return input.form === null && !input.hasAttribute?.('form')
}

function isEligibleRegistration(
  registration: FieldControlRegistration,
  formElement: HTMLFormElement | null
) {
  if (registration.disabled) {
    return false
  }
  const input = getInput(registration)
  return !canValidateInput(input) || isEligibleInput(input, formElement)
}

function getNativeValidity(input: any, showValueMissing: boolean) {
  const state = createDefaultValidityState(true)

  for (const key of validityKeys) {
    state[key] = Boolean(input.validity[key])
  }
  state.valid = Boolean(input.validity.valid)

  return normalizeNativeValidity(state, showValueMissing)
}

function hasValidityError(state: FieldValidityState) {
  return state.valid === false
}

function hasError(errors: string | string[] | undefined) {
  return Array.isArray(errors) ? errors.length > 0 : Boolean(errors)
}

type FieldExtraProps = {
  name?: string
  disabled?: boolean
  invalid?: boolean
  validate?: FieldValidator
  validationMode?: FieldValidationMode
  validationDebounceTime?: number
}

export type FieldProps = Omit<GetProps<typeof FieldFrame>, keyof FieldExtraProps> &
  FieldExtraProps

const FieldComponent = createStyledHOC(FieldFrame)<FieldExtraProps>(function Field(
  {
    name: nameProp,
    disabled: disabledProp = false,
    invalid = false,
    validate,
    validationMode: validationModeProp,
    validationDebounceTime = 0,
    children,
    ...fieldProps
  },
  forwardedRef
) {
  const form = useFormRegistryContext()
  const {
    clearErrors: clearFormErrors,
    errors: formErrors,
    formElementRef,
    getValues: getFormValues,
    registerField: registerFormField,
    submitAttemptedRef,
    validationMode: formValidationMode,
  } = form
  const reactId = React.useId().replace(/:/g, '')
  const association = useAssociation(`field-${reactId}`)
  const fieldId = `field-${reactId}`
  const controlsRef = React.useRef(new Map<symbol, FieldControlRegistration>())
  const reportsDisabledRef = React.useRef(
    new WeakMap<FieldControlRegistration, boolean>()
  )
  const activeControlRef = React.useRef<FieldControlRegistration | undefined>(undefined)
  const activeValidationControlRef = React.useRef<FieldControlRegistration | undefined>(
    undefined
  )
  const formControlRef = React.useRef<any>(null)
  const formValidityDataRef = React.useRef({
    state: {
      valid: null as boolean | null,
    },
  })
  const initialValueRef = React.useRef<unknown>(undefined)
  const hasInitialValueRef = React.useRef(false)
  const valueRef = React.useRef<unknown>(undefined)
  const dirtyRef = React.useRef(false)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [registeredName, setRegisteredName] = React.useState<string>()
  const [controlDisabled, setControlDisabled] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const [dirty, setDirty] = React.useState(false)
  const [filled, setFilled] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState<unknown>(undefined)
  const [validityData, setValidityData] = React.useState<FieldValidityData>({
    state: createDefaultValidityState(),
    error: '',
    errors: [],
    value: undefined,
    initialValue: undefined,
  })
  const validityDataRef = React.useRef(validityData)
  validityDataRef.current = validityData
  const effectiveName = nameProp ?? registeredName
  const effectiveNameRef = React.useRef(effectiveName)
  effectiveNameRef.current = effectiveName
  const disabled = disabledProp || controlDisabled
  const disabledRef = React.useRef(disabled)
  disabledRef.current = disabled
  const validationMode = validationModeProp ?? formValidationMode
  const externalError =
    effectiveName && Object.hasOwn(formErrors, effectiveName)
      ? formErrors[effectiveName]
      : undefined
  const externalErrors = Array.isArray(externalError)
    ? externalError
    : externalError
      ? [externalError]
      : []
  const externallyInvalid = invalid || hasError(externalError)
  const externallyInvalidRef = React.useRef(externallyInvalid)
  externallyInvalidRef.current = externallyInvalid
  const valid = externallyInvalid ? false : disabled ? null : validityData.state.valid
  formValidityDataRef.current.state.valid = disabled
    ? null
    : externallyInvalid
      ? false
      : validityData.state.valid
  const errors = externalErrors.length ? externalErrors : validityData.errors
  const error = errors[0] ?? ''

  const state = React.useMemo<FieldState>(
    () => ({
      name: effectiveName,
      value: currentValue,
      error,
      errors,
      validity: validityData.state,
      valid,
      touched,
      dirty,
      filled,
      focused,
      disabled,
    }),
    [
      dirty,
      disabled,
      currentValue,
      effectiveName,
      error,
      errors,
      filled,
      focused,
      touched,
      valid,
      validityData.state,
    ]
  )
  const stateRef = React.useRef(state)
  stateRef.current = state

  const publishValidityRef = React.useRef<(data: FieldValidityData) => void>(() => {})
  const validationCommitterRef = React.useRef<
    ReturnType<typeof createValidationCommitter<FieldValidityData>> | undefined
  >(undefined)
  if (!validationCommitterRef.current) {
    validationCommitterRef.current = createValidationCommitter((data) => {
      publishValidityRef.current(data)
    })
  }

  const getActiveControl = React.useCallback(() => {
    let active: FieldControlRegistration | undefined
    for (const registration of controlsRef.current.values()) {
      if (!isEligibleRegistration(registration, formElementRef.current)) {
        continue
      }
      active = registration
    }
    return active
  }, [formElementRef])

  const syncControlDisabled = React.useCallback(() => {
    let nextDisabled = false
    for (const registration of controlsRef.current.values()) {
      if (reportsDisabledRef.current.get(registration)) {
        nextDisabled = Boolean(registration.disabled)
      }
    }
    setControlDisabled(nextDisabled)
  }, [])

  const getRepresentativeControl = React.useCallback(() => {
    let fallback: FieldControlRegistration | undefined

    for (const registration of controlsRef.current.values()) {
      const input = getInput(registration)
      if (!isEligibleRegistration(registration, formElementRef.current)) {
        continue
      }
      fallback ??= registration
      if (canValidateInput(input) && !input.validity.valid) {
        return registration
      }
    }

    return fallback ?? getActiveControl()
  }, [formElementRef, getActiveControl])

  const clearCustomValidity = React.useCallback(() => {
    for (const registration of controlsRef.current.values()) {
      const input = getInput(registration)
      if (canValidateInput(input)) {
        input.setCustomValidity('')
      }
    }
  }, [])

  const setCustomValidity = React.useCallback(
    (message: string) => {
      for (const registration of controlsRef.current.values()) {
        if (!isEligibleRegistration(registration, formElementRef.current)) {
          continue
        }
        const input = getInput(registration)
        if (canValidateInput(input)) {
          input.setCustomValidity(message)
        }
      }
    },
    [formElementRef]
  )

  const publishValidity = React.useCallback(
    (data: FieldValidityData) => {
      if (data.state.customError) {
        setCustomValidity(data.errors.join('\n'))
      } else {
        clearCustomValidity()
      }
      formValidityDataRef.current.state.valid = disabledRef.current
        ? null
        : externallyInvalidRef.current
          ? false
          : data.state.valid
      validityDataRef.current = data
      setCurrentValue(data.value)
      setValidityData(data)
    },
    [clearCustomValidity, setCustomValidity]
  )
  publishValidityRef.current = publishValidity

  const validateValue = React.useCallback(
    (value: unknown, submit = false, fromChange = false) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = undefined
      }

      const showValueMissing = dirtyRef.current || submit || submitAttemptedRef.current

      if (fromChange) {
        clearCustomValidity()
      }

      const representative = getRepresentativeControl()
      activeValidationControlRef.current = representative
      formControlRef.current = representative?.controlRef.current ?? null
      const input = representative && getInput(representative)
      let nativeState = createDefaultValidityState(true)
      let nativeMessage = ''

      if (canValidateInput(input)) {
        nativeState = getNativeValidity(input, showValueMissing)
        nativeMessage = nativeState.valid === false ? input.validationMessage : ''
      } else {
        const required = Array.from(controlsRef.current.values()).some(
          (registration) =>
            registration.required &&
            isEligibleRegistration(registration, formElementRef.current)
        )
        if (required && !isFilled(value) && showValueMissing) {
          nativeState = {
            ...createDefaultValidityState(false),
            valueMissing: true,
          }
          nativeMessage = 'Please fill out this field.'
        }
      }

      const initialValue = initialValueRef.current
      const makeValidityData = (customErrors: string[]): FieldValidityData => {
        if (customErrors.length) {
          return {
            state: {
              ...nativeState,
              valid: false,
              customError: true,
            },
            error: customErrors[0] ?? '',
            errors: customErrors,
            value,
            initialValue,
          }
        }

        if (hasValidityError(nativeState)) {
          return {
            state: nativeState,
            error: nativeMessage,
            errors: nativeMessage ? [nativeMessage] : [],
            value,
            initialValue,
          }
        }

        return {
          state: createDefaultValidityState(true),
          error: '',
          errors: [],
          value,
          initialValue,
        }
      }

      if (nativeMessage && !fromChange) {
        validationCommitterRef.current!.run(makeValidityData([]))
        return
      }

      const result = validate ? getValidationResult(validate, value, getFormValues()) : []

      if (result instanceof Promise) {
        void validationCommitterRef.current!.run(
          result.then((customErrors) => makeValidityData(customErrors))
        )
      } else {
        validationCommitterRef.current!.run(makeValidityData(result))
      }
    },
    [
      clearCustomValidity,
      formElementRef,
      getFormValues,
      getRepresentativeControl,
      submitAttemptedRef,
      validate,
    ]
  )

  const registerControl = React.useCallback(
    (registration: FieldControlRegistration, reportDisabled = true) => {
      const source = Symbol()
      controlsRef.current.set(source, registration)
      reportsDisabledRef.current.set(registration, reportDisabled)
      activeControlRef.current = getActiveControl()
      formControlRef.current = activeControlRef.current?.controlRef.current ?? null
      const value = getRegistrationValue(registration)
      valueRef.current = value
      setCurrentValue(value)

      if (!hasInitialValueRef.current) {
        hasInitialValueRef.current = true
        initialValueRef.current = value
        validityDataRef.current = {
          ...validityDataRef.current,
          initialValue: value,
        }
        setValidityData(validityDataRef.current)
      }

      if (!nameProp && registration.name) {
        setRegisteredName(registration.name)
      }
      setFilled(isFilled(value))
      syncControlDisabled()

      return () => {
        controlsRef.current.delete(source)
        activeControlRef.current = getActiveControl()
        activeValidationControlRef.current = undefined
        formControlRef.current = activeControlRef.current?.controlRef.current ?? null
        const next = activeControlRef.current
        const nextValue = getRegistrationValue(next)
        valueRef.current = nextValue
        setCurrentValue(nextValue)
        setFilled(isFilled(nextValue))
        if (!nameProp) {
          setRegisteredName(next?.name)
        }
        syncControlDisabled()
      }
    },
    [getActiveControl, nameProp, syncControlDisabled]
  )

  const onFocus = React.useCallback(() => {
    setFocused(true)
  }, [])

  const onBlur = React.useCallback(
    (value = valueRef.current) => {
      valueRef.current = value
      setCurrentValue(value)
      setTouched(true)
      setFocused(false)
      if (validationMode === 'onBlur') {
        validateValue(value)
      }
    },
    [validateValue, validationMode]
  )

  const onChange = React.useCallback(
    (value: unknown) => {
      valueRef.current = value
      setCurrentValue(value)
      validationCommitterRef.current!.invalidate()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = undefined
      }
      const nextDirty = !Object.is(value, initialValueRef.current)
      dirtyRef.current = nextDirty
      setDirty(nextDirty)
      setFilled(isFilled(value))
      clearFormErrors(effectiveNameRef.current)

      const validateOnChange = shouldValidateOnChange(
        validationMode,
        submitAttemptedRef.current
      )

      if (validateOnChange) {
        if (validationMode === 'onChange' && validationDebounceTime > 0 && value !== '') {
          debounceRef.current = setTimeout(() => {
            validateValue(value, false, true)
          }, validationDebounceTime)
        } else {
          validateValue(value, false, true)
        }
        return
      }

      if (stateRef.current.valid === false) {
        const required = Array.from(controlsRef.current.values()).some(
          (registration) =>
            registration.required &&
            isEligibleRegistration(registration, formElementRef.current)
        )
        if (required && !isFilled(value) && dirtyRef.current) {
          validateValue(value)
          return
        }

        clearCustomValidity()
        publishValidity({
          state: createDefaultValidityState(true),
          error: '',
          errors: [],
          value,
          initialValue: initialValueRef.current,
        })
      }
    },
    [
      clearFormErrors,
      clearCustomValidity,
      formElementRef,
      publishValidity,
      submitAttemptedRef,
      validateValue,
      validationDebounceTime,
      validationMode,
    ]
  )

  const onDisabledChange = React.useCallback((nextDisabled: boolean) => {
    setControlDisabled(nextDisabled)
  }, [])

  React.useEffect(() => {
    return () => {
      validationCommitterRef.current?.invalidate()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const formRegistration = React.useMemo<FormFieldRegistration>(
    () => ({
      controlRef: formControlRef,
      validityData: formValidityDataRef.current,
      get name() {
        return stateRef.current.disabled ? undefined : effectiveNameRef.current
      },
      get controlId() {
        return (
          activeValidationControlRef.current?.id ??
          getRepresentativeControl()?.id ??
          association.controlId
        )
      },
      getValue() {
        return getRegistrationValue(getActiveControl()) ?? valueRef.current
      },
      validate() {
        validateValue(getRegistrationValue(getActiveControl()) ?? valueRef.current, true)
      },
    }),
    [association.controlId, getActiveControl, getRepresentativeControl, validateValue]
  )

  React.useEffect(() => {
    return registerFormField(fieldId, formRegistration)
  }, [fieldId, formRegistration, registerFormField])

  const rootContext = React.useMemo<FieldRootContextValue>(
    () => ({
      state,
      validityData,
      name: effectiveName,
      rootDisabled: disabledProp,
      registerControl,
      onFocus,
      onBlur,
      onChange,
      onDisabledChange,
    }),
    [
      disabledProp,
      effectiveName,
      onBlur,
      onChange,
      onDisabledChange,
      onFocus,
      registerControl,
      state,
      validityData,
    ]
  )
  const controlContext = useControlContext(rootContext, association)
  const styleState = getStyleState(state)

  return (
    <FieldStateContext.Provider value={state}>
      <FieldRootContext.Provider value={rootContext}>
        <AssociationContext.Provider value={association}>
          <FieldControlContext.Provider value={controlContext}>
            <FieldStyledContext.Provider {...styleState}>
              <FieldFrame
                {...fieldProps}
                {...getDataProps(state)}
                disabled={disabled}
                ref={forwardedRef}
              >
                {children}
              </FieldFrame>
            </FieldStyledContext.Provider>
          </FieldControlContext.Provider>
        </AssociationContext.Provider>
      </FieldRootContext.Provider>
    </FieldStateContext.Provider>
  )
})

function usePartContexts() {
  const root = React.useContext(FieldRootContext)
  const association = React.useContext(AssociationContext)
  const itemDisabled = React.useContext(FieldItemContext)

  if (!root || !association) {
    throw new Error('Field parts must be rendered inside <Field>.')
  }

  return { root, association, itemDisabled }
}

export type FieldLabelProps = GetProps<typeof FieldLabelFrame>

const FieldLabel = createStyledHOC(FieldLabelFrame)<FieldLabelProps>(function FieldLabel(
  { id: idProp, children, onPress, onMouseDown, ...labelProps },
  forwardedRef
) {
  const { root, association, itemDisabled } = usePartContexts()
  const generatedId = React.useId().replace(/:/g, '')
  const id = idProp ?? `field-label-${generatedId}`
  const text = getText(children)
  const disabled = root.state.disabled || itemDisabled

  useIsomorphicLayoutEffect(() => {
    return association.registerLabel(id, text)
  }, [association.registerLabel, id, text])

  return (
    <FieldLabelFrame
      {...labelProps}
      {...getDataProps(root.state, disabled)}
      id={id}
      ref={forwardedRef}
      {...(isWeb ? { htmlFor: association.controlId } : undefined)}
      accessibilityState={disabled ? { disabled: true } : undefined}
      onMouseDown={(event: any) => {
        onMouseDown?.(event)
        if (!event.defaultPrevented && event.detail > 1) {
          event.preventDefault()
        }
      }}
      onPress={(event: any) => {
        onPress?.(event)
        if (!isWeb && !event?.defaultPrevented) {
          focusFocusable(association.controlId)
        }
      }}
    >
      {children}
    </FieldLabelFrame>
  )
})

export type FieldDescriptionProps = GetProps<typeof FieldDescriptionFrame>

const FieldDescription = createStyledHOC(FieldDescriptionFrame)<FieldDescriptionProps>(
  function FieldDescription({ id: idProp, children, ...descriptionProps }, forwardedRef) {
    const { root, association, itemDisabled } = usePartContexts()
    const generatedId = React.useId().replace(/:/g, '')
    const id = idProp ?? `field-description-${generatedId}`
    const text = getText(children)
    const disabled = root.state.disabled || itemDisabled

    useIsomorphicLayoutEffect(() => {
      return association.registerMessage(id, text)
    }, [association.registerMessage, id, text])

    return (
      <FieldDescriptionFrame
        {...descriptionProps}
        {...getDataProps(root.state, disabled)}
        id={id}
        ref={forwardedRef}
      >
        {children}
      </FieldDescriptionFrame>
    )
  }
)

export type FieldErrorProps = GetProps<typeof FieldErrorFrame> & {
  match?: boolean | keyof FieldValidityState
}

const FieldError = createStyledHOC(FieldErrorFrame)<FieldErrorProps>(function FieldError(
  { id: idProp, children, match, ...errorProps },
  forwardedRef
) {
  const { root, association, itemDisabled } = usePartContexts()
  const generatedId = React.useId().replace(/:/g, '')
  const id = idProp ?? `field-error-${generatedId}`
  const disabled = root.state.disabled || itemDisabled
  const rendered =
    match === true ||
    (!disabled &&
      (typeof match === 'string'
        ? Boolean(root.validityData.state[match])
        : root.state.valid === false))
  const message = children ?? root.state.errors.join('\n')
  const text = getText(message)

  useIsomorphicLayoutEffect(() => {
    if (!rendered) {
      return
    }
    return association.registerMessage(id, text)
  }, [association.registerMessage, id, rendered, text])

  if (!rendered) {
    return null
  }

  return (
    <FieldErrorFrame
      {...errorProps}
      {...getDataProps(root.state, disabled)}
      id={id}
      ref={forwardedRef}
    >
      {message}
    </FieldErrorFrame>
  )
})

export type FieldItemProps = GetProps<typeof FieldItemFrame> & {
  disabled?: boolean
}

const FieldItem = createStyledHOC(FieldItemFrame)<FieldItemProps>(function FieldItem(
  { disabled: disabledProp = false, children, ...itemProps },
  forwardedRef
) {
  const root = React.useContext(FieldRootContext)
  const parentAssociation = React.useContext(AssociationContext)
  const reactId = React.useId().replace(/:/g, '')
  const association = useAssociation(`field-item-${reactId}`, parentAssociation)

  if (!root || !parentAssociation) {
    throw new Error('Field.Item must be rendered inside <Field>.')
  }

  const disabled = root.state.disabled || disabledProp
  const controlContext = useControlContext(root, association, disabledProp, true)
  const styleState = getStyleState(root.state, disabled)

  return (
    <FieldItemContext.Provider value={disabledProp}>
      <AssociationContext.Provider value={association}>
        <FieldControlContext.Provider value={controlContext}>
          <FieldStyledContext.Provider {...styleState}>
            <FieldItemFrame
              {...itemProps}
              {...getDataProps(root.state, disabled)}
              disabled={disabled}
              ref={forwardedRef}
            >
              {children}
            </FieldItemFrame>
          </FieldStyledContext.Provider>
        </FieldControlContext.Provider>
      </AssociationContext.Provider>
    </FieldItemContext.Provider>
  )
})

export const Field = withStaticProperties(FieldComponent, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Item: FieldItem,
  useFieldState,
  useFieldControl,
})

export namespace Field {
  export type Props = FieldProps
  export type State = FieldState
  export type ValidityState = FieldValidityState
}
