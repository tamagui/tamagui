import { Info } from '@tamagui/lucide-icons'
import { Button, Label, Text, TextArea, View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function TitleContentMessage() {
  return (
    <View
      flexDirection="column"
      width={400}
      maxWidth="100%"
      gap="$1"
      $group-window-sm={{
        paddingVertical: '$6',
      }}
    >
      <Label htmlFor="title-content" size="$3">
        Title of Text Area
      </Label>
      <TextArea
        id="title-content"
        size="$3"
        fontWeight="300"
        height={180}
        placeholder="Your text here"
      />
      <View
        flexDirection="row"
        theme="alt1"
        marginTop="$2.5"
        alignItems="center"
        gap="$2"
      >
        <Info size={15} />
        <Text fontWeight="300" theme="alt2" fontSize="$2">
          some hints or info about text area
        </Text>
      </View>

      <Button themeInverse marginTop="$3">
        <Button.Text>Submit</Button.Text>
      </Button>
    </View>
  )
}

TitleContentMessage.fileName = 'TitleContentMessage'
