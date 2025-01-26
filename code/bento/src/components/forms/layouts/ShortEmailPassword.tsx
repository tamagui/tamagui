import { Button, Theme, View } from 'tamagui'
import { Mail, Lock } from '@tamagui/lucide-icons'
import { Input } from '../inputs/components/inputsParts'
import { FormCard } from './components/layoutParts'

/** -------- EXAMPLE ------------ */
export function ShortEmailPassword() {
  return (
    <FormCard
      borderRadius={20}
      borderColor="$borderColor"
      alignSelf="center"
      $group-window-sm={{
        minWidth: '100%',
        paddingHorizontal: '$5',
        paddingVertical: '$6',
      }}
    >
      <View flexDirection="column" gap="$5" alignItems="center" minWidth={'100%'}>
        <View flexDirection="column" gap="$3" minWidth={'100%'}>
          <Input size="$4" minWidth="100%">
            <Input.Box>
              <Input.Icon>
                <Mail />
              </Input.Icon>
              <Input.Area paddingLeft={0} placeholder="Your Email" />
            </Input.Box>
          </Input>
          <Input size="$4" minWidth="100%">
            <Input.Box>
              <Input.Icon>
                <Lock />
              </Input.Icon>
              <Input.Area secureTextEntry paddingLeft={0} placeholder="Password" />
            </Input.Box>
          </Input>
        </View>
        <View
          flexDirection="row"
          height="$3.5"
          gap="$4"
          justifyContent="space-between"
          width="100%"
        >
          <Button flex={1} flexBasis={0}>
            <Button.Text>Back</Button.Text>
          </Button>
          <Theme inverse>
            <Button flex={1} flexBasis={0}>
              <Button.Text>Continue</Button.Text>
            </Button>
          </Theme>
        </View>
      </View>
    </FormCard>
  )
}

ShortEmailPassword.fileName = 'ShortEmailPassword'
