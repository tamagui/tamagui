export type StyleObject = {
  property: string
  pseudo?: 'hover' | 'focus' | 'active'
  identifier: string
  rules: string[]

  // only in test mode
  value?: any
}

export type MediaStyleObject = Omit<StyleObject, 'value'>

export type NativePlatform = 'web' | 'mobile' | 'android' | 'ios'
export type NativeValue<Platform extends NativePlatform = NativePlatform> =
  | boolean
  | Platform
  | Platform[]
