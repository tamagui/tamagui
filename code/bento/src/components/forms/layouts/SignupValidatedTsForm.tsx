import type { FormProps } from 'tamagui'
import { AnimatePresence, Button, Form, H2, isWeb, RadioGroup, Spinner, View } from 'tamagui'
import { Input, InputContext } from '../inputs/components/inputsParts'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Eye, EyeOff, Info } from '@tamagui/lucide-icons'
import { FormCard } from './components/layoutParts'
import { z } from 'zod'
import { createTsForm, useTsController, createUniqueFieldSchema } from '@ts-react/form'
import { H1 } from 'tamagui'
import { SafeAreaView } from 'react-native'

type TextInputProps = {
  label: string
  labelId: string
  placeholder?: string
}
const TextInput = (props: TextInputProps) => {
  const { label, labelId, placeholder } = props
  const { field, error } = useTsController<string>()
  const { onChange, onBlur, ...filedRest } = field
  const { size } = InputContext.useStyledContext()
  return (
    <Input
      {...(error && {
        theme: 'red',
      })}
      onBlur={onBlur}
      size={size}
    >
      <Input.Label htmlFor={labelId}>{label}</Input.Label>
      <Input.Box>
        <Input.Area
          id={labelId}
          placeholder={placeholder}
          onChangeText={field.onChange}
          {...filedRest}
        />
      </Input.Box>
      <AnimatePresence>
        {error && (
          <View
            bottom="$-5"
            left={0}
            position="absolute"
            gap="$2"
            flexDirection="row"
            animation="bouncy"
            scaleY={1}
            enterStyle={{
              opacity: 0,
              y: -10,
              scaleY: 0.5,
            }}
            exitStyle={{
              opacity: 0,
              y: -10,
              scaleY: 0.5,
            }}
          >
            <Input.Icon padding={0}>
              <Info />
            </Input.Icon>
            <Input.Info>{error.errorMessage}</Input.Info>
          </View>
        )}
      </AnimatePresence>
    </Input>
  )
}

const passwordSchema = createUniqueFieldSchema(
  z.string().min(6, {
    message: 'must be at least 6 characters',
  }),
  'password'
)

type PasswordInputProps = TextInputProps & {}
const PasswordInput = (props: PasswordInputProps) => {
  const { label, labelId, placeholder } = props
  const [showPassword, setShowPassword] = useState(false)
  const { field, error } = useTsController<string>()
  const { size } = InputContext.useStyledContext()
  return (
    <Input
      {...(error && {
        theme: 'red',
      })}
      onBlur={field.onBlur}
      size={size}
    >
      <Input.Label htmlFor={labelId}>{label}</Input.Label>
      <Input.Box>
        <Input.Area
          id={labelId}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          onChangeText={field.onChange}
          value={field.value}
        />
        <Input.Icon cursor="pointer" onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
        </Input.Icon>
      </Input.Box>
      <AnimatePresence>
        {error && (
          <View
            bottom="$-5"
            left={0}
            position="absolute"
            gap="$2"
            flexDirection="row"
            animation="bouncy"
            scaleY={1}
            enterStyle={{
              opacity: 0,
              y: -10,
              scaleY: 0.5,
            }}
            exitStyle={{
              opacity: 0,
              y: -10,
              scaleY: 0.5,
            }}
          >
            <Input.Icon padding={0}>
              <Info />
            </Input.Icon>
            <Input.Info>{error.errorMessage}</Input.Info>
          </View>
        )}
      </AnimatePresence>
    </Input>
  )
}

// schema is both for validation and mapping to a specific component
const radioSchema = createUniqueFieldSchema(z.string(), 'radio')
type MyRadioProps = {
  id: string
  title: string
  values: {
    value: string
    label: string
    labelId: string
  }[]
}
const MyRadio = (props: MyRadioProps) => {
  const { id, title, values } = props
  const { field } = useTsController<string>()
  const { onChange, ...restField } = field
  const { size } = InputContext.useStyledContext()
  return (
    <View gap="$2">
      <H2 size={size} fontFamily="$body">
        {title}
      </H2>
      <RadioGroup
        gap="$8"
        flexDirection="row"
        onValueChange={onChange}
        id={id}
        {...restField}
      >
        {values.map(({ value, label, labelId }) => (
          <View key={label} flexDirection="row" alignItems="center" gap="$3">
            <RadioGroup.Item id={labelId} value={value}>
              <RadioGroup.Indicator />
            </RadioGroup.Item>

            <Input.Label htmlFor={labelId}>{label}</Input.Label>
          </View>
        ))}
      </RadioGroup>
    </View>
  )
}

