import dynamic from 'next/dynamic'

const CreateAndMountComponent = () => {
  const TamaguiTest = dynamic(() => import('../../bench/change-a-variant/tamagui'), { ssr: false })

  return <TamaguiTest />
}

export default CreateAndMountComponent
