const fs = require('node:fs').promises;
const { log } = require('node:console');
const path = require('node:path');


async function parseIndexFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  // Simple regex to match './filename'
  const matches = content.matchAll(/export \* from '\.\/(.+)'/g);
  const files = [...matches].map(match => `${match[1]}.tsx`);
  return files;
}

async function parseShowcaseComponents(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  // Match <Showcase ... title="..." ... >
  const showcaseMatches = content.matchAll(/<Showcase[^>]+fileName=\{([^}]+)\}[^>]*title="([^"]+)"[^>]*>/g);
  const showcases = [...showcaseMatches].map(match => [match[1], match[2]]);

  return showcases;
}

async function parseComponentFilename(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  // Match <Showcase ... title="..." ... >
  const fileNameMatch = content.matchAll(/\.fileName\s*=\s*'([^']+)'/g);

  return fileNameMatch[0];
}

async function parseExportsFromFiles(files, elementsDir, subSection) {
  let componentsArray = [];

  for (const file of files) {
    const filePath = path.join(elementsDir, file);
    let showcases = await parseShowcaseComponents(filePath);

    showcases =showcases.map(([fileName, name]) => {
      return {
        name,
        fileName,
        category: subSection,
        categorySection: file.replace('.tsx', ''),
      }
    })
    componentsArray = [...componentsArray, ...showcases];
  }

  return componentsArray;
}

async function main() {
  const subSections = ["animation", "ecommerce", "elements", "forms", "panels", "shells", "user"];
  let accumulatedComponentsArray = [];

  for (const subSection of subSections) {
    const elementsIndexPath = path.join(__dirname, `../apps/bento/src/sections/${subSection}/index.tsx`);
    const elementsDir = path.dirname(elementsIndexPath);
    const files = await parseIndexFile(elementsIndexPath);
    const componentsArray = await parseExportsFromFiles(files, elementsDir,subSection);
    accumulatedComponentsArray = [...accumulatedComponentsArray, ...componentsArray];
  }

  // console.log(JSON.stringify(accumulatedComponentsArray, null, 2));
  // console.log(accumulatedComponentsArray)

  // console.log(accumulatedComponentsArray.map(item => {
  //   const componentPath = path.join(__dirname, `../apps/bento/src/components/${item.category}/${item.categorySection}/${item.fileName.split('.')[1]}.tsx`);
  //   return {...item, componentPath: componentPath}
  // }))


  const result = await Promise.allSettled(accumulatedComponentsArray.map( async (item) => {
      const componentPath = path.join(__dirname, `../apps/bento/src/components/${item.category}/${item.categorySection}/${item.fileName.split('.')[1]}.tsx`);
      const filename = await parseComponentFilename(componentPath)
      return {...item, fileNameIs: filename, componentPath}
  }))
  console.log(result.filter(item => item.status === 'fulfilled').map(item => item.value))
}

main().catch(console.error);

