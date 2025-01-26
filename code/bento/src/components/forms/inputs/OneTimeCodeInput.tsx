import { useEffect, useState } from 'react'
import type { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Controller, useForm, useFormState } from 'react-hook-form'
import type { SizeTokens } from 'tamagui'
import {
  AnimatePresence,
  Form,
  Input,
  Paragraph,
  Spinner,
  View,
  Button,
  XStack,
} from 'tamagui'

import {
  CheckCircle2,
  ChevronLeft,
  KeySquare,
  LockKeyhole,
  Mail,
  Smartphone,
} from '@tamagui/lucide-icons'
import { InputWithLabelDemo } from './InputWithLabel'

interface CodeConfirmationInputProps {
  id: number
  size?: SizeTokens
  codeSize: number
  secureTextEntry?: boolean
  control: Control<FormFields, any>
  register: UseFormRegister<FormFields>
  setValue: UseFormSetValue<FormFields>
  switchInputPlace: (currentField: number, value: string) => void
  onSubmit: () => void
}

function CodeConfirmationInput({
  id,
  size,
  codeSize,
  secureTextEntry,
  control,
  register,
  setValue,
  switchInputPlace,
  onSubmit,
}: CodeConfirmationInputProps) {
  useFormState
  return (
    <Controller
      name={`code${id}`}
      defaultValue=""
      control={control}
      rules={{ required: true, pattern: /^[0-9]*$/ }}
      render={({ fieldState: { invalid }, field: { value, onChange } }) => (
        <Input
          {...register(`code${id}`)}
          value={value}
          maxLength={codeSize}
          // uncomment this for autofocus
          // autoFocus={id === 0}
          selectTextOnFocus
          onChangeText={(code: string) => {
            // Max length is disabled to enable multiple digit paste
            if (code.length === codeSize) {
              // Paste logic

              const digits = code.split('')
              digits.forEach((digit, index) => {
                // Set each digit to the corresponding input
                setValue(`code${index}`, digit)
              })

              onSubmit()
            } else {
              // Manual input logic

              // Only take the first digit (disables multiple digits in one input)
              onChange(code.split('')[0])
              // Focus next input
              switchInputPlace(id, code)

              // Submit on last input
              if (id === codeSize - 1) {
                onSubmit()
              }
            }
          }}
          onKeyPress={(e) => {
            const event = e.nativeEvent
            if (event.key === 'Backspace') {
              // Prevent the backspace key from navigating back
              e.preventDefault()

              if (value !== '') {
                // Reset input field
                onChange('')
              } else {
                // Set focus to the previous input
                switchInputPlace(id, value)
              }
            }
            if (event.key === 'Enter') {
              onSubmit()
            }
          }}
          inputMode="numeric"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          secureTextEntry={secureTextEntry}
          enterKeyHint={id === codeSize - 1 ? 'done' : 'next'}
          textAlign="center"
          width="$5"
          fontSize="$7"
          height="$5"
          borderRadius="$5"
          theme="active"
          backgroundColor={invalid ? '$red7' : value ? '$color1' : '$color5'}
          hoverStyle={{ outlineWidth: 0 }}
          focusStyle={{
            backgroundColor: invalid ? '$red8' : '$color1',
            borderWidth: '$1',
            outlineWidth: 0,
          }}
        />
      )}
    />
  )
}

interface CodeConfirmationProps {
  size?: SizeTokens
  codeSize: number
  secureText?: boolean
  onEnter: (code: number) => void
}

interface FormFields {
  [key: string]: string
}

function CodeConfirmation({
  size,
  codeSize,
  secureText,
  onEnter,
}: CodeConfirmationProps) {
  const defaultValues = Array.from({ length: codeSize }, (_, i) => `code${i}`).reduce(
    (acc, key) => ({ ...acc, [key]: '' }),
    {}
  )

  const { control, setFocus, register, handleSubmit, setValue, formState } =
    useForm<FormFields>({
      defaultValues: defaultValues,
    })

  const switchInputPlace = (currentInput: number, value: string) => {
    if (value === '') {
      setFocus(`code${currentInput - 1}`)
    } else {
      setFocus(`code${currentInput + 1}`)
    }
  }

  const onSubmit = handleSubmit((data) => {
    const code = Number(Object.values(data).join(''))
    onEnter(code)
  })

  const [translateX, setTranslateX] = useState(0)
  const [isValid, setValid] = useState(true)

  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      setValid(false)
    }
  }, [formState.isValidating])

  // shake animation
  useEffect(() => {
    let interval: number | null = null

    interval = window.setInterval(() => {
      if (isValid) {
        setTranslateX(0)
      } else {
        setValid(false)
        setTranslateX((prevState) => {
          if (prevState === 0) return -16
          if (prevState < 0) return Math.abs(prevState) - 2
          setValid(true)
          return -(prevState - 2)
        })
      }
    }, 50)

    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [isValid])

  return (
    <Form onSubmit={onSubmit}>
      <View
        flexDirection="row"
        gap="$2"
        alignItems="center"
        minWidth="100%"
        justifyContent="center"
        x={translateX}
        animation="bouncy"
      >
        {Array(codeSize)
          .fill(null)
          .map((_, id) => {
            return (
              <CodeConfirmationInput
                key={`code${id}`}
                id={id}
                size={size}
                codeSize={codeSize}
                secureTextEntry={secureText}
                control={control}
                register={register}
                setValue={setValue}
                switchInputPlace={switchInputPlace}
                onSubmit={onSubmit}
              />
            )
          })}
      </View>
    </Form>
  )
}

