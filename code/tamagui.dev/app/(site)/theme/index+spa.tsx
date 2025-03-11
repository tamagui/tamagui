import { ThemePage } from '~/features/studio/theme/ThemePage'
import { defaultThemeSuiteItem } from '~/features/studio/theme/defaultThemeSuiteItem'

export default () => {
  return (
    <ThemePage id={0} search="" theme={defaultThemeSuiteItem as any} user_name={null} />
  )
}
