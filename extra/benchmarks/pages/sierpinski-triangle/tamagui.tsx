import dynamic from 'next/dynamic'

const SierpinskiTriangle = () => {
  const TamaguiTest = dynamic(() => import('../../bench/sierpinski-triangle/tamagui'), {
    ssr: false,
  })

  return <TamaguiTest />
}

export default SierpinskiTriangle
