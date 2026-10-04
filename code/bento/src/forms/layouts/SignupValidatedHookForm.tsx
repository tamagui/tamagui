import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Info } from '../../icons'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native'
import { AnimatePresence, Button, H1, isWeb, Spinner, View } from 'tamagui'
import { z } from 'zod'
import { Input } from '../inputs/components/inputsParts'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { FormCard } from './components/layoutParts'
import { RadioGroup } from '../radiogroups/components/radioParts'

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
  const { 'max-sm': narrow } = useGroupMedia('window')

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
      gap="5"
      px="@max-md/window:4"
      py="@max-md/window:6"
      render="form"
    >
      <H1 self="center" size={narrow ? '7' : '8'}>
        Create an account
      </H1>

      <View gap="5">
        <View
          flexWrap="wrap"
          flexDirection="row"
          justify="space-between"
          columnGap="4"
          rowGap="5"
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                {...(errors.firstName && {
                  theme: 'red',
                })}
                flex={1}
                minW="100% @md/window:inherit"
                flexBasis="@md/window:150px"
                onBlur={onBlur}
                style={{ transition: 'border-color 100ms ease' }}
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
                      b="-5"
                      l={0}
                      position="absolute"
                      gap="2"
                      flexDirection="row"
                      scaleY="1 enter:0.5 exit:0.5"
                      opacity="enter:0 exit:0"
                      y="enter:-10px exit:-10px"
                      style={{ transition: 'transform 250ms ease' }}
                    >
                      <Input.Icon p={0}>
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
                flex={1}
                minW="100% @md/window:inherit"
                flexBasis="@md/window:150px"
                onBlur={onBlur}
                style={{ transition: 'border-color 100ms ease' }}
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
                      b="5"
                      l={0}
                      position="absolute"
                      gap="2"
                      flexDirection="row"
                      scaleY="1 enter:0.5 exit:0.5"
                      opacity="enter:0 exit:0"
                      y="enter:-10px exit:-10px"
                      style={{ transition: 'transform 250ms ease' }}
                    >
                      <Input.Icon p={0}>
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
                    b="5"
                    l={0}
                    position="absolute"
                    gap="2"
                    flexDirection="row"
                    scaleY="1 enter:0.5 exit:0.5"
                    opacity="enter:0 exit:0"
                    y="enter:-10px exit:-10px"
                    style={{ transition: 'transform 250ms ease' }}
                  >
                    <Input.Icon p={0}>
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
                  {showPassword ? <Eye color="color-10" /> : <EyeOff color="color-10" />}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.password && (
                  <View
                    b="5"
                    l={0}
                    position="absolute"
                    gap="2"
                    flexDirection="row"
                    scaleY="1 enter:0.5 exit:0.5"
                    opacity="enter:0 exit:0"
                    y="enter:-10px exit:-10px"
                    style={{ transition: 'transform 250ms ease' }}
                  >
                    <Input.Icon p={0}>
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
                    <Eye color="color-10" />
                  ) : (
                    <EyeOff color="color-10" />
                  )}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.confirmedPassword && (
                  <View
                    b="-5"
                    l={0}
                    position="absolute"
                    gap="2"
                    flexDirection="row"
                    scaleY="1 enter:0.5 exit:0.5"
                    opacity="enter:0 exit:0"
                    y="enter:-10px exit:-10px"
                    style={{ transition: 'transform 250ms ease' }}
                  >
                    <Input.Icon p={0}>
                      <Info />
                    </Input.Icon>
                    <Input.Info>{errors.confirmedPassword.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />
        <View flexDirection="column" gap="1">
          <Input.Label htmlFor={'account-type-t1'}>Account type</Input.Label>
          <Controller
            control={control}
            name="accountType"
            render={({ field: { onChange, onBlur, value } }) => (
              <RadioGroup
                gap="8"
                flexDirection="row"
                value={value}
                onValueChange={onChange}
                id={'account-type-t1'}
              >
                <View flexDirection="row" items="center" gap="3">
                  <RadioGroup.Item id={'personal-t1'} value="personal">
                    <RadioGroup.Indicator
                      width="33%"
                      height="33%"
                      rounded={1000}
                      bg="color"
                    />
                  </RadioGroup.Item>

                  <Input.Label htmlFor={'personal-t1'}>Personal</Input.Label>
                </View>
                <View flexDirection="row" items="center" gap="3">
                  <RadioGroup.Item id={'business-t1'} value="business">
                    <RadioGroup.Indicator
                      width="33%"
                      height="33%"
                      rounded={1000}
                      bg="color"
                    />
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
                    b="-5"
                    l={0}
                    position="absolute"
                    gap="2"
                    flexDirection="row"
                    scaleY="1 enter:0.5 exit:0.5"
                    opacity="enter:0 exit:0"
                    y="enter:-10px exit:-10px"
                    style={{ transition: 'transform 250ms ease' }}
                  >
                    <Input.Icon p={0}>
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
          theme="accent"
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          cursor={loading ? 'progress' : 'pointer'}
          self="flex-end"
          width="100%"
          iconAfter={
            <AnimatePresence>
              {loading && (
                <Spinner
                  size="small"
                  color="color"
                  opacity="1 enter:0 exit:0"
                  position="absolute"
                  scale="0.5 enter:0.5 exit:0.5"
                  l={110}
                  key="loading-spinner"
                  style={{
                    transition: 'transform 150ms ease, opacity 150ms ease',
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
