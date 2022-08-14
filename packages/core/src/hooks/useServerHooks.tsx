import { useRef, useState } from 'react'

import { isRSC } from '../constants/platform'

export const useServerState = isRSC
  ? (((val: any) => [val, idFn]) as unknown as typeof useState)
  : useState

export const useServerRef = isRSC
  ? (((val: any) => ({ current: val })) as unknown as typeof useRef)
  : useRef

const idFn = () => {}
