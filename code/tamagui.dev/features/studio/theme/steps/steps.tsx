import type { ThemeStudioSection } from '../types'
import { StepBaseThemes } from './2-base/StepBaseThemes'
import { StepExportCode, StepExportCodeSidebar } from './5-export/StepExportCode'

export const steps: ThemeStudioSection[] = [
  {
    title: 'Customize',
    id: 'base',

    steps: [
      // {
      //   subTitle: 'Theme',
      //   children: StepBaseThemes,
      //   actions: StepBaseThemesActions,
      //   sidebar: StepBaseThemesSidebar,
      //   tray: StepBaseThemesTray,
      //   tip: StepLightDarkTip,
      //   nextTitle: 'See in Action',
      //   saveOnNext: true,
      // },

      {
        subTitle: 'Theme',
        children: StepBaseThemes,
        showInline: true,
        saveOnNext: true,
      },
    ],
  },

  // {
  //   title: 'Sub Themes',
  //   id: 'sub',

  //   steps: [
  //     {
  //       subTitle: '',
  //       explanation: true,
  //       children: StepSubThemesIntro,
  //     },

  //     {
  //       subTitle: 'Customize',
  //       actions: StepSubThemesActions,
  //       tip: () => (
  //         <NoticeParagraph>
  //           WIP, some bugs here - next up is a big cleanup of this area.
  //           <br />
  //           <br />
  //           On the right is a <em>rough</em> preview, but know you can change individual
  //           components later!
  //         </NoticeParagraph>
  //       ),
  //       children: StepSubThemes,
  //       sidebar: StepSubThemesSidebar,
  //       saveOnNext: true,
  //     },

  //     {
  //       subTitle: 'Preview',
  //       children: BaseThemesStepPreview2,
  //       explanation: true,
  //       nextTitle: 'Component themes',
  //     },
  //   ],
  // },

  // {
  //   title: 'Component Themes',
  //   id: 'component',

  //   steps: [
  //     // todo: add an intro step

  //     {
  //       subTitle: 'Component Themes',
  //       actions: StepComponentThemesActions,
  //       tip: () => <NoticeParagraph>WIP</NoticeParagraph>,
  //       children: StepComponentThemes,
  //       preview: StepComponentThemesPreview,
  //       showInline: true,
  //       saveOnNext: true,
  //       nextTitle: 'Go to export',
  //     },
  //   ],
  // },

  {
    title: 'Export',
    id: 'export',
    steps: [
      {
        subTitle: 'Export Settings',
        children: StepExportCode,
      },

      {
        subTitle: 'Done!',
        children: StepExportCodeSidebar,
      },
    ],
  },
] satisfies ThemeStudioSection[]
