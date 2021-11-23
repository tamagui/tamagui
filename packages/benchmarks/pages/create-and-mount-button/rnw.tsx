import dynamic from 'next/dynamic'
import React from 'react'

const CreateAndMountComponent = () => {
  const RnwTest = dynamic(() => import('../../bench/create-and-mount-button/rnw'), {
    ssr: false,
  })

  return <RnwTest />
}

export default CreateAndMountComponent
