declare module 'react-native' {
  export const View: import('react').ComponentType<{
    children?: import('react').ReactNode
    className?: string
    style?: import('react').CSSProperties | Record<string, unknown>
  }>
}
