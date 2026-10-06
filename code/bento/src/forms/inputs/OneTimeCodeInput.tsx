import type { ComponentSize } from '@tamagui/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import {
  AnimatePresence,
  Button,
  Form,
  Input,
  Label,
  Paragraph,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'

import {
  CheckCircle2,
  ChevronLeft,
  KeySquare,
  LockKeyhole,
  Mail,
  RefreshCcw,
  Smartphone,
} from '../../icons'
import { tone } from '../../tone'

interface CodeConfirmationInputProps {
  id: number
  size?: ComponentSize
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
  return (
    <Controller
      name={`code${id}`}
      defaultValue=""
      control={control}
      rules={{ required: true, pattern: /^[0-9]*$/ }}
      render={({ fieldState: { invalid }, field: { value, onChange } }) => (
        <Input
          {...register(`code${id}`)}
          textAlign="center"
          rounded="5"
          aspectRatio={1}
          width="100%"
          height="100%"
          flex={1}
          fontSize="xl"
          fontWeight="600"
          bg={tone.field}
          borderWidth={1}
          borderColor={invalid ? 'red-8' : `${tone.border} hover:color-6 focus:color-8`}
          outlineColor="outline-color"
          outlineStyle="focus:solid"
          outlineWidth="0px focus:2px"
          value={value}
          maxLength={codeSize}
          onChange={(e: any) => {
            const code = e.target?.value ?? e.nativeEvent?.text ?? ''
            // Max length is disabled to enable multiple digit paste
            if (code.length === codeSize) {
              // Paste logic

              const digits = code.split('')
              digits.forEach((digit: string, index: number) => {
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
          onKeyDown={(e: any) => {
            if (e.key === 'Backspace') {
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
            if (e.key === 'Enter') {
              onSubmit()
            }
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          type={secureTextEntry ? 'password' : 'text'}
          enterKeyHint={id === codeSize - 1 ? 'done' : 'next'}
          size="xl"
        />
      )}
    />
  )
}

interface CodeConfirmationProps {
  size?: ComponentSize
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
    <Form
      gap="2"
      items="center"
      minW="100%"
      justify="center"
      x={translateX}
      width="100%"
      mt="2"
      flexDirection="row"
      mb="0"
      pb="0"
      style={{ transition: 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}
      onSubmit={() => onSubmit()}
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
    </Form>
  )
}

// ResendTimer component
const ResendTimer = ({
  onComplete,
  onResendClick,
}: {
  onComplete: () => void
  onResendClick: () => void
}) => {
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [seconds, setSeconds] = useState(30)
  const startTimeRef = useRef<number>(null)
  const rafIdRef = useRef<number>(null)

  const handleResendClick = () => {
    setIsTimerActive(true)
    onResendClick()
  }

  useEffect(() => {
    if (!isTimerActive || seconds === 0) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const newSeconds = 30 - Math.floor(elapsed / 1000)

      if (newSeconds <= 0) {
        setSeconds(0)
        setIsTimerActive(false)
        onComplete()
        return
      }

      if (newSeconds !== seconds) {
        setSeconds(newSeconds)
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      startTimeRef.current = null
    }
  }, [isTimerActive, seconds === 0, onComplete])

  if (!isTimerActive) {
    return (
      <XStack
        items="center"
        self="flex-end"
        justify="flex-end"
        gap="2"
        cursor="pointer"
        className="flex"
        onPress={handleResendClick}
      >
        <RefreshCcw size={12} color="blue-10" />
        <Paragraph color="blue-10" text="right" fontSize="1">
          Resend OTP
        </Paragraph>
      </XStack>
    )
  }

  return (
    <XStack
      items="center"
      self="flex-end"
      justify="flex-end"
      gap="2"
      cursor="default"
      className="flex"
    >
      <RefreshCcw size={12} color="color-9" />
      <Paragraph color="color-9" text="right" fontSize="1">
        Resend in {seconds} {seconds > 1 ? 'seconds' : 'second'}
      </Paragraph>
    </XStack>
  )
}

/** ------ EXAMPLE ------ */
export function OneTimeCodeInputExample({
  size = 'lg',
  codeSize = 4,
  secureText = false,
}: {
  size?: ComponentSize
  codeSize?: number
  secureText?: boolean
}) {
  const [code, setCode] = useState<number>()
  const [codeEntered, setCodeEntered] = useState(false)
  const [verified, setVerified] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [activeInterface, setActiveInterface] = useState<'email' | 'code'>('code')
  const [isResendEnabled, setIsResendEnabled] = useState(false)

  const handleEnter = useCallback((code: number) => {
    setCode(code)
  }, [])

  const handleResendComplete = useCallback(() => {
    setIsResendEnabled(true)
  }, [])

  const handleResendClick = useCallback(() => {}, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (code !== undefined) {
      timer = setTimeout(() => {
        setCodeEntered(true)
      }, 2500)
    }

    return () => clearTimeout(timer)
  }, [code])

  //NOTE: for testing purposes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (codeEntered === true) {
      timer = setTimeout(() => {
        setVerified(false)
      }, 2000)
    }

    return () => clearTimeout(timer)
  }, [codeEntered])

  const showCode = activeInterface === 'email' || codeEntered

  return (
    <View items="center" justify="center" gap="4">
      <View
        position="relative"
        minW={300}
        items="center"
        justify="center"
        rounded="8"
        overflow="hidden"
        p="5"
        borderWidth={1}
        borderColor={tone.border}
        bg={tone.surface}
        boxShadow="0 1px 3px shadow-color"
      >
        <View position="absolute" t="4" r="4">
          {codeEntered ? (
            <View
              style={{ transition: 'transform 250ms ease' }}
              key="success"
              flexDirection="row"
              gap="2"
            >
              <AnimatePresence>
                {verified && (
                  <Paragraph
                    key="success"
                    color="green-10"
                    opacity="enter:0 exit:0"
                    x="enter:15px exit:15px"
                    scale="exit:0.5"
                    style={{
                      transition: 'transform 200ms ease, opacity 200ms ease',
                    }}
                  >
                    Success
                  </Paragraph>
                )}
              </AnimatePresence>
              <View
                opacity="enter:0.5"
                scale="enter:1.5"
                style={{
                  transition: 'transform 250ms ease, opacity 250ms ease',
                }}
              >
                <CheckCircle2 color="green-10" />
              </View>
            </View>
          ) : (
            <View
              key="email"
              opacity="enter:0.5"
              scale="enter:1.5"
              style={{ transition: 'transform 100ms ease, opacity 100ms ease' }}
            >
              {activeInterface === 'email' ? (
                <Mail size={16} opacity={0.25} />
              ) : (
                <KeySquare size={16} opacity={0.25} />
              )}
            </View>
          )}
        </View>

        <View
          key="code"
          style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
          width="100%"
          opacity={showCode ? 0 : 1}
          pointerEvents={showCode ? 'none' : 'auto'}
          transform={[{ translateX: showCode ? -150 : 0 }]}
        >
          <YStack
            key="code"
            style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
            opacity={`${code ? 0 : 1} exit:0`}
            justify="space-between"
            gap="4"
            width="100%"
            height="auto"
          >
            <View items="center" gap="2">
              <Text fontWeight="700" fontSize="6 lg:8" color="color-11">
                Code
              </Text>

              {email ? (
                <View
                  flexDirection="row"
                  items="center"
                  justify="center"
                  gap="2"
                  width="100%"
                >
                  <Mail size="1" color="color-11" />
                  <Paragraph size="4" fontWeight="500" color="color-11">
                    {email}
                  </Paragraph>
                </View>
              ) : (
                <View
                  flexDirection="row"
                  items="center"
                  justify="center"
                  gap="2"
                  width="100%"
                >
                  <Smartphone size={16} color="color-11" />
                  <Paragraph size="4" fontWeight="500" color="color-11">
                    (•••) ••• ••73
                  </Paragraph>
                </View>
              )}
            </View>

            <View px="4 lg:0px">
              <YStack gap="2">
                <CodeConfirmation
                  size={size}
                  codeSize={codeSize}
                  secureText={secureText}
                  onEnter={handleEnter}
                />

                <ResendTimer
                  onComplete={handleResendComplete}
                  onResendClick={handleResendClick}
                />
              </YStack>
            </View>

            {!email ? (
              <XStack
                borderColor="transparent"
                gap="2"
                items="center"
                justify="center"
                cursor="pointer"
                onPress={() => setActiveInterface('email')}
              >
                <Mail size={16} color="color-9" />
                <Paragraph color="color-9">Send code to email</Paragraph>
              </XStack>
            ) : null}
          </YStack>

          {code ? (
            <View
              position="absolute"
              width="100%"
              height="100%"
              items="center"
              justify="center"
              bg={tone.surface}
            >
              <Spinner color="color-9" />
            </View>
          ) : null}
        </View>

        <View
          position="absolute"
          x="enter:350px exit:0"
          opacity={`${!showCode ? 0 : 1} enter:0 exit:0`}
          bg={tone.surface}
          items="center"
          justify="center"
          width="100% lg:100%"
          height="100%"
          p="lg:5"
          pointerEvents={!showCode ? 'none' : 'auto'}
          transform={[{ translateX: !showCode ? 150 : 0 }]}
          style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
        >
          <AnimatePresence>
            {(activeInterface === 'email' || codeEntered) && (
              <>
                {!codeEntered ? (
                  <EmailInput
                    setActiveInterface={setActiveInterface}
                    email={email}
                    setEmail={setEmail}
                  />
                ) : (
                  <View
                    width="100%"
                    height="100%"
                    justify="space-between"
                    items="center"
                    gap="4"
                    pt="6"
                  >
                    <YStack flex={1} justify="center" items="center" width="100%" gap="2">
                      <Text fontWeight="bold" fontSize="6">
                        Code Verified
                      </Text>

                      <Paragraph color="color-9" text="center">
                        Your number is confirmed
                      </Paragraph>
                    </YStack>

                    <Button theme="accent" width="100%">
                      Continue
                    </Button>
                  </View>
                )}
              </>
            )}
          </AnimatePresence>
        </View>
      </View>
      <View flexDirection="row" items="center" gap="2">
        <LockKeyhole size={12} color="color-9" />
        <Paragraph size="2" color="color-9">
          Encrypted
        </Paragraph>
      </View>
    </View>
  )
}

const EmailInput = ({
  setActiveInterface,
  ...props
}: {
  setActiveInterface: (_: 'email' | 'code') => void
  email: string | null
  setEmail: (_: string | null) => void
}) => {
  const [email, setEmail] = useState<string | null>(props.email)

  const onSubmit = () => {
    setActiveInterface('code')
    props.setEmail(email)
  }

  return (
    <View pt="3" gap="4" width="100%" height="100%" justify="space-between">
      <XStack
        items="center"
        cursor="hover:pointer"
        self="flex-start"
        gap="1"
        l={-4}
        style={{ transition: 'color 200ms ease' }}
        onPress={() => setActiveInterface('code')}
      >
        <ChevronLeft size="1" color="color-9" />

        <Paragraph size="4" color="color-9">
          Back
        </Paragraph>
      </XStack>

      <YStack justify="flex-end" flex={1} gap="4" width="100%">
        <YStack gap="0" width="100%">
          <Label>Email Address</Label>
          <XStack width="100%" gap="4" justify="flex-start" items="flex-end">
            <Input
              inputMode="email"
              placeholder="Enter your email"
              autoComplete="email"
              onChange={(e: any) =>
                setEmail(e.target?.value ?? e.nativeEvent?.text ?? '')
              }
              width="100%"
              bg={tone.field}
              borderWidth={1}
              borderColor={`${tone.border} hover:color-6 focus:color-8`}
              outlineColor="outline-color"
              outlineStyle="focus:solid"
              outlineWidth="0px focus:2px"
            />
          </XStack>
        </YStack>

        <Button theme="accent" onPress={onSubmit}>
          Send
        </Button>
      </YStack>
    </View>
  )
}
