// @ts-nocheck

export type ComponentSchema = {
  name: string
  category: string
  categorySection: string
  // url: string
  fileName: string
  // dependencies?: string[]
  isOSS: boolean
  componentPath: string
  fileNamePath: string
}


// NOTE: hardcoded list but using getAllComponentsForBentoCli.js
// TODO: use getAllComponentsForBentoCli.js on github action and request schema file as json from url
export const componentsList: ComponentSchema[] = [
  {
    name: 'Loading Animation',
    fileNamePath: 'Buttons.ButtonLoading.fileName',
    fileName: 'ButtonLoading',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/ButtonLoading.tsx'
  },
  {
    name: 'Press Animation',
    fileNamePath: 'Buttons.ButtonPulse.fileName',
    fileName: 'ButtonPulse',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/ButtonPulse.tsx'
  },
  {
    name: 'Icon Animation',
    fileNamePath: 'Buttons.IconCenterButton.fileName',
    fileName: 'IconCenterButton',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/IconCenterButton.tsx'
  },
  {
    name: 'Hoverable Avatars',
    fileNamePath: 'AnAvatars.AvatarsTooltip.fileName',
    fileName: 'AvatarsTooltip',
    category: 'animation',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/avatars/AvatarsTooltip.tsx'
  },
  {
    name: 'Fancy Hoverable Avatars',
    fileNamePath: 'AnAvatars.AvatarsTooltipFancy.fileName',
    fileName: 'AvatarsTooltipFancy',
    category: 'animation',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/avatars/AvatarsTooltipFancy.tsx'
  },
  {
    name: 'Shopping Cart',
    fileNamePath: 'Cart.Fullpage.fileName',
    fileName: 'Fullpage',
    category: 'ecommerce',
    categorySection: 'cart',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/cart/Fullpage.tsx'
  },
  {
    name: 'Product with Review',
    fileNamePath: 'ProductPage.ProductWithReview.fileName',
    fileName: 'ProductWithReview',
    category: 'ecommerce',
    categorySection: 'product_page',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_page/ProductWithReview.tsx'
  },
  {
    name: 'Product List',
    fileNamePath: 'ProductList.ProductList.fileName',
    fileName: 'ProductList',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductList.tsx'
  },
  {
    name: 'Product List Best Items',
    fileNamePath: 'ProductList.ProductListBestItems.fileName',
    fileName: 'ProductListBestItems',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListBestItems.tsx'
  },
  {
    name: 'Prodcut List Grid Thumbs',
    fileNamePath: 'ProductList.ProductListGridThumbs.fileName',
    fileName: 'ProductListGridThumbs',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListGridThumbs.tsx'
  },
  {
    name: 'Product List with Features',
    fileNamePath: 'ProductList.ProductListWithFeatures.fileName',
    fileName: 'ProductListWithFeatures',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListWithFeatures.tsx'
  },
  {
    name: 'Prodcut List with Label',
    fileNamePath: 'ProductList.ProductListWithLabel.fileName',
    fileName: 'ProductListWithLabel',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListWithLabel.tsx'
  },
  {
    name: 'Image Picker',
    fileNamePath: 'Pickers.ImagePicker.fileName',
    fileName: 'ImagePicker',
    category: 'elements',
    categorySection: 'pickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/pickers/ImagePicker.tsx'
  },
  {
    name: 'Upload File',
    fileNamePath: 'Pickers.UploadFile.fileName',
    fileName: 'UploadFile',
    category: 'elements',
    categorySection: 'pickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/pickers/UploadFile.tsx'
  },
  {
    name: 'Grouped Avatars',
    fileNamePath: 'Avatars.AvatarsGrouped.fileName',
    fileName: 'AvatarsGrouped',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/AvatarsGrouped.tsx'
  },
  {
    name: 'Circular Avatars with custom icons',
    fileNamePath: 'Avatars.CircularAvatarsWithCustomIcons.fileName',
    fileName: 'CircularAvatarsWithCustomIcons',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/CircularAvatarsWithCustomIcons.tsx'
  },
  {
    name: 'Rounded Avatars',
    fileNamePath: 'Avatars.RoundedAvatars.fileName',
    fileName: 'RoundedAvatars',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/RoundedAvatars.tsx'
  },
  {
    name: 'Rounded Avatars with Custom Icons',
    fileNamePath: 'Avatars.RoundedAvatarsWithCustomIcons.fileName',
    fileName: 'RoundedAvatarsWithCustomIcons',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/RoundedAvatarsWithCustomIcons.tsx'
  },
  {
    name: 'Buttons with Left Icons',
    fileNamePath: 'Buttons.ButtonsWithLeftIcons.fileName',
    fileName: 'ButtonsWithLeftIcons',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/ButtonsWithLeftIcons.tsx'
  },
  {
    name: 'Buttons with Loaders',
    fileNamePath: 'Buttons.ButtonsWithLoaders.fileName',
    fileName: 'ButtonsWithLoaders',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/ButtonsWithLoaders.tsx'
  },
  {
    name: 'Rounded Buttons',
    fileNamePath: 'Buttons.RoundedButtons.fileName',
    fileName: 'RoundedButtons',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/RoundedButtons.tsx'
  },
  {
    name: 'Users Table with Avatar',
    fileNamePath: 'Tables.UsersTable.fileName',
    fileName: 'UsersTable',
    category: 'elements',
    categorySection: 'tables',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/tables/UsersTable.tsx'
  },
  {
    name: 'Table with Pagination and Sorting Ability',
    fileNamePath: 'Tables.SortableTable.fileName',
    fileName: 'SortableTable',
    category: 'elements',
    categorySection: 'tables',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/tables/SortableTable.tsx'
  },
  {
    name: 'MultiSelectPicker',
    fileNamePath: 'DatePickers.MultiSelectPicker.fileName',
    fileName: 'MultiSelectPicker',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/MultiSelectPicker.tsx'
  },
  {
    name: 'RangePicker',
    fileNamePath: 'DatePickers.RangePicker.fileName',
    fileName: 'RangePicker',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/RangePicker.tsx'
  },
  {
    name: 'Simple Chips',
    fileNamePath: 'Chips.Chips.fileName',
    fileName: 'Chips',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/Chips.tsx'
  },
  {
    name: 'Chips White Text and Pressable',
    fileNamePath: 'Chips.ChipsNoTextColor.fileName',
    fileName: 'ChipsNoTextColor',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsNoTextColor.tsx'
  },
  {
    name: 'Rounded Chips',
    fileNamePath: 'Chips.ChipsRounded.fileName',
    fileName: 'ChipsRounded',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsRounded.tsx'
  },
  {
    name: 'Chips with Close Icon',
    fileNamePath: 'Chips.ChipsWithCloseIcon.fileName',
    fileName: 'ChipsWithCloseIcon',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsWithCloseIcon.tsx'
  },
  {
    name: 'Chips with Icon',
    fileNamePath: 'Chips.ChipsWithIcon.fileName',
    fileName: 'ChipsWithIcon',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsWithIcon.tsx'
  },
  {
    name: 'IOS style Alert',
    fileNamePath: 'Dialogs.IosStyleAlert.fileName',
    fileName: 'IosStyleAlert',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/IosStyleAlert.tsx'
  },
  {
    name: 'Alert with icon and tint color',
    fileNamePath: 'Dialogs.AlertWithIcon.fileName',
    fileName: 'AlertWithIcon',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/AlertWithIcon.tsx'
  },
  {
    name: 'Horizontal Covers',
    fileNamePath: 'Lists.HList.fileName',
    fileName: 'HList',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/HList.tsx'
  },
  {
    name: 'Chat List',
    fileNamePath: 'Lists.ChatList.fileName',
    fileName: 'ChatList',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/ChatList.tsx'
  },
  {
    name: 'Item Value List',
    fileNamePath: 'Lists.ItemValueList.fileName',
    fileName: 'ItemValueList',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/ItemValueList.tsx'
  },
  {
    name: 'Performant Grid with FlatList',
    fileNamePath: 'Lists.FlatGrid.fileName',
    fileName: 'FlatGrid',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/FlatGrid.tsx'
  },
  {
    name: 'Phonebook List',
    fileNamePath: 'Lists.List.fileName',
    fileName: 'List',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/List.tsx'
  },
  {
    name: 'Masonry List',
    fileNamePath: 'Lists.MasonryListExample.fileName',
    fileName: 'MasonryListExample',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/MasonryListExample.tsx'
  },
  {
    name: 'CheckBox Cards',
    fileNamePath: 'Checkboxes.CheckboxCards.fileName',
    fileName: 'CheckboxCards',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/CheckboxCards.tsx'
  },
  {
    name: 'Checkbox List',
    fileNamePath: 'Checkboxes.CheckboxList.fileName',
    fileName: 'CheckboxList',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/CheckboxList.tsx'
  },
  {
    name: 'Grouped Checkbox',
    fileNamePath: 'Checkboxes.GroupedCheckbox.fileName',
    fileName: 'GroupedCheckbox',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/GroupedCheckbox.tsx'
  },
  {
    name: 'Horizontal Checkboxes',
    fileNamePath: 'Checkboxes.HorizontalCheckboxes.fileName',
    fileName: 'HorizontalCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/HorizontalCheckboxes.tsx'
  },
  {
    name: 'Horizontal with Description Checkboxes',
    fileNamePath: 'Checkboxes.HorizontalWithDescriptionCheckboxes.fileName',
    fileName: 'HorizontalWithDescriptionCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/HorizontalWithDescriptionCheckboxes.tsx'
  },
  {
    name: 'Vertical with Description Checkboxes',
    fileNamePath: 'Checkboxes.VerticalWithDescriptionCheckboxes.fileName',
    fileName: 'VerticalWithDescriptionCheckboxes',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/VerticalWithDescriptionCheckboxes.tsx'
  },
  {
    name: 'Sign-in Form',
    fileNamePath: 'Layouts.SignInScreen.fileName',
    fileName: 'SignInScreen',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignInScreen.tsx'
  },
  {
    name: 'Sign-in Right Image',
    fileNamePath: 'Layouts.SignInRightImage.fileName',
    fileName: 'SignInRightImage',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignInRightImage.tsx'
  },
  {
    name: 'Sign-up Form',
    fileNamePath: 'Layouts.SignUpScreen.fileName',
    fileName: 'SignUpScreen',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignUpScreen.tsx'
  },
  {
    name: 'Short Email Password Layout',
    fileNamePath: 'Layouts.ShortEmailPassword.fileName',
    fileName: 'ShortEmailPassword',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/ShortEmailPassword.tsx'
  },
  {
    name: 'Integrated with react-hook-form and Zod',
    fileNamePath: 'Layouts.SignupValidatedHookForm.fileName',
    fileName: 'SignupValidatedHookForm',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignupValidatedHookForm.tsx'
  },
  {
    name: 'Integrated with react-ts-form and Zod',
    fileNamePath: 'Layouts.SignupValidatedTsForm.fileName',
    fileName: 'SignupValidatedTsForm',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignupValidatedTsForm.tsx'
  },
  {
    name: 'RadioGroup List',
    fileNamePath: 'RadioGroups.GroupedRadio.fileName',
    fileName: 'GroupedRadio',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/GroupedRadio.tsx'
  },
  {
    name: 'Horizontal RadioGroups',
    fileNamePath: 'RadioGroups.Horizontal.fileName',
    fileName: 'Horizontal',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/Horizontal.tsx'
  },
  {
    name: 'Horizontal RadioGroups with description',
    fileNamePath: 'RadioGroups.HorizontalWithDescription.fileName',
    fileName: 'HorizontalWithDescription',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/HorizontalWithDescription.tsx'
  },
  {
    name: 'Cards RadioGroups',
    fileNamePath: 'RadioGroups.RadioCards.fileName',
    fileName: 'RadioCards',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/RadioCards.tsx'
  },
  {
    name: 'List RadioGroups',
    fileNamePath: 'RadioGroups.RadioList.fileName',
    fileName: 'RadioList',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/RadioList.tsx'
  },
  {
    name: 'Vertical RadioGroups',
    fileNamePath: 'RadioGroups.Vertical.fileName',
    fileName: 'Vertical',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/Vertical.tsx'
  },
  {
    name: 'Vertical with Description RadioGroups',
    fileNamePath: 'RadioGroups.VerticalWithDescription.fileName',
    fileName: 'VerticalWithDescription',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/VerticalWithDescription.tsx'
  },
  {
    name: 'Switch with Custom Icons',
    fileNamePath: 'Switches.SwitchCustomIcons.fileName',
    fileName: 'SwitchCustomIcons',
    category: 'forms',
    categorySection: 'switches',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/switches/SwitchCustomIcons.tsx'
  },
  {
    name: 'Switch with Icon and Title',
    fileNamePath: 'Switches.IconTitleSwitch.fileName',
    fileName: 'IconTitleSwitch',
    category: 'forms',
    categorySection: 'switches',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/switches/IconTitleSwitch.tsx'
  },
  {
    name: 'Comment Box with Preview',
    fileNamePath: 'TextAreas.WritePreviewAction.fileName',
    fileName: 'WritePreviewAction',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/WritePreviewAction.tsx'
  },
  {
    name: 'Comment Box',
    fileNamePath: 'TextAreas.AvatarNameContentAction.fileName',
    fileName: 'AvatarNameContentAction',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/AvatarNameContentAction.tsx'
  },
  {
    name: 'Comment Box Floating',
    fileNamePath: 'TextAreas.AvatarOutContentAction.fileName',
    fileName: 'AvatarOutContentAction',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/AvatarOutContentAction.tsx'
  },
  {
    name: 'Comment Box Minimal',
    fileNamePath: 'TextAreas.TitleContentMessage.fileName',
    fileName: 'TitleContentMessage',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/TitleContentMessage.tsx'
  },
  {
    name: 'Top Navbar with Swippable Drawer on Smaller Screens',
    fileNamePath: 'Navbars.TopNavBarWithLogo.fileName',
    fileName: 'TopNavBarWithLogo',
    category: 'shells',
    categorySection: 'navbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/navbars/TopNavBarWithLogo.tsx'
  },
  {
    name: 'Top Navbar with Underline Tabs',
    fileNamePath: 'Navbars.TopNavBarWithUnderLineTabs.fileName',
    fileName: 'TopNavBarWithUnderLineTabs',
    category: 'shells',
    categorySection: 'navbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/navbars/TopNavBarWithUnderLineTabs.tsx'
  },
  {
    name: 'Responsive Sidebar',
    fileNamePath: 'SideBars.FullSideBar.fileName',
    fileName: 'FullSideBar',
    category: 'shells',
    categorySection: 'sidebars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/sidebars/FullSideBar.tsx'
  },
  {
    name: 'React Navigation compatible Tabbar with Underline',
    fileNamePath: 'TabBars.Tabbar.fileName',
    fileName: 'TabBar',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/Tabbar.tsx'
  },
  {
    name: 'Progressive Tabbar with Underline Indicator',
    fileNamePath: 'TabBars.TabBarSecondExample.fileName',
    fileName: 'TabBarSecondExample',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/TabBarSecondExample.tsx'
  },
  {
    name: 'Swippable Tabbar Support Gesture Drag',
    fileNamePath: 'TabBars.TabbarSwippable.fileName',
    fileName: 'TabBarSwippable',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/TabbarSwippable.tsx'
  },
  {
    name: 'Email Preferences',
    fileNamePath: 'Preferences.LocationNotification.fileName',
    fileName: 'LocationNotification',
    category: 'user',
    categorySection: 'preferences',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/user/preferences/LocationNotification.tsx'
  },
  {
    name: 'Employees Status Tracker',
    fileNamePath: 'Events.StatusTracker.fileName',
    fileName: 'StatusTracker',
    category: 'user',
    categorySection: 'events',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/user/events/StatusTracker.tsx'
  }
]