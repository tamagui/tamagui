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
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-1.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-2.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-3.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-4.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-5.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'circled',
            image: require('../images/select-6.png').default,
          },
        ],
      ]}
    />
  )
})
