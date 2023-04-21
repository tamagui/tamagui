import { getStudioLayout } from '@components/layouts/StudioLayout'
import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
import { useRequiresLoading } from '@protected/studio/useGlobalState'

export default function Page() {
  useRequiresLoading()
  return <TokensPage />
}
Page.getLayout = getStudioLayout
