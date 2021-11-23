import dynamic from 'next/dynamic'

const CreateAndMountComponent = () => {
  const NativebaseTest = dynamic(() => import('../../bench/change-a-variant/nativebase'), {
    ssr: false,
  })

  return <NativebaseTest />
}

export default CreateAndMountComponent
