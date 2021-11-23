import dynamic from 'next/dynamic'

const Dripsy = () => {
  const DripsyTest = dynamic(() => import('../../bench/change-css-prop/dripsy'), { ssr: false })

  return <DripsyTest />
}

export default Dripsy
