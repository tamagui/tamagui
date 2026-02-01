import { YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { ProLicense } from '~/features/pro/ProLicense'

export default () => (
  <>
    <HeadInfo title="Pro License" />
    <YStack p="$8">
      <ProLicense />
    </YStack>
  </>
)
