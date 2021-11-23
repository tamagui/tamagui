import dynamic from 'next/dynamic'

const Rnw = () => {
  const RnwTest = dynamic(() => import('../../bench/change-css-prop/rnw'), { ssr: false })

  return <RnwTest />
}

export default Rnw
