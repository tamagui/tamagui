import dynamic from 'next/dynamic'

const Tamagui = () => {
  const TamaguiTest = dynamic(() => import('../../bench/change-css-prop/tamagui'), { ssr: false })

  return <TamaguiTest />
}

export default Tamagui
