import { useState } from 'react'
import { Button, View, getTokenValue } from 'tamagui'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'

const pageNum = 5

export const PaginationControl = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const handlePrevClick = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + pageNum) % pageNum)
  }
  const handleNextClick = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % pageNum)
  }

  const paginationWidth =
    (2 * getTokenValue('$2') + (pageNum - 1) * getTokenValue('$0.75')) * 10

  return (
    <View
      flex={1}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap="$3"
    >
      <Button
        size="$4"
        circular
        icon={ArrowLeft}
        scaleIcon={1.5}
        onPress={handlePrevClick}
      />
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="$3"
        backgroundColor="$color5"
        width={paginationWidth}
        height="$4"
        paddingHorizontal="$4"
        borderRadius="$8"
      >
        {Array.from({ length: pageNum }).map((_, index) => (
          <View
            key={index}
            width={activeIndex === index ? '$2' : '$0.75'}
            height="$0.75"
            borderRadius="$5"
            backgroundColor={activeIndex === index ? '$color12' : '$color10'}
            animation="200ms"
          />
        ))}
      </View>
      <Button
        size="$4"
        circular
        icon={ArrowRight}
        scaleIcon={1.5}
        onPress={handleNextClick}
      />
    </View>
  )
}

PaginationControl.fileName = 'PaginationControl'
