import { YStack } from 'tamagui'

import * as TextAreas from '@tamagui/bento/component/forms/textareas'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof textareasGetComponentCodes>

export function textareas() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase
        fileName={TextAreas.WritePreviewAction.fileName}
        title="Comment Box with Preview"
      >
        <Wrapper>
          <TextAreas.WritePreviewAction />
        </Wrapper>
      </Showcase>

      <Showcase fileName={TextAreas.AvatarNameContentAction.fileName} title="Comment Box">
        <Wrapper>
          <TextAreas.AvatarNameContentAction />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={TextAreas.AvatarOutContentAction.fileName}
        title="Comment Box Floating"
      >
        <Wrapper>
          <TextAreas.AvatarOutContentAction />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={TextAreas.TitleContentMessage.fileName}
        title="Comment Box Minimal"
      >
        <Wrapper>
          <TextAreas.TitleContentMessage />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function textareasGetComponentCodes() {
  return {
    codes: {
      AvatarNameContentAction: '',
      AvatarOutContentAction: '',
      TitleContentMessage: '',
      WritePreviewAction: '',
    } as Omit<Record<keyof typeof TextAreas, string>, 'getCode'>,
  }
}
