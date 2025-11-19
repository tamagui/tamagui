import { Slide } from '../Slide'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui is..."
      theme="green"
      steps={[
        [
          {
            type: 'bullet-point',
            props: {
              mt: '$6',
            },
            content: [
              {
                type: 'code-inline',
                props: {
                  size: '$11',
                },
                content: `@tamagui/core`,
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        Universal styles and design systems{' '}
                        <span style={{ opacity: 0.5 }}>(Native + Web)</span>
                      </>
                    ),
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            props: {
              mt: '$6',
            },
            content: [
              {
                type: 'code-inline',
                props: {
                  size: '$11',
                },
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
        ],
        [
          {
            type: 'bullet-point',
            props: {
              mt: '$6',
            },
            content: [
              {
                type: 'code-inline',
                props: {
                  size: '$11',
                },
                content: `tamagui`,
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: `Universal component kit`,
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
