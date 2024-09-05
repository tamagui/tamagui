import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Partial Evaluation"
      theme="green"
      subTitle="How it works"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Babel - ',
              },

              {
                type: 'code-inline',
                content: 'JSXExpression',
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Normalizes ternaries and spreads',
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Get statics from Babel - ',
              },

              {
                type: 'code-inline',
                content: 'scope.getAllBindings()',
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Load imports - ',
              },

              {
                type: 'code-inline',
                content: 'Esbuild + require()',
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: `Run in virtual machine - `,
              },

              {
                type: 'code-inline',
                content: 'require("vm")',
              },
            ],
          },
        ],
      ]}
    />
  )
})
