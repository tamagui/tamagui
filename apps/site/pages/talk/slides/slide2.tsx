import { Slide } from 'components/Slide'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="What is Tamagui"
      theme="orange"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `@tamagui/core`,
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        Universal style library{' '}
                        <span style={{ opacity: 0.5 }}>(Native + Web)</span>
                      </>
                    ),
                  },
                ],
              },
            ],
          },
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `@tamagui/static`,
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: `Optimizing compiler that works with core`,
                  },
                ],
              },
            ],
          },
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `tamagui`,
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: `Complete universal component kit`,
                  },
                ],
              },
            ],
          },
        ],
      ]}
    />
  )
})
