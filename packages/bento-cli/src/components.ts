export type ComponentSchema = {
  name: string
  category: string
  categorySection: string
  // url: string
  fileName: string
  // dependencies?: string[]
  isOSS: boolean
}

const OSS_COMPONENTS = [
  'InputWithLabel',
  'CheckboxCards',
  'SignInScreen',
  'GroupedRadio',
  'SwitchCustomIcons',
  'WritePreviewAction',
  'ImagePicker',
  'HList',
  'AvatarsGrouped',
  'ButtonsWithLeftIcons',
  'DatePicker',
  'UsersTable',
  'Chips',
  'SlidingPopover',
  'TabBar',
  'ButtonLoading',
  'NumberSlider',
  'SlideIn',
  'AvatarsTooltip',
  'Meeting',
]

// TODO: this are components that the script fails to parse filenames correctly.
const MISSING_COMPONENTS = [
  {
    name: 'Number Slider',
    fileName: 'InteractiveCard',
    category: 'animation',
    categorySection: 'microinteractions'
  },
  {
    name: 'Mouse Interactive 3D Cards',
    fileName: 'InteractiveCard',
    category: 'animation',
    categorySection: 'microinteractions'
  },
  {
    name: 'Slide In',
    fileName: 'SlideIn',
    category: 'animation',
    categorySection: 'slide'
  },
  {
    name: 'Slide Out',
    fileName: 'SlideOutDemo',
    category: 'animation',
    categorySection: 'slide'
  },
  {
    name: 'Basic Table',
    fileName: 'Basic',
    category: 'elements',
    categorySection: 'tables'
  },
  {
    name: 'DatePicker',
    fileName: 'DatePicker',
    category: 'elements',
    categorySection: 'datepickers'
  },
  {
    name: 'MonthPicker',
    fileName: 'MonthPicker',
    category: 'elements',
    categorySection: 'datepickers'
  },
  {
    name: 'YearPicker',
    fileName: 'YearPicker',
    category: 'elements',
    categorySection: 'datepickers'
  },
  {
    name: 'Sliding Popover',
    fileName: 'SlidingPopover',
    category: 'elements',
    categorySection: 'dialogs'
  },
  {
    name: 'React Native API Compatible Alert',
    fileName: 'Alert',
    category: 'elements',
    categorySection: 'dialogs'
  },
  {
    name: 'Input with Label',
    fileName: 'InputWithLabel',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'One-Time Code Input',
    fileName: 'OneTimeCodeInput',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Input with Label and Message',
    fileName: 'InputWithLabelAndMessage',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Input with Error',
    fileName: 'InputWithError',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Input Left Adornment',
    fileName: 'InputWithLeftIcon',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Input Right Adornment',
    fileName: 'InputWithRightIcon',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Input Left/Right Adornment',
    fileName: 'InputBothSideIcons',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Grouped Input with Buttons',
    fileName: 'InputGroupedIcons',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Grouped Input with Buttons (Alt)',
    fileName: 'InputWithRightAddOn',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Phone',
    fileName: 'PhoneInput',
    category: 'forms',
    categorySection: 'inputs'
  },
  {
    name: 'Sign-up Form - Two Column',
    fileName: 'SignUpTwoSide',
    category: 'forms',
    categorySection: 'layouts'
  },
  {
    name: 'Jumping Walkthrough',
    fileName: 'walkThrough', // missing filename
    category: 'panels',
    categorySection: 'walkthrough'
  },
  {
    name: 'Fluid Walkthrough',
    fileName: 'WalkThroughFluid',
    category: 'panels',
    categorySection: 'walkthrough'
  },
  {
    name: 'Meeting Time',
    fileName: 'Meeting',
    category: 'user',
    categorySection: 'events'
  }
]
// NOTE: hardcoded list but using getAllComponentsForBentoCli.js
// TODO: use getAllComponentsForBentoCli.js on github action and request schema file as json from url
export const componentsList: ComponentSchema[] = [
  {
    name: 'Loading Animation',
    fileName: 'ButtonLoading',
    category: 'animation',
    categorySection: 'buttons',
  },
  {
    name: 'Press Animation',
    fileName: 'ButtonPulse',
    category: 'animation',
    categorySection: 'buttons',
  },
  {
    name: 'Icon Animation',
    fileName: 'IconCenterButton',
    category: 'animation',
    categorySection: 'buttons',
  },
  {
    name: 'Hoverable Avatars',
    fileName: 'AvatarsTooltip',
    category: 'animation',
    categorySection: 'avatars',
  },
  {
    name: 'Fancy Hoverable Avatars',
    fileName: 'AvatarsTooltipFancy',
    category: 'animation',
    categorySection: 'avatars',
  },
  {
    name: 'Shopping Cart',
    fileName: 'Fullpage',
    category: 'ecommerce',
    categorySection: 'cart',
  },
  {
    name: 'Product with Review',
    fileName: 'ProductWithReview',
    category: 'ecommerce',
    categorySection: 'product_page',
  },
  {
    name: 'Product List',
    fileName: 'ProductList',
    category: 'ecommerce',
    categorySection: 'product_list',
  },
  {
    name: 'Product List Best Items',
    fileName: 'ProductListBestItems',
    category: 'ecommerce',
    categorySection: 'product_list',
  },
  {
    name: 'Prodcut List Grid Thumbs',
    fileName: 'ProductListGridThumbs',
    category: 'ecommerce',
    categorySection: 'product_list',
  },
  {
    name: 'Product List with Features',
    fileName: 'ProductListWithFeatures',
    category: 'ecommerce',
    categorySection: 'product_list',
  },
  {
    name: 'Prodcut List with Label',
    fileName: 'ProductListWithLabel',
    category: 'ecommerce',
    categorySection: 'product_list',
  },
  {
    name: 'Image Picker',
    fileName: 'ImagePicker',
    category: 'elements',
    categorySection: 'pickers',
  },
  {
    name: 'Upload File',
    fileName: 'UploadFile',
    category: 'elements',
    categorySection: 'pickers',
  },
  {
    name: 'Grouped Avatars',
    fileName: 'AvatarsGrouped',
    category: 'elements',
    categorySection: 'avatars',
  },
  {
    name: 'Circular Avatars with custom icons',
    fileName: 'CircularAvatarsWithCustomIcons',
    category: 'elements',
    categorySection: 'avatars',
  },
  {
    name: 'Rounded Avatars',
    fileName: 'RoundedAvatars',
    category: 'elements',
    categorySection: 'avatars',
  },
  {
    name: 'Rounded Avatars with Custom Icons',
    fileName: 'RoundedAvatarsWithCustomIcons',
    category: 'elements',
    categorySection: 'avatars',
  },
  {
    name: 'Buttons with Left Icons',
    fileName: 'ButtonsWithLeftIcons',
    category: 'elements',
    categorySection: 'buttons',
  },
  {
    name: 'Buttons with Loaders',
    fileName: 'ButtonsWithLoaders',
    category: 'elements',
    categorySection: 'buttons',
  },
  {
    name: 'Rounded Buttons',
    fileName: 'RoundedButtons',
    category: 'elements',
    categorySection: 'buttons',
  },
  {
    name: 'Users Table with Avatar',
    fileName: 'UsersTable',
    category: 'elements',
    categorySection: 'tables',
  },
  {
    name: 'Table with Pagination and Sorting Ability',
    fileName: 'SortableTable',
    category: 'elements',
    categorySection: 'tables',
  },
  {
    name: 'MultiSelectPicker',
    fileName: 'MultiSelectPicker',
    category: 'elements',
    categorySection: 'datepickers',
  },
  {
    name: 'RangePicker',
    fileName: 'RangePicker',
    category: 'elements',
    categorySection: 'datepickers',
  },
  {
    name: 'Simple Chips',
    fileName: 'Chips',
    category: 'elements',
    categorySection: 'chips',
  },
  {
    name: 'Chips White Text and Pressable',
    fileName: 'ChipsNoTextColor',
    category: 'elements',
    categorySection: 'chips',
  },
  {
    name: 'Rounded Chips',
    fileName: 'ChipsRounded',
    category: 'elements',
    categorySection: 'chips',
  },
  {
    name: 'Chips with Close Icon',
    fileName: 'ChipsWithCloseIcon',
    category: 'elements',
    categorySection: 'chips',
  },
  {
    name: 'Chips with Icon',
    fileName: 'ChipsWithIcon',
    category: 'elements',
    categorySection: 'chips',
  },
  {
    name: 'IOS style Alert',
    fileName: 'IosStyleAlert',
    category: 'elements',
    categorySection: 'dialogs',
  },
  {
    name: 'Alert with icon and tint color',
    fileName: 'AlertWithIcon',
    category: 'elements',
    categorySection: 'dialogs',
  },
  {
    name: 'Horizontal Covers',
    fileName: 'HList',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'Chat List',
    fileName: 'ChatList',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'Item Value List',
    fileName: 'ItemValueList',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'Performant Grid with FlatList',
    fileName: 'FlatGrid',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'Phonebook List',
    fileName: 'List',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'Masonry List',
    fileName: 'MasonryListExample',
    category: 'elements',
    categorySection: 'list',
  },
  {
    name: 'CheckBox Cards',
    fileName: 'CheckboxCards',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Checkbox List',
    fileName: 'CheckboxList',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Grouped Checkbox',
    fileName: 'GroupedCheckbox',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Horizontal Checkboxes',
    fileName: 'HorizontalCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Horizontal with Description Checkboxes',
    fileName: 'HorizontalWithDescriptionCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Vertical with Description Checkboxes',
    fileName: 'VerticalWithDescriptionCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
  },
  {
    name: 'Sign-in Form',
    fileName: 'SignInScreen',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'Sign-in Right Image',
    fileName: 'SignInRightImage',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'Sign-up Form',
    fileName: 'SignUpScreen',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'Short Email Password Layout',
    fileName: 'ShortEmailPassword',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'Integrated with react-hook-form and Zod',
    fileName: 'SignupValidatedHookForm',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'Integrated with react-ts-form and Zod',
    fileName: 'SignupValidatedTsForm',
    category: 'forms',
    categorySection: 'layouts',
  },
  {
    name: 'RadioGroup List',
    fileName: 'GroupedRadio',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Horizontal RadioGroups',
    fileName: 'Horizontal',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Horizontal RadioGroups with description',
    fileName: 'HorizontalWithDescription',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Cards RadioGroups',
    fileName: 'RadioCards',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'List RadioGroups',
    fileName: 'RadioList',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Vertical RadioGroups',
    fileName: 'Vertical',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Vertical with Description RadioGroups',
    fileName: 'VerticalWithDescription',
    category: 'forms',
    categorySection: 'radiogroups',
  },
  {
    name: 'Switch with Custom Icons',
    fileName: 'SwitchCustomIcons',
    category: 'forms',
    categorySection: 'switches',
  },
  {
    name: 'Switch with Icon and Title',
    fileName: 'IconTitleSwitch',
    category: 'forms',
    categorySection: 'switches',
  },
  {
    name: 'Comment Box with Preview',
    fileName: 'WritePreviewAction',
    category: 'forms',
    categorySection: 'textareas',
  },
  {
    name: 'Comment Box',
    fileName: 'AvatarNameContentAction',
    category: 'forms',
    categorySection: 'textareas',
  },
  {
    name: 'Comment Box Floating',
    fileName: 'AvatarOutContentAction',
    category: 'forms',
    categorySection: 'textareas',
  },
  {
    name: 'Comment Box Minimal',
    fileName: 'TitleContentMessage',
    category: 'forms',
    categorySection: 'textareas',
  },
  {
    name: 'Top Navbar with Swippable Drawer on Smaller Screens',
    fileName: 'TopNavBarWithLogo',
    category: 'shells',
    categorySection: 'navbars',
  },
  {
    name: 'Top Navbar with Underline Tabs',
    fileName: 'TopNavBarWithUnderLineTabs',
    category: 'shells',
    categorySection: 'navbars',
  },
  {
    name: 'Responsive Sidebar',
    fileName: 'FullSideBar',
    category: 'shells',
    categorySection: 'sidebars',
  },
  {
    name: 'React Navigation compatible Tabbar with Underline',
    fileName: 'TabBar',
    category: 'shells',
    categorySection: 'tabbars',
  },
  {
    name: 'Progressive Tabbar with Underline Indicator',
    fileName: 'TabBarSecondExample',
    category: 'shells',
    categorySection: 'tabbars',
  },
  {
    name: 'Swippable Tabbar Support Gesture Drag',
    fileName: 'TabBarSwippable',
    category: 'shells',
    categorySection: 'tabbars',
  },
  {
    name: 'Email Preferences',
    fileName: 'LocationNotification',
    category: 'user',
    categorySection: 'preferences',
  },
  {
    name: 'Employees Status Tracker',
    fileName: 'StatusTracker',
    category: 'user',
    categorySection: 'events',
  },
  ...MISSING_COMPONENTS
].map((item) => {
  return { ...item, isOSS: OSS_COMPONENTS.includes(item.fileName) }
})
