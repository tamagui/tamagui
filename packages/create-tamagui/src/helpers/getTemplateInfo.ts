import prompts from 'prompts'

import { templates } from '../templates'

export const getTemplateInfo = async (
  template?: string
): Promise<(typeof templates)[number]> => {
  if (!isTemplateValid(template)) {
    template = (
      await prompts({
        name: 'template',
        type: 'select',
        message: `Pick a template:`,
        choices: templates.filter((t) => !t.hidden),
      })
    ).template
  }
  if (typeof template !== 'string' || !isTemplateValid(template)) {
    console.warn(`template ${template} is not valid.`)
    return await getTemplateInfo(template)
  }

  return templates.find((t) => t.value === template)!
}

const isTemplateValid = (template?: string) =>
  typeof template === 'string' && templates.some(({ value }) => value === template)
