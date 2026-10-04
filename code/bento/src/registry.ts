import type { ComponentSize } from '@tamagui/core'

// every bento page and demo, as plain data so listings stay light. the site
// renders its pages, sidebar and static routes from this list, the code tab
// serves `<section>/<group>/<file>.tsx`, and `./demos` holds the components.

export type BentoDemo = {
  title: string
  /** the demo's source file in its group folder, without the extension */
  file: string
  /** the demo's export name, looked up in `bentoDemos` from `@tamagui/bento/demos` */
  component: string
  /**
   * how the showcase frames it: `center` scrolls and centers it with padding,
   * `flush` drops the padding for edge-to-edge layouts, `bleed` hands the
   * whole preview area to the demo
   */
  frame?: 'center' | 'flush' | 'bleed'
  /** the showcase size control drives the demo's `size` prop */
  sizable?: boolean
  defaultSize?: ComponentSize
  /** a shorter, narrower preview for small controls */
  short?: boolean
}

export type BentoGroup = {
  section: string
  group: string
  name: string
  demos: BentoDemo[]
}

export type BentoSection = {
  section: string
  name: string
  groups: BentoGroup[]
}

const section = (
  section: string,
  name: string,
  groups: { group: string; name: string; demos: BentoDemo[] }[]
): BentoSection => ({
  section,
  name,
  groups: groups.map((group) => ({ section, ...group })),
})

