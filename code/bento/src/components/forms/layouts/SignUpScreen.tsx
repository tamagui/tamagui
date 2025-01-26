import { Camera, Check, Eye, EyeOff } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Checkbox,
  H1,
  Label,
  SizableText,
  Spinner,
  Stack,
  Switch,
  Theme,
  View,
  useEvent,
} from 'tamagui'
import { FormCard } from './components/layoutParts'
import { Input } from '../inputs/components/inputsParts'
import { isWeb } from 'tamagui'
import { SafeAreaView } from 'react-native'

/** simulate signin */
function useSignIn() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  return {
    status: status,
    signUp: () => {
      setStatus('loading')
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    },
  }
}

/** ------ EXAMPLE ------ */
export function SignUpScreen() {
  const uniqueId = useId()
  const { signUp, status } = useSignIn()
  const [showPassword, setShowPassword] = useState(false)
  const [receiveNotification, setReceiveNotification] = useState(false)
  return (
    <FormCard>
      <View
        flexDirection="column"
        alignItems="stretch"
        maxWidth="100%"
        width={450}
        gap="$4"
        $group-window-xs={{
          gap: '$3',
          paddingVertical: '$6',
          paddingHorizontal: '$5',
        }}
        $xs={{ paddingVertical: '$4' }}
      >
        <H1 size="$9" fontWeight="bold">
          Sign Up
        </H1>
        <View flexDirection="row" flexWrap="wrap" width="100%" gap="$4">
          <View
            flexDirection="column"
            flex={1}
            gap="$1"
            minWidth="100%"
            $group-window-gtXs={{ minWidth: 'inherit' }}
          >
            <Input size="$4">
              <Input.Label htmlFor={uniqueId + 'first-name'}>First Name</Input.Label>
              <Input.Box minWidth="100%">
                <Input.Area id={uniqueId + 'first-name'} placeholder="First name" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" flex={1} gap="$1">
            <Input size="$4">
              <Input.Label htmlFor={uniqueId + 'last-name'}>Last Name</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + 'last-name'} placeholder="Last name" />
              </Input.Box>
            </Input>
          </View>
        </View>
        <Input size="$4">
          <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
          <Input.Box>
            <Input.Area
              id={uniqueId + 'password'}
              secureTextEntry={!showPassword}
              placeholder="Password"
            />
            <Input.Icon cursor="pointer" onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
            </Input.Icon>
          </Input.Box>
        </Input>
        <Input size="$4">
          <Input.Label htmlFor={uniqueId + 'repeat-password'}>
            Repeat the password
          </Input.Label>
          <Input.Box>
            <Input.Area
              secureTextEntry
              id={uniqueId + 'repeat-password'}
              placeholder="Repeat password"
            />
          </Input.Box>
        </Input>
        <View flexDirection="row" flexWrap="wrap" gap="$4">
          <Input flex={1} size="$4">
            <Input.Label htmlFor={uniqueId + 'city'}>City</Input.Label>
            <Input.Box>
              <Input.Area id={uniqueId + 'city'} placeholder="City" />
            </Input.Box>
          </Input>
          <Input flex={1} size="$4">
            <Input.Label htmlFor={uniqueId + 'postal'}>Postal code / ZIP</Input.Label>
            <Input.Box>
              <Input.Area
                inputMode="decimal"
                id={uniqueId + 'postal'}
                placeholder="1005"
              />
            </Input.Box>
          </Input>
        </View>
        <View flexDirection="column" gap="$1">
          <Input size="$4">
            <Input.Label htmlFor={uniqueId + 'street'}>Street Name</Input.Label>
            <Input.Box>
              <Input.Area id={uniqueId + 'street'} placeholder="Street name" />
            </Input.Box>
          </Input>
        </View>
        <View
          borderWidth={1}
          borderColor="$borderColor"
          borderStyle="dotted"
          flexDirection="column"
          alignItems="center"
          gap="$2"
          paddingVertical="$6"
          borderRadius="$6"
        >
          <View
            focusable
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            borderRadius={10}
            focusStyle={{
              backgroundColor: '$backgroundFocus',
              borderColor: '$borderColorFocus',
            }}
            hoverStyle={{
              backgroundColor: '$backgroundHover',
              borderColor: '$borderColorHover',
            }}
            cursor="pointer"
            tag="button"
            height="$8"
            width="$8"
            id={uniqueId + 'add-pic'}
            theme="alt1"
          >
            <Stack
              theme="alt1"
              position="absolute"
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="center"
            >
              <Camera />
            </Stack>
          </View>

          <Label fontWeight="bold" htmlFor={uniqueId + 'add-pic'} size="$3">
            Add Profile picture
          </Label>
        </View>
        <VerticalCheckboxes />
        <View flexDirection="row" alignItems="center">
          <Label theme="alt1" htmlFor={uniqueId + 'notf'}>
            Receive notifications
          </Label>
          <Switch
            id={uniqueId + 'notf'}
            checked={receiveNotification}
            onCheckedChange={setReceiveNotification}
            marginLeft="auto"
            size="$2"
          >
            <Switch.Thumb animation="bouncy" />
          </Switch>
        </View>
        <Theme inverse>
          <Button
            disabled={status === 'loading'}
            onPress={signUp}
            cursor={status === 'loading' ? 'progress' : 'pointer'}
            alignSelf="flex-end"
            minWidth="100%"
            $gtSm={{
              maxWidth: '$12',
              minWidth: '$12',
            }}
            iconAfter={
              <AnimatePresence>
                {status === 'loading' && (
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
          {!isWeb && <SafeAreaView />}
        </Theme>
      </View>
    </FormCard>
  )
}

SignUpScreen.fileName = 'SignUpScreen'

export function VerticalCheckboxes() {
  const [values, setValues] = useState([
    {
      id: 'hor-developer',
      label: 'Developer',
      checked: false,
    },
    {
      id: 'hor-designer',
      label: 'Designer',
      checked: false,
    },
  ])
  const toggleValue = (value: string) => {
    setValues((prev) =>
      prev.map((item) => ({
        ...item,
        checked: item.id === value ? !item.checked : item.checked,
      }))
    )
  }
  return (
    <View flexDirection="column" gap="$1">
      <Input.Label htmlFor={'customize-content'}>Customize content</Input.Label>
      <View flexDirection="column" gap="$1">
        <SizableText size="$4" fontWeight="300" col="$gray10">
          Select type of user:
        </SizableText>
        <View flexDirection="column">
          {values.map(({ id, label, checked }) => (
            <Item
              key={label}
              id={id}
              toggleValue={toggleValue}
              label={label}
              checked={checked}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

function Item({
  id,
  toggleValue,
  label,
  checked,
}: {
  id: string
  toggleValue: (value: string) => void
  label: string
  checked: boolean
}) {
  const onCheckedChange = useEvent(() => toggleValue(id))
  return (
    <View flexDirection="row" width={150} alignItems="center" gap="$3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size="$3" htmlFor={id}>
        {label}
      </Label>
    </View>
  )
}
