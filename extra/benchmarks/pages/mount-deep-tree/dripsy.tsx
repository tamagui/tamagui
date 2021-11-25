import dynamic from 'next/dynamic'

const SierpinskiTriangle = () => {
  const DripsyTest = dynamic(() => import('../../bench/mount-deep-tree/dripsy'), { ssr: false })

  return <DripsyTest />
}

export default SierpinskiTriangle
