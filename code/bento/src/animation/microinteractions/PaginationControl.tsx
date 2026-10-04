import { useState } from 'react'
import { Button, View, getTokenValue } from 'tamagui'
import { ArrowLeft, ArrowRight } from '../../icons'

const pageNum = 5

export const PaginationControl = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const handlePrevClick = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + pageNum) % pageNum)
  }
  const handleNextClick = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % pageNum)
  }

  const paginationWidth = (2 * getTokenValue('2', 'radius') + (pageNum - 1) * 1.5) * 10

  return (
    <View flex={1} flexDirection="row" items="center" justify="center" gap="3">
      <Button
        size="md"
        circular
        icon={ArrowLeft}
        scaleIcon={1.5}
        onPress={handlePrevClick}
      />
      <View
        flexDirection="row"
        items="center"
        justify="center"
        gap="3"
        bg="color-5"
        width={paginationWidth}
        height="4"
        px="4"
        rounded="8"
      >
        {Array.from({ length: pageNum }).map((_, index) => (
          <View
            key={index}
            width={activeIndex === index ? '7' : '2'}
            height="2"
            rounded="5"
            bg={`${activeIndex === index ? 'color-11' : 'color-9'}`}
            style={{ transition: 'background-color 200ms ease' }}
          />
        ))}
      </View>
      <Button
        size="md"
        circular
        icon={ArrowRight}
        scaleIcon={1.5}
        onPress={handleNextClick}
      />
    </View>
  )
}

PaginationControl.fileName = 'PaginationControl'
