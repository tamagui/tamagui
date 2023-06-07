export type ExtraSteps = (args: {
  projectPath: string
  projectName: string
}) => Promise<void>
