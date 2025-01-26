import { H1, XStack, YStack, styled } from 'tamagui'

import * as Pickers from '../../components/elements/pickers'
// import { getCode } from '../../components/elements/pickers'
import { Showcase } from '../../components/general/_Showcase'

const Wrapper = styled(XStack, {
  p: '$4',
  py: '$8',
  w: '100%',
  jc: 'center',
  ai: 'center',
})

export function pickers(props: {
  codes: {
    ImagePicker: string
    UploadFile: string
  }
}) {
  return (
    <YStack pb="$10" gap="$16">
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
      // ImagePicker: getCode('ImagePicker'),
      // UploadFile: getCode('UploadFile'),
      ImagePicker: '',
      UploadFile: '',
    },
  }
}
