import { YStack } from 'tamagui'

import * as TextAreas from '../../components/forms/textareas'
// import { getCode } from '../../components/forms/textareas'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof textareasGetComponentCodes>

export function textareas(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
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
