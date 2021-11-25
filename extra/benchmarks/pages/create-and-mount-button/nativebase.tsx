import dynamic from 'next/dynamic'
import React from 'react'

const CreateAndMountComponent = () => {
  const NativebaseTest = dynamic(() => import('../../bench/create-and-mount-button/nativebase'), {
    ssr: false,
  })

  return <NativebaseTest />
}

export default CreateAndMountComponent
