import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

import { CodeInline } from '../../../components/Code'

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle={
        <>
          <CodeInline>Native</CodeInline> prop pairs well 🍷 with composable components
        </>
      }
      theme="blue"
      steps={[
        [
          {
            type: 'image',
            image: require('../images/select.png').default,
          },
        ],
      ]}
    />
  )
})
