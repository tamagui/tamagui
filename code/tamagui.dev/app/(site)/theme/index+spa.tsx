import { ThemePage, ThemePageUpdater } from '~/features/studio/theme/ThemePage'
import { defaultThemeSuiteItem } from '~/features/studio/theme/defaultThemeSuiteItem'

export default () => {
  return (
    <ThemePageUpdater
      id={0}
      search=""
      theme={defaultThemeSuiteItem as any}
      user_name={null}
    />
  )
}
