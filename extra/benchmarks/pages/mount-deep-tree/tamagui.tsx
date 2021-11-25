import dynamic from 'next/dynamic'

const SierpinskiTriangle = () => {
  const TamaguiTest = dynamic(() => import('../../bench/mount-deep-tree/tamagui'), { ssr: false })

  return <TamaguiTest />
}

export default SierpinskiTriangle
