import { isRSC } from '@tamagui/constants'
import { useRef, useState } from 'react'

export const useServerState = isRSC
  ? (((val: any) => [val, idFn]) as unknown as typeof useState)
  : useState

export const useServerRef = isRSC
  ? (((val: any) => ({ current: val })) as unknown as typeof useRef)
  : useRef

const idFn = () => {}
