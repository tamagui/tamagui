import type { ThemeStudioSection } from '../types'
import { StepBaseThemes } from './2-base/StepBaseThemes'
import { StepExportCodeSidebar } from './5-export/StepExportCode'

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
        subTitle: 'Done!',
        children: StepExportCodeSidebar,
      },
    ],
  },
] satisfies ThemeStudioSection[]
