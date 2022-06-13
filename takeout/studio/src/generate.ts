import type { TamaguiOptions } from '@tamagui/static'
import { Project, ScriptTarget } from 'ts-morph'

export type GenerateProps = {
  config: TamaguiOptions
}

export const generate = (props: GenerateProps) => {
  const allComponents = {}
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
  })
}