export const bentoSections: BentoSection[] = [
  section('forms', 'Forms', [
    {
      group: 'inputs',
      name: 'Inputs',
      demos: [
        {
          title: 'One-Time Code',
          file: 'OneTimeCodeInput',
          component: 'OneTimeCodeInputExample',
          sizable: true,
          short: true,
        },
        {
          title: 'Label, Help and Error',
          file: 'InputWithError',
          component: 'InputWithErrorDemo',
          sizable: true,
          short: true,
        },
        {
          title: 'Grouped with Buttons',
          file: 'InputGroupedIcons',
          component: 'InputGroupedIconsExample',
          sizable: true,
          short: true,
        },
        {
          title: 'Phone Number',
          file: 'PhoneInput',
          component: 'PhoneInputExample',
          sizable: true,
          short: true,
        },
      ],
    },
    {
      group: 'layouts',
      name: 'Layouts',
      demos: [
        {
          title: 'Sign In with Image',
          file: 'SignInRightImage',
          component: 'SignInRightImage',
          frame: 'flush',
        },
        {
          title: 'Two Column Profile Form',
          file: 'SignUpTwoSide',
          component: 'SignUpTwoSideScreen',
          frame: 'flush',
        },
        {
          title: 'Sign Up with react-hook-form and Zod',
          file: 'SignupValidatedHookForm',
          component: 'SignupValidatedHookForm',
        },
      ],
    },
    {
      group: 'checkboxes',
      name: 'Checkboxes',
      demos: [
        {
          title: 'Checkbox Cards',
          file: 'CheckboxCards',
          component: 'CheckboxCards',
        },
        {
          title: 'Checkbox List',
          file: 'CheckboxList',
          component: 'CheckboxList',
        },
      ],
    },
    {
      group: 'radiogroups',
      name: 'Radio Groups',
      demos: [
        { title: 'Radio Cards', file: 'RadioCards', component: 'RadioCards' },
        { title: 'Radio List', file: 'RadioList', component: 'RadioList' },
      ],
    },
    {
      group: 'switches',
      name: 'Switches',
      demos: [
        {
          title: 'Theme Switch',
          file: 'ThemeSwitch',
          component: 'ThemeSwitch',
          sizable: true,
          defaultSize: 'xl',
        },
        {
          title: 'Switch with Icons',
          file: 'SwitchCustomIcons',
          component: 'SwitchCustomIcons',
          sizable: true,
        },
      ],
    },
    {
      group: 'textareas',
      name: 'Text Areas',
      demos: [
        {
          title: 'Comment with Preview',
          file: 'WritePreviewAction',
          component: 'WritePreviewAction',
        },
      ],
    },
  ]),

  section('elements', 'Elements', [
    {
      group: 'pickers',
      name: 'Image Picker',
      demos: [{ title: 'Image Picker', file: 'ImagePicker', component: 'ImagePicker' }],
    },
    {
      group: 'list',
      name: 'Lists',
      demos: [
        { title: 'Chat', file: 'Chat', component: 'Chat', frame: 'bleed' },
        {
          title: 'Masonry',
          file: 'MasonryListExample',
          component: 'MasonryListExample',
          frame: 'bleed',
        },
        { title: 'Cover Cards', file: 'HList', component: 'HList', frame: 'bleed' },
      ],
    },
    {
      group: 'avatars',
      name: 'Avatars',
      demos: [
        {
          title: 'Avatar Stack',
          file: 'AvatarsGrouped',
          component: 'AvatarsGrouped',
        },
        {
          title: 'Avatars with Badges',
          file: 'CircularAvatarsWithCustomIcons',
          component: 'CircularAvatarsWithCustomIcons',
        },
      ],
    },
    {
      group: 'datepickers',
      name: 'Date Pickers',
      demos: [
        { title: 'Calendar', file: 'Calendar', component: 'Calendar' },
        {
          title: 'Date Picker',
          file: 'DatePicker',
          component: 'DatePickerExample',
        },
        {
          title: 'Range Picker',
          file: 'RangePicker',
          component: 'RangePicker',
        },
      ],
    },
    {
      group: 'tables',
      name: 'Tables',
      demos: [{ title: 'Status Table', file: 'Basic', component: 'BasicTable' }],
    },
    {
      group: 'chips',
      name: 'Chips',
      demos: [
        {
          title: 'Chips',
          file: 'ChipsWithCloseIcon',
          component: 'ChipsWithCloseIcon',
          sizable: true,
        },
      ],
    },
    {
      group: 'dialogs',
      name: 'Dialogs',
      demos: [
        {
          title: 'Sliding Popover',
          file: 'SlidingPopover',
          component: 'SlidingPopoverDemo',
        },
        {
          title: 'iOS Style Alert',
          file: 'IosStyleAlert',
          component: 'IosStyleAlert',
        },
      ],
    },
  ]),

  section('shells', 'Shells', [
    {
      group: 'navbars',
      name: 'Navbars',
      demos: [
        {
          title: 'Navbar with Drawer',
          file: 'TopNavBarWithLogo',
          component: 'TopNavBarWithLogo',
          frame: 'bleed',
        },
        {
          title: 'Responsive Sidebar',
          file: 'FullSideBar',
          component: 'FullSideBar',
          frame: 'bleed',
        },
      ],
    },
    {
      group: 'tabbars',
      name: 'Tab Bars',
      demos: [
        {
          title: 'Swipeable Tabs',
          file: 'TabBarSwippable',
          component: 'TabbarSwippable',
        },
      ],
    },
  ]),

  section('animation', 'Animation', [
    {
      group: 'microinteractions',
      name: 'Microinteractions',
      demos: [
        {
          title: '3D Hover Card',
          file: 'InteractiveCard',
          component: 'InteractiveCard',
        },
        {
          title: 'Rolling Numbers',
          file: 'NumberSlider',
          component: 'AnimatedNumbers',
        },
      ],
    },
    {
      group: 'buttons',
      name: 'Buttons',
      demos: [
        {
          title: 'Loading Button',
          file: 'ButtonLoading',
          component: 'ButtonLoading',
        },
      ],
    },
  ]),

  section('ecommerce', 'Ecommerce', [
    {
      group: 'productpage',
      name: 'Product Page',
      demos: [
        {
          title: 'Product with Reviews',
          file: 'ProductWithReview',
          component: 'ProductWithReview',
        },
      ],
    },
    {
      group: 'payment',
      name: 'Pricing',
      demos: [
        { title: 'Pricing', file: 'Paywall', component: 'Paywall' },
      ],
    },
  ]),

  section('user', 'User', [
    {
      group: 'preferences',
      name: 'Preferences',
      demos: [
        {
          title: 'Email Preferences',
          file: 'LocationNotification',
          component: 'LocationNotification',
          frame: 'flush',
        },
        {
          title: 'Meeting Cards',
          file: 'Meeting',
          component: 'Meeting',
          frame: 'flush',
        },
      ],
    },
  ]),
]

export const bentoGroups = bentoSections.flatMap((section) => section.groups)

export function getBentoGroup(section: string, group: string) {
  return bentoGroups.find((g) => g.section === section && g.group === group)
}
