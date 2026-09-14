import { XStack, YStack, styled } from 'tamagui'

import * as Pickers from '@tamagui/bento/component/elements/pickers'
import { Showcase } from '~/components/bento-showcase/_Showcase'

const Wrapper = styled(XStack, {
  paddingRight: '4',
  paddingLeft: '4',
  py: '8',
  width: '100%',
  justify: 'center',
  items: 'center',
})

export function pickers() {
  return (
    <YStack pb="10" gap="16">
      <Showcase fileName={Pickers.ImagePicker.fileName} title="Image Picker">
        <Wrapper>
          <Pickers.ImagePicker />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Pickers.UploadFile.fileName} title="Upload File">
        <Wrapper>
          <Pickers.UploadFile />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function pickersGetComponentCodes() {
  return {
    codes: {
      ImagePicker: '',
      UploadFile: '',
    },
  }
}
