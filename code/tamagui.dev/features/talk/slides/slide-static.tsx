import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'
const highlightCode = createCodeHighlighter()

const inputSnippet = highlightCode(
  `export default (props) => (
  <Stack
    backgroundColor={myCustomColor}
    width={550}
    $gtSm={{
      paddingHorizontal: '$small'
    }}>
    <Heading size={
      props.big ? 'large' : 'small'
    }>
      Lorem ipsum.
    </Heading>
  </Stack>
)`,
  'tsx'
)

const outputSnippet = highlightCode(
  `export default props =>
  <div className={_cn}>
    <h1 className={_cn2 + (
      _cn3 + (props.big ? _cn4 : _cn5)
    )}>
      Lorem ipsum.
    </h1>
  </div>

const _cn5 = " _fos-16px"
const _cn4 = " _fos-22px"
const _cn3 = " _bg-180kg62 _col-b5vn3b _mt-0px _mr-0px _mb-0px _ml-0px _ww-break-word _bxs-border-box _ff-System _dsp-inline  "
const _cn2 = "  font_System"
const _cn = "  is_Stack _bg-lrpixp _fd-col _miw-0px _mih-0px _pos-relative _bxs-bb _fb-auto _dsp-flex _fs-0 _ai-stretch  _w-550px _pr-1aj14ca _pl-1aj14ca  _pr-_gtSm_lrpixp _pl-_gtSm_lrpixp"`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="@tamagui/static"
      subTitle="Optimizing compiler"
      stepsStrategy="replace"
      theme="green"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: inputSnippet,
              },
              {
                type: 'code',
                content: outputSnippet,
              },
            ],
          },
        ],
      ]}
    />
  )
})
