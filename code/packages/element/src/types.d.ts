import type { View } from 'react-native'
type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void
type MeasureInWindowOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number
) => void
type MeasureLayoutOnSuccessCallback = (
  left: number,
  top: number,
  width: number,
  height: number
) => void
/**
 * Methods added to element refs that work across web and native.
 * On web these are added at runtime to HTMLElements.
 * On native these exist on View already.
 */
export interface TamaguiElementMethods {
  measure(callback: MeasureOnSuccessCallback): void
  measureInWindow(callback: MeasureInWindowOnSuccessCallback): void
  measureLayout(
    relativeToNativeNode: View | HTMLElement,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail?: () => void
  ): void
  focus(): void
  blur(): void
}
export type TamaguiElement = (HTMLElement & TamaguiElementMethods) | View
/**
 * Web-specific element type that extends HTMLElement with Tamagui methods.
 * Use this when you need an HTMLElement ref in web-only code.
 */
export type TamaguiWebElement<T extends HTMLElement = HTMLElement> = T &
  TamaguiElementMethods
/**
 * Native-specific element type (View).
 * Use this when you need a View ref in native-only code.
 */
export type TamaguiNativeElement = View
