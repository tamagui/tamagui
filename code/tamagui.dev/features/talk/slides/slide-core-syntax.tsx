import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

const highlightCode = createCodeHighlighter()

const styledSnippet = highlightCode(
  `export const Heading = styled(Text, {
  color: '$color',
  fontSize: 18,
  
  hoverStyle: { color: '$color3' },

  // media query
  $small: { fontSize: 12 },

  variants: {
    size: {
      bigger: {
        fontSize: 22,
      },
    },
  },
})`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      theme="pink"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: styledSnippet,
              },

              {
                type: 'vertical',
                variant: 'center-vertically',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 35 35"
                          fill="none"
                          style={{
                            transform: `scale(3)`,
                          }}
                        >
                          <circle
                            cx="17.5"
                            cy="17.5"
                            r="14.5"
                            stroke="currentColor"
                            stroke-width="2"
                          ></circle>
                          <path
                            d="M12.8184 31.3218L31.8709 20.3218"
                            stroke="currentColor"
                          ></path>
                          <path
                            d="M3.31836 14.8674L22.3709 3.86743"
                            stroke="currentColor"
                          ></path>
                          <path
                            d="M8.65332 29.1077L25.9738 19.1077"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M9.21582 16.0815L26.5363 6.08154"
                            stroke="currentColor"
                            stroke-linecap="round"
                          ></path>
                          <path
                            d="M13.2334 14.2297L22.5099 21.1077"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M16.6973 12.2302L25.9736 19.1078"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M9.21582 16.0815L19.0459 23.1078"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </>
                    ),
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
