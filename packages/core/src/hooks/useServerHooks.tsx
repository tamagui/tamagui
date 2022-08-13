import { useRef, useState } from 'react'

// @ts-ignore
const isRSC = process.env.ENABLE_RSC ? import.meta.env.SSR : false

export const useServerState = isRSC
  ? (((val: any) => [val, idFn]) as unknown as typeof useState)
  : useState

export const useServerRef = isRSC
  ? (((val: any) => ({ current: val })) as unknown as typeof useRef)
  : useRef

const idFn = () => {}
