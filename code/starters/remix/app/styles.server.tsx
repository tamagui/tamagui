import Tamagui from '../tamagui.config'

export const Styles = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Tamagui.getCSS(),
      }}
    />
  )
}
