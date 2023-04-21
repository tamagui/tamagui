import { getStudioLayout } from '@components/layouts/StudioLayout'
import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
import { useRequiresLoading } from '@protected/studio/useGlobalState'

export default function Page() {
  useRequiresLoading()
  return <AnimationsPage />
}
Page.getLayout = getStudioLayout
