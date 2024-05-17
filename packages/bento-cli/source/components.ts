// @ts-nocheck

export type ComponentSchema = {
  name: string
  category: string
  categorySection: string
  // url: string
  fileName: string
  // dependencies?: string[]
  isOSS: boolean
}

const checkboxes = [
  {
    "name": "CheckBox Cards",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "CheckboxCards"
  },
  {
    "name": "Checkbox List",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "CheckboxList"
  },
  {
    "name": "Grouped Checkbox",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "GroupedCheckbox"
  },
  {
    "name": "Horizontal Checkboxes",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "HorizontalCheckboxes"
  },
  {
    "name": "Horizontal with Description Checkboxes",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "HorizontalWithDescriptionCheckboxes"
  },
  {
    "name": "Vertical with Description Checkboxes",
    "category": "forms",
    "categorySection": "checkboxes",
    "fileName": "VerticalWithDescriptionCheckboxes"
  }
]

export const componentsList: ComponentSchema[] = [...checkboxes, ...[
  {
    name: 'Hoverable Avatars',
    category: 'animation',
    categorySection: 'avatars',
    fileName: 'AvatarsTooltip',
    isOSS: false,
  },
  {
    name: 'Fancy Hoverable Avatars',
    category: 'animation',
    categorySection: 'avatars',
    fileName: 'AvatarsTooltipFancy',
    isOSS: false,
  },
  {
    name: 'Grouped Avatars',
    category: 'elements',
    categorySection: 'avatars',
    fileName: 'AvatarsGrouped',
    isOSS: false,
  },
  {
    name: 'Circular Avatars with custom icons',
    category: 'elements',
    categorySection: 'avatars',
    fileName: 'CircularAvatarsWithCustomIcons',
    isOSS: false,
  },
  {
    name: 'Rounded Avatars',
    category: 'elements',
    categorySection: 'avatars',
    fileName: 'RoundedAvatars',
    isOSS: false,
  },
  {
    name: 'Rounded Avatars with Custom Icons',
    category: 'elements',
    categorySection: 'avatars',
    fileName: 'RoundedAvatarsWithCustomIcons',
    isOSS: false,
  },
  {
    name: 'Top Navbar with Swippable Drawer on Smaller Screens',
    category: 'shells',
    categorySection: 'navbars',
    fileName: 'TopNavBarWithLogo',
    isOSS: false,
  },
  {
    name: 'Top Navbar with Underline Tabs',
    category: 'shells',
    categorySection: 'navbars',
    fileName: 'TopNavBarWithUnderLineTabs',
    isOSS: false,
  },
  {
    name: 'Responsive Sidebar',
    category: 'shells',
    categorySection: 'sidebars',
    fileName: 'FullSideBar',
    isOSS: false,
  },
  {
    name: 'React Navigation compatible Tabbar with Underline',
    category: 'shells',
    categorySection: 'tabbars',
    fileName: 'Tabbar',
    isOSS: false,
  },
  {
    name: 'Progressive Tabbar with Underline Indicator',
    category: 'shells',
    categorySection: 'tabbars',
    fileName: 'TabBarSecondExample',
    isOSS: false,
  },
  {
    name: 'Swippable Tabbar Support Gesture Drag',
    category: 'shells',
    categorySection: 'tabbars',
    fileName: 'TabbarSwippable',
    isOSS: false,
  },
  {
    name: 'Jumping Walkthrough',
    category: 'panels',
    categorySection: 'walkthrough',
    fileName: 'WalkThroughDemo',
    isOSS: false,
  },
  {
    name: 'Fluid Walkthrough',
    category: 'panels',
    categorySection: 'walkthrough',
    fileName: 'WalkThroughFluidDemo',
    isOSS: false,
  },
  {
    name: 'Product List',
    category: 'ecommerce',
    categorySection: 'product_list',
    fileName: 'ProductList',
    isOSS: false,
  },
  {
    name: 'Product List Best Items',
    category: 'ecommerce',
    categorySection: 'product_list',
    fileName: 'ProductListBestItems',
    isOSS: false,
  },
  {
    name: 'Prodcut List Grid Thumbs',
    category: 'ecommerce',
    categorySection: 'product_list',
    fileName: 'ProductListGridThumbs',
    isOSS: false,
  },
  {
    name: 'Product List with Features',
    category: 'ecommerce',
    categorySection: 'product_list',
    fileName: 'ProductListWithFeatures',
    isOSS: false,
  },
  {
    name: 'Prodcut List with Label',
    category: 'ecommerce',
    categorySection: 'product_list',
    fileName: 'ProductListWithLabel',
    isOSS: false,
  },
  {
    name: 'Shopping Cart',
    category: 'ecommerce',
    categorySection: 'cart',
    fileName: 'Fullpage',
    isOSS: false,
  },
  {
    name: 'Product with Review',
    category: 'ecommerce',
    categorySection: 'product_page',
    fileName: 'ProductWithReview',
    isOSS: false,
  },
  {
    name: 'Meeting Time',
    category: 'user',
    categorySection: 'events',
    fileName: 'Example',
    isOSS: false,
  },
  {
    name: 'Employees Status Tracker',
    category: 'user',
    categorySection: 'events',
    fileName: 'StatusTracker',
    isOSS: false,
  },
  {
    name: 'Email Preferences',
    category: 'user',
    categorySection: 'preferences',
    fileName: 'LocationNotification',
    isOSS: false,
  },
  {
    name: 'Users Table with Avatar',
    category: 'elements',
    categorySection: 'tables',
    fileName: 'UsersTable',
    isOSS: false,
  },
  {
    name: 'Basic Table',
    category: 'elements',
    categorySection: 'tables',
    fileName: 'BasicTable',
    isOSS: false,
  },
  {
    name: 'Table with Pagination and Sorting Ability',
    category: 'elements',
    categorySection: 'tables',
    fileName: 'SortableTable',
    isOSS: false,
  },
  {
    name: 'Number Slider',
    category: 'animation',
    categorySection: 'microinteractions',
    fileName: 'AnimatedNumbers',
    isOSS: false,
  },
  {
    name: 'Mouse Interactive 3D Cards',
    category: 'animation',
    categorySection: 'microinteractions',
    fileName: 'InteractiveCardExample',
    isOSS: false,
  },
  {
    name: 'Loading Animation',
    category: 'animation',
    categorySection: 'buttons',
    fileName: 'ButtonLoading',
    isOSS: false,
  },
  {
    name: 'Press Animation',
    category: 'animation',
    categorySection: 'buttons',
    fileName: 'ButtonPulse',
    isOSS: false,
  },
  {
    name: 'Icon Animation',
    category: 'animation',
    categorySection: 'buttons',
    fileName: 'IconCenterButton',
    isOSS: false,
  },
  {
    name: 'Buttons with Left Icons',
    category: 'elements',
    categorySection: 'buttons',
    fileName: 'ButtonsWithLeftIcons',
    isOSS: false,
  },
  {
    name: 'Buttons with Loaders',
    category: 'elements',
    categorySection: 'buttons',
    fileName: 'ButtonsWithLoaders',
    isOSS: false,
  },
  {
    name: 'Rounded Buttons',
    category: 'elements',
    categorySection: 'buttons',
    fileName: 'RoundedButtons',
    isOSS: false,
  },
  {
    name: 'Simple Chips',
    category: 'elements',
    categorySection: 'chips',
    fileName: 'Chips',
    isOSS: false,
  },
  {
    name: 'Chips White Text and Pressable',
    category: 'elements',
    categorySection: 'chips',
    fileName: 'ChipsNoTextColor',
    isOSS: false,
  },
  {
    name: 'Rounded Chips',
    category: 'elements',
    categorySection: 'chips',
    fileName: 'ChipsRounded',
    isOSS: false,
  },
  {
    name: 'Chips with Close Icon',
    category: 'elements',
    categorySection: 'chips',
    fileName: 'ChipsWithCloseIcon',
    isOSS: false,
  },
  {
    name: 'Chips with Icon',
    category: 'elements',
    categorySection: 'chips',
    fileName: 'ChipsWithIcon',
    isOSS: false,
  },
]]
