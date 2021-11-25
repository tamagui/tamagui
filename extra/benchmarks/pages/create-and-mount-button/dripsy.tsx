import dynamic from 'next/dynamic'
import React from 'react'

const CreateAndMountComponent = () => {
  const DrispyTest = dynamic(() => import('../../bench/create-and-mount-button/drispy'), {
    ssr: false,
  })

  return <DrispyTest />
}

export default CreateAndMountComponent