/** ------ EXAMPLE ------ */
export function OneTimeCodeInputExample({
  size = '$5',
  codeSize = 4,
  secureText = false,
}: {
  size?: SizeTokens
  codeSize?: number
  secureText?: boolean
}) {
  const [code, setCode] = useState<number>()
  const [codeEntered, setCodeEntered] = useState(false)
  const [verified, setVerified] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [activeInterface, setActiveInterface] = useState<'email' | 'code'>('code')

  const handleEnter = (code: number) => {
    setCode(code)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (code !== undefined) {
      timer = setTimeout(() => {
        setCodeEntered(true)
      }, 2500)
    }

    return () => clearTimeout(timer)
  }, [code])

  //NOTE: for testing purposes
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (codeEntered === true) {
      timer = setTimeout(() => {
        setVerified(false)
      }, 2000)
    }

    return () => clearTimeout(timer)
  }, [codeEntered])

  return (
    <View alignItems="center" justifyContent="center" gap="$4">
      <View
        minWidth={300}
        $platform-native={{ minWidth: '100%' }}
        height={codeEntered ? 175 : activeInterface === 'email' ? 190 : 240}
        alignItems="center"
        justifyContent="center"
        width="auto"
        paddingHorizontal="$3"
        backgroundColor="$color3"
        borderRadius="$6"
        animation="200ms"
      >
        <View position="absolute" t="$4" r="$4">
          {codeEntered ? (
            <View flexDirection="row" gap="$2">
              <AnimatePresence>
                {verified && (
                  <Paragraph
                    key="success"
                    color="$green10"
                    enterStyle={{ opacity: 0, x: 15 }}
                    exitStyle={{ opacity: 0, x: 15 }}
                    animation="200ms"
                  >
                    Success!
                  </Paragraph>
                )}
              </AnimatePresence>
              <View enterStyle={{ opacity: 0.5, scale: 1.5 }} animation="bouncy">
                <CheckCircle2 color="$green10" />
              </View>
            </View>
          ) : code ? (
            <Spinner />
          ) : (
            <View enterStyle={{ opacity: 0.5, scale: 1.5 }} animation="100ms">
              <KeySquare size={16} opacity={0.25} />
            </View>
          )}
        </View>

        {activeInterface === 'email' ? (
          <View
            height={'100%'}
            key="email"
            gap="$5"
            animation="200ms"
            minWidth={'100%'}
            enterStyle={{ opacity: 0, y: 10 }}
            justifyContent="center"
            paddingVertical="$6"
            paddingHorizontal="$4"
          >
            <XStack
              gap="$4"
              justifyContent="flex-start"
              maxWidth={'75%'}
              alignItems="flex-end"
            >
              <InputWithLabelDemo
                focusOnMount
                size="$4"
                labelText="Email Address"
                onChangeText={setEmail}
              />
              <Button themeInverse onPress={() => setActiveInterface('code')}>
                Send
              </Button>
            </XStack>

            <View
              position="relative"
              flexDirection="row"
              alignItems="center"
              marginTop="auto"
              hoverStyle={{ x: -5, cursor: 'pointer' }}
              animation="200ms"
              onPress={() => setActiveInterface('code')}
            >
              <ChevronLeft size="$1" color="$white9" />
              <Paragraph size="$4" color="$white9">
                Back
              </Paragraph>
            </View>
          </View>
        ) : code ? (
          <View
            key="code"
            gap="$3"
            alignItems="center"
            justifyContent="center"
            animation="200ms"
            enterStyle={{ opacity: 0, y: 10 }}
            minWidth="100%"
            height="100%"
          >
            {codeEntered ? (
              <View
                y={0}
                enterStyle={{ opacity: 0, y: 10 }}
                animation="200ms"
                height="100%"
                minWidth="100%"
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingTop="$0"
              >
                <View
                  flexGrow={1}
                  justifyContent="center"
                  alignItems="center"
                  minWidth="100%"
                >
                  <Paragraph size="$4">Code verified</Paragraph>
                </View>
                <Button minWidth="100%" themeInverse>
                  Continue
                </Button>
              </View>
            ) : (
              <Paragraph size="$4">Verifying</Paragraph>
            )}
          </View>
        ) : (
          activeInterface === 'code' && (
            <View
              key="codeEntered"
              animation="200ms"
              enterStyle={{ opacity: 0, y: 10 }}
              justifyContent="space-between"
              height="100%"
              paddingVertical="$4"
            >
              <View alignItems="center" gap="$1.5">
                <Paragraph size="$4">Enter the code sent to</Paragraph>
                {email ? (
                  <View
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="$2"
                    w="100%"
                  >
                    <Mail size="$1" />
                    <Paragraph size="$4" fontWeight="bold">
                      {email}
                    </Paragraph>
                  </View>
                ) : (
                  <View
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="$2"
                    w="100%"
                  >
                    <Smartphone size="$1" />
                    <Paragraph size="$4" fontWeight="bold">
                      (•••) ••• ••73
                    </Paragraph>
                  </View>
                )}
              </View>

              <CodeConfirmation
                size={size}
                codeSize={codeSize}
                secureText={secureText}
                onEnter={handleEnter}
              />

              {!email ? (
                <Button
                  onPress={() => setActiveInterface('email')}
                  icon={Mail}
                  // variant="outlined"
                  color="$color11"
                  backgroundColor="transparent"
                  borderBottomWidth="$0.5"
                >
                  <Paragraph color="$color11">Send code to email instead</Paragraph>
                </Button>
              ) : null}
            </View>
          )
        )}
      </View>

      <View flexDirection="row" alignItems="center" gap="$2">
        <LockKeyhole size={12} color="$color10" />
        <Paragraph size="$2" color="$color10">
          Encrypted
        </Paragraph>
      </View>
    </View>
  )
}

OneTimeCodeInputExample.fileName = 'OneTimeCodeInput'
