import { getStudioLayout } from '@components/layouts/StudioLayout'
import { studioRootDir } from '@protected/studio/constants'
import LoadPage from '@protected/studio/load/page'
import { rootStore } from '@protected/studio/state/RootStore'
import { useReaction } from '@tamagui/use-store'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useReaction(
    rootStore,
    (store) => store.fsReadSucceeded,
    (success) => {
      if (success) {
        router.push(`${studioRootDir}/`)
      }
    }
  )

  return <LoadPage />
}

Page.getLayout = getStudioLayout
