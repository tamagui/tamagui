export type ExtraSteps = (args: {
  isFullClone: boolean
  projectPath: string
  projectName: string
}) => Promise<void>
