import { FeedScreen } from 'app/features/feed/screen'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'top']}>
      <FeedScreen />
    </SafeAreaView>
  )
}
