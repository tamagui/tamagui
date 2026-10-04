import { Camera, Check, Eye, EyeOff } from '../../icons'
import { useId, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  AnimatePresence,
  Button,
  H1,
  Label,
  SizableText,
  Spinner,
  View,
  isWeb,
  useEvent,
} from 'tamagui'
import { Switch } from '../switches/common/switchParts'
import { Input } from '../inputs/components/inputsParts'
import { FormCard } from './components/layoutParts'
import { CheckboxSkin as Checkbox } from '../checkboxes/common/checkboxParts'

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
        items="stretch"
        maxW="100%"
        width={450}
        gap="4 @max-sm/window:3"
        py="@max-sm/window:6 max-sm:4"
        px="@max-sm/window:5"
      >
        <H1 size="9" fontWeight="bold">
          Sign Up
        </H1>
        <View flexDirection="row" flexWrap="wrap" width="100%" gap="4">
          <View flexDirection="column" flex={1} gap="1" minW="100% @sm/window:inherit">
            <Input>
              <Input.Label htmlFor={uniqueId + 'first-name'}>First Name</Input.Label>
              <Input.Box minW="100%">
                <Input.Area id={uniqueId + 'first-name'} placeholder="First name" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" flex={1} gap="1">
            <Input>
              <Input.Label htmlFor={uniqueId + 'last-name'}>Last Name</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + 'last-name'} placeholder="Last name" />
              </Input.Box>
            </Input>
          </View>
        </View>
        <Input>
          <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
          <Input.Box>
            <Input.Area
              id={uniqueId + 'password'}
              secureTextEntry={!showPassword}
              placeholder="Password"
            />
            <Input.Icon cursor="pointer" onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye color="color-10" /> : <EyeOff color="color-10" />}
            </Input.Icon>
          </Input.Box>
        </Input>
        <Input>
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
        <View flexDirection="row" flexWrap="wrap" gap="4">
          <Input flex={1}>
            <Input.Label htmlFor={uniqueId + 'city'}>City</Input.Label>
            <Input.Box>
              <Input.Area id={uniqueId + 'city'} placeholder="City" />
            </Input.Box>
          </Input>
          <Input flex={1}>
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
        <View flexDirection="column" gap="1">
          <Input>
            <Input.Label htmlFor={uniqueId + 'street'}>Street Name</Input.Label>
            <Input.Box>
              <Input.Area id={uniqueId + 'street'} placeholder="Street name" />
            </Input.Box>
          </Input>
        </View>
        <View
          borderWidth={1}
          borderColor="border-color"
          borderStyle="dotted"
          flexDirection="column"
          items="center"
          gap="2"
          py="6"
          rounded="6"
        >
          <View
            tabIndex={0}
            bg="background hover:background-hover focus:background-focus"
            borderColor="border-color hover:border-color-hover focus:border-color-focus"
            borderWidth={1}
            rounded={10}
            cursor="pointer"
            height="8"
            width="8"
            position="relative"
            render="button"
            id={uniqueId + 'add-pic'}
            theme="level2"
          >
            <View
              theme="level2"
              position="absolute"
              width="100%"
              height="100%"
              justify="center"
              items="center"
            >
              <Camera />
            </View>
          </View>

          <Label fontWeight="bold" htmlFor={uniqueId + 'add-pic'} size="3">
            Add Profile picture
          </Label>
        </View>
        <VerticalCheckboxes />
        <View flexDirection="row" items="center">
          <Label theme="level2" htmlFor={uniqueId + 'notf'}>
            Receive notifications
          </Label>
          <Switch
            id={uniqueId + 'notf'}
            checked={receiveNotification}
            onCheckedChange={setReceiveNotification}
            marginLeft="auto"
            size="2"
          >
            <Switch.Thumb style={{ transition: 'transform 250ms ease' }} />
          </Switch>
        </View>

        <Button
          theme="accent"
          disabled={status === 'loading'}
          onPress={signUp}
          cursor={status === 'loading' ? 'progress' : 'pointer'}
          self="flex-end"
          minW="100% md:12"
          maxW="md:12"
          iconAfter={
            <AnimatePresence>
              {status === 'loading' && (
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
        {!isWeb && <SafeAreaView />}
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
    <View flexDirection="column" gap="1">
      <Input.Label htmlFor={'customize-content'}>Customize content</Input.Label>
      <View flexDirection="column" gap="1">
        <SizableText size="4" fontWeight="300" color="color-9">
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
    <View flexDirection="row" width={150} items="center" gap="3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size="3" htmlFor={id}>
        {label}
      </Label>
    </View>
  )
}
