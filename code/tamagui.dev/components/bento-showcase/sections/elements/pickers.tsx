import { XStack, YStack, styled } from 'tamagui'

import * as Pickers from '@tamagui/bento/component/elements/pickers'
import { Showcase } from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

const Wrapper = styled(XStack, {
  p: '$4',
  py: '$8',
  w: '100%',
  jc: 'center',
  ai: 'center',
})

export function pickers({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$16">
        <Showcase unlock fileName={Pickers.ImagePicker.fileName} title="Image Picker">
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
    </BentoShowcaseProvider>
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
