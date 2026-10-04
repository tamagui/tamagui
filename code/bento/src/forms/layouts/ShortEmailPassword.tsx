import { Lock, Mail } from '../../icons'
import { Button, View } from 'tamagui'
import { Input } from '../inputs/components/inputsParts'
import { FormCard } from './components/layoutParts'

/** -------- EXAMPLE ------------ */
export function ShortEmailPassword() {
  return (
    <FormCard
      rounded={20}
      borderColor="border-color"
      self="center"
      minW="@max-md/window:100%"
      px="@max-md/window:5"
      py="@max-md/window:6"
    >
      <View flexDirection="column" gap="5" items="center" minW={'100%'}>
        <View flexDirection="column" gap="3" minW={'100%'}>
          <Input minW="100%">
            <Input.Box>
              <Input.Icon>
                <Mail />
              </Input.Icon>
              <Input.Area pl={0} placeholder="Your Email" />
            </Input.Box>
          </Input>
          <Input minW="100%">
            <Input.Box>
              <Input.Icon>
                <Lock />
              </Input.Icon>
              <Input.Area secureTextEntry pl={0} placeholder="Password" />
            </Input.Box>
          </Input>
        </View>
        <View
          flexDirection="row"
          height="10"
          gap="4"
          justify="space-between"
          width="100%"
        >
          <Button flex={1} flexBasis={0}>
            <Button.Text>Back</Button.Text>
          </Button>

          <Button theme="accent" flex={1} flexBasis={0}>
            <Button.Text>Continue</Button.Text>
          </Button>
        </View>
      </View>
    </FormCard>
  )
}

ShortEmailPassword.fileName = 'ShortEmailPassword'
