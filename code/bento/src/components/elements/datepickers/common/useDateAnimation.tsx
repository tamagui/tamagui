import { useDatePickerContext } from '@rehookify/datepicker'
import { useEffect, useState } from 'react'

export function useDateAnimation({
  listenTo,
}: {
  listenTo: 'year' | 'month' | 'years'
}) {
  const {
    data: { years, calendars },
  } = useDatePickerContext()
  const [currentMonth, setCurrentMonth] = useState<string | null>(null)
  const [currentYear, setCurrentYear] = useState<string | null>(null)
  const [currentYearsSum, setCurrentYearsSum] = useState<number | null>(null)

  const sumYears = () => {
    return years.reduce((acc, date) => acc + date.year, 0)
  }
  useEffect(() => {
    if (listenTo === 'years') {
      if (currentYearsSum !== sumYears()) {
        setCurrentYearsSum(sumYears())
      }
    }
  }, [years, currentYearsSum])

  useEffect(() => {
    if (listenTo === 'month') {
      if (currentMonth !== calendars[0].month) {
        setCurrentMonth(calendars[0].month)
      }
    }
  }, [calendars[0][listenTo], currentMonth])

  useEffect(() => {
    if (listenTo === 'year') {
      if (currentYear !== calendars[0].year) {
        setCurrentYear(calendars[0].year)
      }
    }
  }, [calendars[0][listenTo], currentYear])

  const prevNextAnimation = () => {
    if (listenTo === 'years') {
      if (currentYearsSum === null) return { enterStyle: { opacity: 0 } }

      return {
        enterStyle: { opacity: 0, x: sumYears() < currentYearsSum ? -15 : 15 },
        exitStyle: { opacity: 0, x: sumYears() < currentYearsSum ? -15 : 15 },
      }
    }
    if (listenTo === 'month') {
      if (currentMonth === null) return { enterStyle: { opacity: 0 } }
      const newDate = new Date(
        `${calendars[0][listenTo]} 1, ${calendars[0].year}`
      )
      const currentDate = new Date(`${currentMonth} 1, ${calendars[0].year}`)

      if (currentMonth === 'December' && calendars[0].month === 'January') {
        return {
          enterStyle: { opacity: 0, x: 15 },
          exitStyle: { opacity: 0, x: 15 },
        }
      }
      if (currentMonth === 'January' && calendars[0].month === 'December') {
        return {
          enterStyle: { opacity: 0, x: -15 },
          exitStyle: { opacity: 0, x: -15 },
        }
      }
      return {
        enterStyle: { opacity: 0, x: newDate < currentDate ? -15 : 15 },
        exitStyle: { opacity: 0, x: newDate < currentDate ? -15 : 15 },
      }
    }
    if (listenTo === 'year') {
      if (currentYear === null) return { enterStyle: { opacity: 0 } }
      const newDate = new Date(`${calendars[0].month} 1, ${calendars[0].year}`)
      const currentDate = new Date(`${calendars[0].month} 1, ${currentYear}`)

      return {
        enterStyle: { opacity: 0, x: newDate < currentDate ? -15 : 15 },
        exitStyle: { opacity: 0, x: newDate < currentDate ? -15 : 15 },
      }
    }
  }
  return {
    prevNextAnimation,
    prevNextAnimationKey:
      listenTo === 'years' ? sumYears() : calendars[0][listenTo],
  }
}
