import type { ThemeStudioSection } from '../types'
import { StepBaseThemes } from './2-base/StepBaseThemes'
import { StepExportCode, StepExportCodeSidebar } from './5-export/StepExportCode'

export const steps: ThemeStudioSection[] = [
  {
    title: 'Customize',
    id: 'base',

    steps: [
      {
        subTitle: 'Theme',
        children: StepBaseThemes,
        showInline: true,
        saveOnNext: true,
      },
    ],
  },

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
