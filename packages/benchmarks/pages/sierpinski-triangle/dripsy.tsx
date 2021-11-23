import dynamic from 'next/dynamic'

const SierpinskiTriangle = () => {
  const DripsyTest = dynamic(() => import('../../bench/sierpinski-triangle/dripsy'), {
    ssr: false,
  })

  return <DripsyTest />
}

export default SierpinskiTriangle
