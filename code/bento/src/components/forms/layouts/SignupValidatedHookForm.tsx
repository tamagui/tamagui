import {
  AnimatePresence,
  Button,
  H1,
  isWeb,
  Label,
  RadioGroup,
  Spinner,
  View,
} from 'tamagui'
import { Input } from '../inputs/components/inputsParts'
import { useState } from 'react'
import { Eye, EyeOff, Info } from '@tamagui/lucide-icons'
import { FormCard } from './components/layoutParts'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native'

const schema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmedPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters' }),
    postalCode: z.string().min(4, {
      message: 'Invalid postal code format',
    }),
    accountType: z.string().min(1, { message: 'Account type is required' }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Passwords do not match',
    path: ['confirmedPassword'],
  })

export function SignupValidatedHookForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmedPassword: '',
      postalCode: '',
      accountType: 'business',
    },
  })
  const onSubmit = (data: z.infer<typeof schema>) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <FormCard
      flexDirection="column"
      gap="$5"
      tag="form"
      $group-window-sm={{
        paddingHorizontal: '$4',
        paddingVertical: '$6',
      }}
    >
      <H1
        alignSelf="center"
        size="$8"
        $group-window-xs={{
          size: '$7',
        }}
      >
        Create an account
      </H1>

      <View gap="$5">
        <View
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-between"
          columnGap="$4"
          rowGap="$5"
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                {...(errors.firstName && {
                  theme: 'red',
                })}
                onBlur={onBlur}
                f={1}
                minWidth="100%"
                $group-window-gtSm={{ flexBasis: 150, minWidth: 'inherit' }}
                animation="quickest"
                size="$4"
              >
                <Input.Label>First Name</Input.Label>
                <Input.Box>
                  <Input.Area
                    placeholder="First name"
                    onChangeText={onChange}
                    value={value}
                  />
                </Input.Box>
                <AnimatePresence>
                  {errors.firstName && (
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
                      <Input.Info>{errors.firstName.message}</Input.Info>
                    </View>
                  )}
                </AnimatePresence>
              </Input>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                {...(errors.lastName && {
                  theme: 'red',
                })}
                onBlur={onBlur}
                f={1}
                minWidth="100%"
                $group-window-gtSm={{ flexBasis: 150, minWidth: 'inherit' }}
                animation="quickest"
                size="$4"
              >
                <Input.Label>Last Name</Input.Label>
                <Input.Box>
                  <Input.Area
                    placeholder="Last name"
                    onChangeText={onChange}
                    value={value}
                  />
                </Input.Box>
                <AnimatePresence>
                  {errors.lastName && (
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
                      <Input.Info>{errors.lastName.message}</Input.Info>
                    </View>
                  )}
                </AnimatePresence>
              </Input>
            )}
          />
        </View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.email && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label>Email</Input.Label>
              <Input.Box>
                <Input.Area
                  placeholder="email@example.com"
                  onChangeText={onChange}
                  value={value}
                />
              </Input.Box>
              <AnimatePresence>
                {errors.email && (
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
                    <Input.Info>{errors.email.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.password && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label htmlFor={'password-t1'}>Password</Input.Label>
              <Input.Box>
                <Input.Area
                  id={'password-t1'}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  onChangeText={onChange}
                  value={value}
                />
                <Input.Icon
                  cursor="pointer"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.password && (
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
                    <Input.Info>{errors.password.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />

        <Controller
          control={control}
          name="confirmedPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.confirmedPassword && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label htmlFor={'confirmed password'}>Confirm Password</Input.Label>
              <Input.Box>
                <Input.Area
                  id={'confirmed password'}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm password"
                  onChangeText={onChange}
                  value={value}
                />
                <Input.Icon
                  cursor="pointer"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye color="$gray11" />
                  ) : (
                    <EyeOff color="$gray11" />
                  )}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.confirmedPassword && (
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
                    <Input.Info>{errors.confirmedPassword.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />
        <View flexDirection="column" gap="$1">
          <Input.Label htmlFor={'account-type-t1'}>Account type</Input.Label>
          <Controller
            control={control}
            name="accountType"
            render={({ field: { onChange, onBlur, value } }) => (
              <RadioGroup
                gap="$8"
                flexDirection="row"
                value={value}
                onValueChange={onChange}
                id={'account-type-t1'}
              >
                <View flexDirection="row" alignItems="center" gap="$3">
                  <RadioGroup.Item id={'personal-t1'} value="personal">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>

                  <Input.Label htmlFor={'personal-t1'}>Personal</Input.Label>
                </View>
                <View flexDirection="row" alignItems="center" gap="$3">
                  <RadioGroup.Item id={'business-t1'} value="business">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>

                  <Input.Label htmlFor={'business-t1'}>Business</Input.Label>
                </View>
              </RadioGroup>
            )}
          />
        </View>
        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.postalCode && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label>Postal code</Input.Label>
              <Input.Box>
                <Input.Area
                  keyboardType="decimal-pad"
                  textContentType="postalCode"
                  placeholder="Postal code"
                  onChangeText={onChange}
                  value={value}
                />
              </Input.Box>
              <AnimatePresence>
                {errors.postalCode && (
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
                    <Input.Info>{errors.postalCode.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />
        <Button
          themeInverse
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          cursor={loading ? 'progress' : 'pointer'}
          alignSelf="flex-end"
          w="100%"
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
                  left={110}
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
          Sign Up
        </Button>
      </View>
      {!isWeb && <SafeAreaView />}
    </FormCard>
  )
}

SignupValidatedHookForm.fileName = 'SignupValidatedHookForm'
