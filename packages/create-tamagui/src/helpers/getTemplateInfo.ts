import prompts from 'prompts'

import { templates } from '../templates'

const validTemplates = templates.map(({ value }) => value).join(', ')

export const getTemplateInfo = async (
  template?: string
): Promise<(typeof templates)[number]> => {
  let res = getValidTemplate(template)
  if (template && !res) {
    console.warn(`template ${template} is not valid. valid options: ${validTemplates}`)
    process.exit(1)
  }
  if (!res) {
    template = (
      await prompts({
        name: 'template',
        type: 'select',
        message: `Pick a template:`,
        choices: templates.filter((t) => !t.hidden),
      })
    ).template
  }
  res = getValidTemplate(`${template}`)
  if (!res) {
    console.warn(`template ${template} is not valid. valid options: ${validTemplates}`)
    process.exit(1)
  }
  return res
}

const getValidTemplate = (template?: string) =>
  typeof template === 'string' && templates.find(({ value }) => value === template)
