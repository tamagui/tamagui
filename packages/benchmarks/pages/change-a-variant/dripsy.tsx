import dynamic from 'next/dynamic'

const CreateAndMountComponent = () => {
  const DripsyTest = dynamic(() => import('../../bench/change-a-variant/dripsy'), { ssr: false })

  return <DripsyTest />
}

export default CreateAndMountComponent
