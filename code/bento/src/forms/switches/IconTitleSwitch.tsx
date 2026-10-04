import { Baby } from '../../icons'
import { useId, useState } from 'react'
import { Label, Text, View, XStack } from 'tamagui'
import { Switch } from './common/switchParts'

/** ------ EXAMPLE ------ */
export function IconTitleSwitch() {
  const uniqueId = useId()
  const [checked, setChecked] = useState(true)

  return (
    <XStack
      maxW="100%"
      borderColor="border-color"
      borderWidth={1}
      px="4"
      py="3"
      mt="@max-md/window:6"
      mx="@max-md/window:5"
      rounded="3"
      width={400}
      height="auto"
      items="center"
      gap="2-5"
      bg="background"
      theme="level2"
    >
      <Baby size="2" color="color-10" />
      <View flexDirection="column">
        <Label size="6" htmlFor={uniqueId + 'switch'}>
          Title here
        </Label>
        <Text theme="level2">Your description here</Text>
      </View>
      <Switch
        id={uniqueId + 'switch'}
        checked={checked}
        onCheckedChange={setChecked}
        marginLeft="auto"
        backgroundColor={`${checked ? 'color-9' : 'color-5'}`}
        size="2"
      >
        <Switch.Thumb borderColor="border-color" transition="200ms" bg="color-1" />
      </Switch>
    </XStack>
  )
}

IconTitleSwitch.fileName = 'IconTitleSwitch'
