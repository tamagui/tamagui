import { Paragraph, styled } from 'tamagui'

export const HighlightText = styled(Paragraph, {
  fontSize: '32px sm:40px',
  fontWeight: '700',
  style: {
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, var(--color10) 0%, var(--color11) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
})