const twoInputSchema = z.object({
  firstInput: z.string().min(1, { message: 'This field is required' }),
  secondInput: z.string().min(1, { message: 'This field is required' }),
})

type TwoInputProps = {
  values: {
    firstInput: {
      label: string
      labelId: string
      placeholder: string
    }
    secondInput: {
      label: string
      labelId: string
      placeholder: string
    }
  }
}
const TwoInput = (props: TwoInputProps) => {
  const { values } = props
  const { field, error } = useTsController<z.infer<typeof twoInputSchema>>()
  const { value, onChange, onBlur } = field

  const { size } = InputContext.useStyledContext()
  return (
    <View
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="space-between"
      columnGap="$4"
      rowGap="$5"
    >
      <Input
        {...(error?.firstInput && {
          theme: 'red',
        })}
        onBlur={onBlur}
        f={1}
        minWidth="100%"
        $group-window-gtSm={{ flexBasis: 150, minWidth: 'inherit' }}
        animation="quickest"
        size={size}
      >
        <Input.Label htmlFor={values.firstInput.labelId}>
          {values.firstInput.label}
        </Input.Label>
        <Input.Box>
          <Input.Area
            id={values.firstInput.labelId}
            placeholder={values.firstInput.placeholder}
            onChangeText={(text) => {
              onChange({
                ...value,
                firstInput: text,
              })
            }}
            value={value?.firstInput}
          />
        </Input.Box>
        <AnimatePresence>
          {error?.firstInput && (
            <View
              bottom="$-5"
              left={0}
              position="absolute"
              gap="$2"
              flexDirection="row"
              animation="bouncy"
              scaleY={1}
              enterStyle={{
                opacity: 0,
                y: -10,
                scaleY: 0.5,
              }}
              exitStyle={{
                opacity: 0,
                y: -10,
                scaleY: 0.5,
              }}
            >
              <Input.Icon padding={0}>
                <Info />
              </Input.Icon>
              <Input.Info>{error.firstInput.errorMessage}</Input.Info>
            </View>
          )}
        </AnimatePresence>
      </Input>
      <Input
        {...(error?.secondInput && {
          theme: 'red',
        })}
        onBlur={onBlur}
        f={1}
        flexBasis={150}
        size={size}
      >
        <Input.Label htmlFor={values.secondInput.labelId}>
          {values.secondInput.label}
        </Input.Label>
        <Input.Box>
          <Input.Area
            id={values.secondInput.labelId}
            placeholder={values.secondInput.placeholder}
            onChangeText={(text) => {
              onChange({
                ...value,
                secondInput: text,
              })
            }}
            value={value?.secondInput}
          />
        </Input.Box>
        <AnimatePresence>
          {error?.secondInput && (
            <View
              bottom="$-5"
              left={0}
              position="absolute"
              gap="$2"
              flexDirection="row"
              animation="bouncy"
              scaleY={1}
              enterStyle={{
                opacity: 0,
                y: -10,
                scaleY: 0.5,
              }}
              exitStyle={{
                opacity: 0,
                y: -10,
                scaleY: 0.5,
              }}
            >
              <Input.Icon padding={0}>
                <Info />
              </Input.Icon>
              <Input.Info>{error.secondInput.errorMessage}</Input.Info>
            </View>
          )}
        </AnimatePresence>
      </Input>
    </View>
  )
}

// create the mapping, you need this once per project
const mapping = [
  [z.string(), TextInput],
  [radioSchema, MyRadio],
  [passwordSchema, PasswordInput],
  [twoInputSchema, TwoInput],
] as const // 👈 `as const` is necessary

