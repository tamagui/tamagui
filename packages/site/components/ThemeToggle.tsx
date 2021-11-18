import { useTheme } from '@components/NextTheme'
import React from 'react'
import { Button, ButtonProps } from 'tamagui'

export const ThemeToggle = (props: ButtonProps) => {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
      {...props}
      aria-label="toggle a light and dark color scheme"
    >
      <svg
        style={{ marginBottom: -1 }}
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
      >
        <path
          d="M7.5 0.5V2.5"
          stroke="var(--color2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.5 7.5H2.5"
          stroke="var(--color2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 7.5H14.5"
          stroke="var(--color2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 12.5V14.5"
          stroke="var(--color2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L3.94332 4.65043L3.98405 4.69116C4.19286 4.43013 4.43013 4.19286 4.69116 3.98405L4.65043 3.94332L2.85355 2.14645ZM11.016 10.3088C10.8071 10.5699 10.5699 10.8071 10.3088 11.016L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L11.016 10.3088Z"
          fill="var(--color2)"
        />
        <circle cx="7.5" cy="7.5" r="2" stroke="var(--color2)" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L4.65043 11.0567L4.69116 11.016C4.43013 10.8071 4.19286 10.5699 3.98405 10.3088L3.94332 10.3496L2.14645 12.1464ZM10.3088 3.98405C10.5699 4.19286 10.8071 4.43013 11.016 4.69116L12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L10.3088 3.98405Z"
          fill="var(--color2)"
        />
      </svg>
    </Button>
  )
}