// manual extraction
const components = [
  {
    name: 'Loading Animation',
    fileName: 'ButtonLoading',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/ButtonLoading.tsx'
  },
  {
    name: 'Press Animation',
    fileName: 'Buttons.ButtonPulse.fileName',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/ButtonPulse.tsx'
  },
  {
    name: 'Icon Animation',
    fileName: 'Buttons.IconCenterButton.fileName',
    category: 'animation',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/buttons/IconCenterButton.tsx'
  },
  {
    name: 'Number Slider',
    fileName: 'MicroInter.AnimatedNumbers.fileName',
    category: 'animation',
    categorySection: 'microinteractions',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/microinteractions/AnimatedNumbers.tsx'
  },
  {
    name: 'Mouse Interactive 3D Cards',
    fileName: 'MicroInter.InteractiveCardExample.fileName',
    category: 'animation',
    categorySection: 'microinteractions',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/microinteractions/InteractiveCardExample.tsx'
  },
  {
    name: 'Slide In',
    fileName: 'Slide.SlideInDemo.fileName',
    category: 'animation',
    categorySection: 'slide',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/slide/SlideInDemo.tsx'
  },
  {
    name: 'Slide Out',
    fileName: 'Slide.SlideOutDemo.fileName',
    category: 'animation',
    categorySection: 'slide',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/slide/SlideOutDemo.tsx'
  },
  {
    name: 'Hoverable Avatars',
    fileName: 'AnAvatars.AvatarsTooltip.fileName',
    category: 'animation',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/avatars/AvatarsTooltip.tsx'
  },
  {
    name: 'Fancy Hoverable Avatars',
    fileName: 'AnAvatars.AvatarsTooltipFancy.fileName',
    category: 'animation',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/animation/avatars/AvatarsTooltipFancy.tsx'
  },
  {
    name: 'Shopping Cart',
    fileName: 'Cart.Fullpage.fileName',
    category: 'ecommerce',
    categorySection: 'cart',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/cart/Fullpage.tsx'
  },
  {
    name: 'Product with Review',
    fileName: 'ProductPage.ProductWithReview.fileName',
    category: 'ecommerce',
    categorySection: 'product_page',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_page/ProductWithReview.tsx'
  },
  {
    name: 'Product List',
    fileName: 'ProductList.ProductList.fileName',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductList.tsx'
  },
  {
    name: 'Product List Best Items',
    fileName: 'ProductList.ProductListBestItems.fileName',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListBestItems.tsx'
  },
  {
    name: 'Prodcut List Grid Thumbs',
    fileName: 'ProductList.ProductListGridThumbs.fileName',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListGridThumbs.tsx'
  },
  {
    name: 'Product List with Features',
    fileName: 'ProductList.ProductListWithFeatures.fileName',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListWithFeatures.tsx'
  },
  {
    name: 'Prodcut List with Label',
    fileName: 'ProductList.ProductListWithLabel.fileName',
    category: 'ecommerce',
    categorySection: 'product_list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/ecommerce/product_list/ProductListWithLabel.tsx'
  },
  {
    name: 'Image Picker',
    fileName: 'Pickers.ImagePicker.fileName',
    category: 'elements',
    categorySection: 'pickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/pickers/ImagePicker.tsx'
  },
  {
    name: 'Upload File',
    fileName: 'Pickers.UploadFile.fileName',
    category: 'elements',
    categorySection: 'pickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/pickers/UploadFile.tsx'
  },
  {
    name: 'Grouped Avatars',
    fileName: 'Avatars.AvatarsGrouped.fileName',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/AvatarsGrouped.tsx'
  },
  {
    name: 'Circular Avatars with custom icons',
    fileName: 'Avatars.CircularAvatarsWithCustomIcons.fileName',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/CircularAvatarsWithCustomIcons.tsx'
  },
  {
    name: 'Rounded Avatars',
    fileName: 'Avatars.RoundedAvatars.fileName',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/RoundedAvatars.tsx'
  },
  {
    name: 'Rounded Avatars with Custom Icons',
    fileName: 'Avatars.RoundedAvatarsWithCustomIcons.fileName',
    category: 'elements',
    categorySection: 'avatars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/avatars/RoundedAvatarsWithCustomIcons.tsx'
  },
  {
    name: 'Buttons with Left Icons',
    fileName: 'Buttons.ButtonsWithLeftIcons.fileName',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/ButtonsWithLeftIcons.tsx'
  },
  {
    name: 'Buttons with Loaders',
    fileName: 'Buttons.ButtonsWithLoaders.fileName',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/ButtonsWithLoaders.tsx'
  },
  {
    name: 'Rounded Buttons',
    fileName: 'Buttons.RoundedButtons.fileName',
    category: 'elements',
    categorySection: 'buttons',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/buttons/RoundedButtons.tsx'
  },
  {
    name: 'Users Table with Avatar',
    fileName: 'Tables.UsersTable.fileName',
    category: 'elements',
    categorySection: 'tables',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/tables/UsersTable.tsx'
  },
  {
    name: 'Basic Table',
    fileName: 'Tables.BasicTable.fileName',
    category: 'elements',
    categorySection: 'tables',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/tables/BasicTable.tsx'
  },
  {
    name: 'Table with Pagination and Sorting Ability',
    fileName: 'Tables.SortableTable.fileName',
    category: 'elements',
    categorySection: 'tables',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/tables/SortableTable.tsx'
  },
  {
    name: 'DatePicker',
    fileName: 'DatePickers.DatePickerExample.fileName',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/DatePickerExample.tsx'
  },
  {
    name: 'MonthPicker',
    fileName: 'DatePickers.MonthPickerInput.fileName',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/MonthPickerInput.tsx'
  },
  {
    name: 'MultiSelectPicker',
    fileName: 'DatePickers.MultiSelectPicker.fileName',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/MultiSelectPicker.tsx'
  },
  {
    name: 'RangePicker',
    fileName: 'DatePickers.RangePicker.fileName',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/RangePicker.tsx'
  },
  {
    name: 'YearPicker',
    fileName: 'DatePickers.YearPickerInput.fileName',
    category: 'elements',
    categorySection: 'datepickers',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/datepickers/YearPickerInput.tsx'
  },
  {
    name: 'Simple Chips',
    fileName: 'Chips.Chips.fileName',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/Chips.tsx'
  },
  {
    name: 'Chips White Text and Pressable',
    fileName: 'Chips.ChipsNoTextColor.fileName',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsNoTextColor.tsx'
  },
  {
    name: 'Rounded Chips',
    fileName: 'Chips.ChipsRounded.fileName',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsRounded.tsx'
  },
  {
    name: 'Chips with Close Icon',
    fileName: 'Chips.ChipsWithCloseIcon.fileName',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsWithCloseIcon.tsx'
  },
  {
    name: 'Chips with Icon',
    fileName: 'Chips.ChipsWithIcon.fileName',
    category: 'elements',
    categorySection: 'chips',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/chips/ChipsWithIcon.tsx'
  },
  {
    name: 'Sliding Popover',
    fileName: 'Dialogs.SlidingPopoverDemo.fileName',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/SlidingPopoverDemo.tsx'
  },
  {
    name: 'React Native API Compatible Alert',
    fileName: 'Dialogs.AlertDemo.fileName',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/AlertDemo.tsx'
  },
  {
    name: 'IOS style Alert',
    fileName: 'Dialogs.IosStyleAlert.fileName',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/IosStyleAlert.tsx'
  },
  {
    name: 'Alert with icon and tint color',
    fileName: 'Dialogs.AlertWithIcon.fileName',
    category: 'elements',
    categorySection: 'dialogs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/dialogs/AlertWithIcon.tsx'
  },
  {
    name: 'Horizontal Covers',
    fileName: 'Lists.HList.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/HList.tsx'
  },
  {
    name: 'Chat List',
    fileName: 'Lists.ChatList.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/ChatList.tsx'
  },
  {
    name: 'Item Value List',
    fileName: 'Lists.ItemValueList.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/ItemValueList.tsx'
  },
  {
    name: 'Performant Grid with FlatList',
    fileName: 'Lists.FlatGrid.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/FlatGrid.tsx'
  },
  {
    name: 'Phonebook List',
    fileName: 'Lists.List.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/List.tsx'
  },
  {
    name: 'Masonry List',
    fileName: 'Lists.MasonryListExample.fileName',
    category: 'elements',
    categorySection: 'list',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/elements/list/MasonryListExample.tsx'
  },
  {
    name: 'Input with Label',
    fileName: 'Inputs.InputWithLabelDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithLabelDemo.tsx'
  },
  {
    name: 'One-Time Code Input',
    fileName: 'Inputs.OneTimeCodeInputExample.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/OneTimeCodeInputExample.tsx'
  },
  {
    name: 'Input with Label and Message',
    fileName: 'Inputs.InputWithLabelAndMessageDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithLabelAndMessageDemo.tsx'
  },
  {
    name: 'Input with Error',
    fileName: 'Inputs.InputWithErrorDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithErrorDemo.tsx'
  },
  {
    name: 'Input Left Adornment',
    fileName: 'Inputs.InputWithLeftIconDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithLeftIconDemo.tsx'
  },
  {
    name: 'Input Right Adornment',
    fileName: 'Inputs.InputWithRightIconDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithRightIconDemo.tsx'
  },
  {
    name: 'Input Left/Right Adornment',
    fileName: 'Inputs.InputBothSideIconsExample.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputBothSideIconsExample.tsx'
  },
  {
    name: 'Grouped Input with Buttons',
    fileName: 'Inputs.InputGroupedIconsExample.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputGroupedIconsExample.tsx'
  },
  {
    name: 'Grouped Input with Buttons (Alt)',
    fileName: 'Inputs.InputWithRightAddOnDemo.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/InputWithRightAddOnDemo.tsx'
  },
  {
    name: 'Phone',
    fileName: 'Inputs.PhoneInputExample.fileName',
    category: 'forms',
    categorySection: 'inputs',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/inputs/PhoneInputExample.tsx'
  },
  {
    name: 'CheckBox Cards',
    fileName: 'Checkboxes.CheckboxCards.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/CheckboxCards.tsx'
  },
  {
    name: 'Checkbox List',
    fileName: 'Checkboxes.CheckboxList.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/CheckboxList.tsx'
  },
  {
    name: 'Grouped Checkbox',
    fileName: 'Checkboxes.GroupedCheckbox.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/GroupedCheckbox.tsx'
  },
  {
    name: 'Horizontal Checkboxes',
    fileName: 'Checkboxes.HorizontalCheckboxes.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/HorizontalCheckboxes.tsx'
  },
  {
    name: 'Horizontal with Description Checkboxes',
    fileName: 'Checkboxes.HorizontalWithDescriptionCheckboxes.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/HorizontalWithDescriptionCheckboxes.tsx'
  },
  {
    name: 'Vertical with Description Checkboxes',
    fileName: 'Checkboxes.VerticalWithDescriptionCheckboxes.fileName',
    category: 'forms',
    categorySection: 'checkboxes',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/checkboxes/VerticalWithDescriptionCheckboxes.tsx'
  },
  {
    name: 'Sign-in Form',
    fileName: 'Layouts.SignInScreen.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignInScreen.tsx'
  },
  {
    name: 'Sign-in Right Image',
    fileName: 'Layouts.SignInRightImage.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignInRightImage.tsx'
  },
  {
    name: 'Sign-up Form',
    fileName: 'Layouts.SignUpScreen.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignUpScreen.tsx'
  },
  {
    name: 'Sign-up Form - Two Column',
    fileName: 'Layouts.SignUpTwoSideScreen.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignUpTwoSideScreen.tsx'
  },
  {
    name: 'Short Email Password Layout',
    fileName: 'Layouts.ShortEmailPassword.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/ShortEmailPassword.tsx'
  },
  {
    name: 'Integrated with react-hook-form and Zod',
    fileName: 'Layouts.SignupValidatedHookForm.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignupValidatedHookForm.tsx'
  },
  {
    name: 'Integrated with react-ts-form and Zod',
    fileName: 'Layouts.SignupValidatedTsForm.fileName',
    category: 'forms',
    categorySection: 'layouts',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/layouts/SignupValidatedTsForm.tsx'
  },
  {
    name: 'RadioGroup List',
    fileName: 'RadioGroups.GroupedRadio.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/GroupedRadio.tsx'
  },
  {
    name: 'Horizontal RadioGroups',
    fileName: 'RadioGroups.Horizontal.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/Horizontal.tsx'
  },
  {
    name: 'Horizontal RadioGroups with description',
    fileName: 'RadioGroups.HorizontalWithDescription.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/HorizontalWithDescription.tsx'
  },
  {
    name: 'Cards RadioGroups',
    fileName: 'RadioGroups.RadioCards.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/RadioCards.tsx'
  },
  {
    name: 'List RadioGroups',
    fileName: 'RadioGroups.RadioList.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/RadioList.tsx'
  },
  {
    name: 'Vertical RadioGroups',
    fileName: 'RadioGroups.Vertical.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/Vertical.tsx'
  },
  {
    name: 'Vertical with Description RadioGroups',
    fileName: 'RadioGroups.VerticalWithDescription.fileName',
    category: 'forms',
    categorySection: 'radiogroups',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/radiogroups/VerticalWithDescription.tsx'
  },
  {
    name: 'Switch with Custom Icons',
    fileName: 'Switches.SwitchCustomIcons.fileName',
    category: 'forms',
    categorySection: 'switches',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/switches/SwitchCustomIcons.tsx'
  },
  {
    name: 'Switch with Icon and Title',
    fileName: 'Switches.IconTitleSwitch.fileName',
    category: 'forms',
    categorySection: 'switches',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/switches/IconTitleSwitch.tsx'
  },
  {
    name: 'Comment Box with Preview',
    fileName: 'TextAreas.WritePreviewAction.fileName',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/WritePreviewAction.tsx'
  },
  {
    name: 'Comment Box',
    fileName: 'TextAreas.AvatarNameContentAction.fileName',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/AvatarNameContentAction.tsx'
  },
  {
    name: 'Comment Box Floating',
    fileName: 'TextAreas.AvatarOutContentAction.fileName',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/AvatarOutContentAction.tsx'
  },
  {
    name: 'Comment Box Minimal',
    fileName: 'TextAreas.TitleContentMessage.fileName',
    category: 'forms',
    categorySection: 'textareas',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/forms/textareas/TitleContentMessage.tsx'
  },
  {
    name: 'Jumping Walkthrough',
    fileName: 'Walkthrough.WalkThroughDemo.fileName',
    category: 'panels',
    categorySection: 'walkthrough',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/panels/walkthrough/WalkThroughDemo.tsx'
  },
  {
    name: 'Fluid Walkthrough',
    fileName: 'Walkthrough.WalkThroughFluidDemo.fileName',
    category: 'panels',
    categorySection: 'walkthrough',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/panels/walkthrough/WalkThroughFluidDemo.tsx'
  },
  {
    name: 'Top Navbar with Swippable Drawer on Smaller Screens',
    fileName: 'Navbars.TopNavBarWithLogo.fileName',
    category: 'shells',
    categorySection: 'navbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/navbars/TopNavBarWithLogo.tsx'
  },
  {
    name: 'Top Navbar with Underline Tabs',
    fileName: 'Navbars.TopNavBarWithUnderLineTabs.fileName',
    category: 'shells',
    categorySection: 'navbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/navbars/TopNavBarWithUnderLineTabs.tsx'
  },
  {
    name: 'Responsive Sidebar',
    fileName: 'SideBars.FullSideBar.fileName',
    category: 'shells',
    categorySection: 'sidebars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/sidebars/FullSideBar.tsx'
  },
  {
    name: 'React Navigation compatible Tabbar with Underline',
    fileName: 'TabBars.Tabbar.fileName',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/Tabbar.tsx'
  },
  {
    name: 'Progressive Tabbar with Underline Indicator',
    fileName: 'TabBars.TabBarSecondExample.fileName',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/TabBarSecondExample.tsx'
  },
  {
    name: 'Swippable Tabbar Support Gesture Drag',
    fileName: 'TabBars.TabbarSwippable.fileName',
    category: 'shells',
    categorySection: 'tabbars',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/shells/tabbars/TabbarSwippable.tsx'
  },
  {
    name: 'Email Preferences',
    fileName: 'Preferences.LocationNotification.fileName',
    category: 'user',
    categorySection: 'preferences',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/user/preferences/LocationNotification.tsx'
  },
  {
    name: 'Meeting Time',
    fileName: 'Events.Example.fileName',
    category: 'user',
    categorySection: 'events',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/user/events/Example.tsx'
  },
  {
    name: 'Employees Status Tracker',
    fileName: 'Events.StatusTracker.fileName',
    category: 'user',
    categorySection: 'events',
    componentPath: '/Users/rofi/Programing/tamagui/apps/bento/src/components/user/events/StatusTracker.tsx'
  }
]