import dynamic from 'next/dynamic'

const CreateAndMountComponent = () => {
  const RnwTest = dynamic(() => import('../../bench/change-a-variant/rnw'), { ssr: false })

  return <RnwTest />
}

export default CreateAndMountComponent
