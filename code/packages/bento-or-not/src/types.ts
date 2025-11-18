/**
 * Type stubs for @tamagui/bento
 */

export interface ComponentItemInfo {
  name?: string
  description?: string
  [key: string]: any
}

export interface Data {
  [key: string]: any
}

export interface Sections {
  [key: string]: any
}

export interface Components {
  [key: string]: any
}

export interface ListingData {
  sections: any[]
  data: Record<string, any>
}
