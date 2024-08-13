import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

import { CodeInline } from '../../../components/Code'

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle={
        <>
          <CodeInline>Native</CodeInline> prop pairs well 🍷 with compound components
        </>
      }
      theme="blue"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-1.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-2.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-3.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-4.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-5.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: '/talk-images/select-6.png',
          },
        ],
      ]}
    />
  )
})
