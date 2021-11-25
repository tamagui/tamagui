import dynamic from 'next/dynamic'
import React from 'react'

const CreateAndMountComponent = () => {
  const TamaguiTest = dynamic(() => import('../../bench/create-and-mount-button/tamagui'), {
    ssr: false,
  })

  return <TamaguiTest />
}

export default CreateAndMountComponent
