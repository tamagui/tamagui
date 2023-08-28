import { useFormState } from 'react-hook-form'
import { AnimatePresence, Button, ButtonProps, Spinner } from 'tamagui'

// hack to prevent it from breaking on the server
const useIsSubmitting = () => {
  try {
    return useFormState().isSubmitting
  } catch (error) {
    console.log(error)
    return false
  }
}
/**
 * created to be used in forms
 * will show loading spinners and disable submission when already submitting
 */
export const SubmitButton = (props: ButtonProps) => {
  const isSubmitting = useIsSubmitting()

  return (
    <Button
      iconAfter={
        <AnimatePresence>
          {isSubmitting && (
            <Spinner
              color="$color"
              key="loading-spinner"
              opacity={1}
              y={0}
              animation="quick"
              enterStyle={{
                opacity: 0,
                y: 4,
              }}
              exitStyle={{
                opacity: 0,
                y: 4,
              }}
            />
          )}
        </AnimatePresence>
      }
      disabled={isSubmitting}
      {...props}
    />
  )
}
