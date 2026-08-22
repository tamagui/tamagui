import { useState } from 'react'
import { Slider, Text, YStack } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #4146: slider thumb stops following the cursor once
 * the page is scrolled.
 *
 * A responder event's pageX/pageY are document-relative, while the track is
 * measured with getBoundingClientRect (viewport-relative). Mixing the two makes
 * the reported value drift by exactly the scroll offset, so the case puts a tall
 * spacer above the sliders to force a scroll before dragging.
 */
export function SliderScrollOffsetCase() {
  const [vertical, setVertical] = useState([50])
  const [horizontal, setHorizontal] = useState([50])

  return (
    <YStack padding="$4" gap="$4">
      {/* pushes the sliders below the fold so the drag happens while scrolled */}
      <YStack height={1200} backgroundColor="$color3" />

      <Text id={TEST_IDS.sliderScrollVerticalValue}>{vertical[0]}</Text>
      <Slider
        id={TEST_IDS.sliderScrollVertical}
        orientation="vertical"
        height={200}
        width={20}
        value={vertical}
        onValueChange={setVertical}
        min={0}
        max={100}
        step={1}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} circular size="$2" />
      </Slider>

      <Text id={TEST_IDS.sliderScrollHorizontalValue}>{horizontal[0]}</Text>
      <Slider
        id={TEST_IDS.sliderScrollHorizontal}
        orientation="horizontal"
        width={200}
        value={horizontal}
        onValueChange={setHorizontal}
        min={0}
        max={100}
        step={1}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} circular size="$2" />
      </Slider>

      <YStack height={600} />
    </YStack>
  )
}
