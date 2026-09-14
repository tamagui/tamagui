import type { FormValues } from '@tamagui/form'
import type {
  FieldValidationMode,
  FieldValidationResult,
  FieldValidator,
  FieldValidityState,
  StandardSchemaIssue,
} from './types'

export function createDefaultValidityState(
  valid: boolean | null = null
): FieldValidityState {
  return {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    valid,
  }
}

export function normalizeNativeValidity(
  state: FieldValidityState,
  showValueMissing: boolean
) {
  if (showValueMissing || !state.valueMissing) {
    return { ...state }
  }

  const hasAnotherError = Object.entries(state).some(
    ([key, value]) => key !== 'valid' && key !== 'valueMissing' && value
  )

  if (hasAnotherError) {
    return { ...state }
  }

  return {
    ...state,
    valueMissing: false,
    valid: true,
  }
}

export function isFilled(value: unknown) {
  if (value === null || value === undefined || value === false) {
    return false
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length > 0
  }
  return true
}

export function shouldValidateOnChange(
  mode: FieldValidationMode,
  submitAttempted: boolean
) {
  return mode === 'onChange' || (mode === 'onSubmit' && submitAttempted)
}

function isPromiseLike<Value>(value: unknown): value is PromiseLike<Value> {
  return Boolean(
    value &&
    (typeof value === 'object' || typeof value === 'function') &&
    'then' in value &&
    typeof value.then === 'function'
  )
}

function normalizeFunctionResult(result: FieldValidationResult) {
  if (result === null || result === '') {
    return []
  }
  return Array.isArray(result) ? result.filter(Boolean) : [result]
}

function normalizeSchemaResult(
  result:
    | { value: unknown; issues?: undefined }
    | { issues: ReadonlyArray<StandardSchemaIssue> }
) {
  return 'issues' in result && result.issues
    ? result.issues.map((issue) => issue.message).filter(Boolean)
    : []
}

export function getValidationResult(
  validator: FieldValidator,
  value: unknown,
  formValues: FormValues
): string[] | Promise<string[]> {
  if ('~standard' in validator) {
    const result = validator['~standard'].validate(value)
    return isPromiseLike(result)
      ? Promise.resolve(result).then(normalizeSchemaResult)
      : normalizeSchemaResult(result)
  }

  const result = validator(value, formValues)
  return isPromiseLike(result)
    ? Promise.resolve(result).then(normalizeFunctionResult)
    : normalizeFunctionResult(result)
}

export function createValidationCommitter<Value>(commit: (value: Value) => void) {
  let commitId = 0

  return {
    invalidate() {
      commitId += 1
    },
    run(value: Value | PromiseLike<Value>): Value | Promise<Value> {
      commitId += 1
      const nextCommitId = commitId

      if (isPromiseLike<Value>(value)) {
        return Promise.resolve(value).then((nextValue) => {
          if (nextCommitId === commitId) {
            commit(nextValue)
          }
          return nextValue
        })
      }

      commit(value)
      return value
    },
  }
}
