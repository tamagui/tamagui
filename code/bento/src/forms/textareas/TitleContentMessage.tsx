import { Info } from '../../icons'
import { Button, Label, Text, TextArea, View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function TitleContentMessage() {
  return (
    <View flexDirection="column" width={400} maxW="100%" gap="1" py="@sm/window:6">
      <Label htmlFor="title-content" size="3">
        Title of Text Area
      </Label>
      <TextArea
        placeholderTextColor="color-8"
        id="title-content"
        size="3"
        fontWeight="300"
        height={180}
        placeholder="Your text here"
      />
      <View flexDirection="row" mt="2-5" items="center" gap="2" theme="level2">
        <Info size={15} />
        <Text fontWeight="300" fontSize="2" theme="level3">
          some hints or info about text area
        </Text>
      </View>

      <Button theme="accent" mt="3">
        <Button.Text>Submit</Button.Text>
      </Button>
    </View>
  )
}

TitleContentMessage.fileName = 'TitleContentMessage'
