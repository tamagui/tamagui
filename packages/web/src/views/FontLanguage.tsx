import type { FontLanguageProps } from './FontLanguage.types'

export const FontLanguage = ({ children, ...props }: FontLanguageProps) => {
  return (
    <div
      style={{
        display: 'contents',
      }}
      className={Object.entries(props)
        .map(([name, language]) => `t_lang-${name}-${language}`)
        .join(' ')}
    >
      {children}
    </div>
  )
}

FontLanguage['displayName'] = 'FontLanguage'
