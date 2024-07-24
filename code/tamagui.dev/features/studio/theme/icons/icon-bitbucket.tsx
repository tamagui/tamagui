import { themed } from '@tamagui/helpers-icon'
import { memo } from 'react'
import { Path, Svg } from '@tamagui/react-native-svg'
const IconBitbucket = (_props) => {
  const { size, ...props } = _props
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"
      />
    </Svg>
  )
}
const Memo = memo(themed(IconBitbucket))
export { Memo as IconBitbucket }
