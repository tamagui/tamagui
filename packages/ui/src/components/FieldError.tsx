import { AnimatePresence, Paragraph } from 'tamagui'

type FieldErrorProps = {
  /**
   * error will be hidden if undefined
   */
  message?: string
}

export const FieldError = ({ message }: FieldErrorProps) => {
  return (
    <AnimatePresence>
      {!!message && (
        <Paragraph
          key="error"
          animation="200ms"
          mt="$2"
          theme="alt2"
          enterStyle={{
            y: -4,
            scaleY: 0.2,
            opacity: 0,
          }}
          exitStyle={{
            y: -4,
            opacity: 0,
            scaleY: 0,
          }}
          opacity={1}
          y={0}
          scaleY={1}
        >
          {message}
        </Paragraph>
      )}
    </AnimatePresence>
  )
}
