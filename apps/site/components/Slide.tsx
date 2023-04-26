import React from 'react'

export type SlideProps = {
  title?: React.ReactNode
  steps: SlideSteps[]
  variant: 'big'
}

type SlideSteps = {
  text: React.ReactNode
}

export function Slide(props: SlideProps) {}