const schema = z
  .object({
    fullName: twoInputSchema,
    email: z
      .string()
      .min(4, 'Email is required')
      .email({ message: 'Invalid email format' }),
    password: passwordSchema,
    confirmedPassword: passwordSchema,
    accountType: radioSchema,
    postalCode: z.string().min(4, {
      message: 'Postal code is required',
    }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmedPassword
    },
    {
      message: 'Passwords do not match',
      path: ['confirmedPassword'],
    }
  )

const FormComponent = (props: FormProps) => {
  const { ...rest } = props
  return (
    <Form asChild {...rest}>
      <FormCard
        flexDirection="column"
        gap="$5"
        tag="form"
        $group-window-sm={{
          paddingHorizontal: '$4',
          paddingVertical: '$6',
        }}
      >
        {props.children}
      </FormCard>
    </Form>
  )
}

const _SchemaForm = createTsForm(mapping, {
  FormComponent,
})

const SchemaForm: typeof _SchemaForm = ({ ...props }) => {
  const renderAfter: ComponentProps<typeof _SchemaForm>['renderAfter'] = props.renderAfter
    ? (vars) => props.renderAfter?.(vars)
    : undefined

  return (
    <_SchemaForm {...props} renderAfter={renderAfter}>
      {(fields: Record<string, ReturnType<typeof useTsController>>, context: any) => {
        //@ts-ignore
        return props.children ? props.children(fields, context) : Object.values(fields)
      }}
    </_SchemaForm>
  )
}

export function SignupValidatedTsForm() {
  const [loading, setLoading] = useState(false)

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.info('data is ', data)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <InputContext.Provider size="$4">
      <SchemaForm
        onSubmit={(values) => onSubmit(values)}
        props={{
          fullName: {
            values: {
              firstInput: {
                label: 'First Name',
                labelId: 'firstName-ts2',
                placeholder: 'First name',
              },
              secondInput: {
                label: 'Last Name',
                labelId: 'lastName-ts2',
                placeholder: 'Last name',
              },
            },
          },
          email: {
            placeholder: 'Email',
            label: 'Email',
            labelId: 'email-ts2',
          },
          password: {
            placeholder: 'Password',
            label: 'Password',
            labelId: 'password-ts2',
          },
          confirmedPassword: {
            placeholder: 'Confirm Password',
            label: 'Confirm Password',
            labelId: 'confirmPassword-ts2',
          },
          postalCode: {
            placeholder: 'Postal Code',
            label: 'Postal Code',
            labelId: 'postalCode-ts2',
          },
          accountType: {
            id: 'accountType-ts2',
            title: 'Account type',
            values: [
              {
                value: 'personal',
                label: 'Personal',
                labelId: 'personal-ts2',
              },
              {
                value: 'business',
                label: 'Business',
                labelId: 'business-ts2',
              },
            ],
          },
        }}
        defaultValues={{
          accountType: 'personal',
          confirmedPassword: '',
          password: '',
          email: '',
          fullName: { firstInput: '', secondInput: '' },
          postalCode: '',
        }}
        schema={schema}
        renderBefore={() => (
          <H1
            alignSelf="center"
            size="$8"
            $group-window-xs={{
              size: '$7',
            }}
          >
            Create an account
          </H1>
        )}
        renderAfter={({ submit }) => (
          <>
            <Button
              themeInverse
              disabled={loading}
              onPress={() => submit()}
              cursor={loading ? 'progress' : 'pointer'}
              alignSelf="flex-end"
              width={'100%'}
              marginVertical="$4"
              iconAfter={
                <AnimatePresence>
                  {loading && (
                    <Spinner
                      size="small"
                      color="$color"
                      key="loading-spinner"
                      opacity={1}
                      position="absolute"
                      scale={0.5}
                      left={0}
                      x={100}
                      animation="quick"
                      enterStyle={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      exitStyle={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                    />
                  )}
                </AnimatePresence>
              }
            >
              <Button.Text animation="quick" x={loading ? -10 : 0}>
                Sign Up
              </Button.Text>
            </Button>
            {!isWeb && <SafeAreaView />}
          </>
        )}
      />
    </InputContext.Provider>
  )
}

SignupValidatedTsForm.fileName = 'SignupValidatedTsForm'
