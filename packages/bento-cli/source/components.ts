export type ComponentSchema = {
  name: string
  category: string
  categorySection: string
  url: string
  fileName: string
  dependencies?: string[]
  isOSS: boolean
}

export const componentsList: ComponentSchema[] = [
  // tables
  {
    name: 'Users Table with Avatar',
    category: 'elements',
    categorySection: 'tables',
    url: 'https://tamagui.dev/bento/elements/tables#UsersTable',
    fileName: 'UsersTable',
    isOSS: true,
  },
  {
    name: 'Basic Table',
    category: 'elements',
    categorySection: 'tables',
    url: 'https://tamagui.dev/bento/elements/tables#Basic',
    fileName: 'Basic',
    isOSS: false,
  },
  {
    name: 'Table with Pagination and Sorting Ability',
    category: 'elements',
    categorySection: 'tables',
    url: 'https://tamagui.dev/bento/elements/tables#SortableTable',
    fileName: 'SortableTable',
    isOSS: false,
  },
  // list
  {
    name: 'Horizontal Covers',
    category: 'elements',
    categorySection: 'list',
    url: 'https://tamagui.dev/bento/elements/list#HList',
    fileName: 'HList',
    isOSS: true,
  },
]
