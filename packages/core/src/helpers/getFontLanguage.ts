export const getFontLanguage = (fontFamily: string) =>
  fontFamily.includes('_') ? fontFamily.split('_')[1] : null
