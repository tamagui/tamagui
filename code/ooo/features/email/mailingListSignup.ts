import { supabase } from '~/features/supabase'

export async function mailingListSignup(
  email: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // Insert the email into the mailing_list table
    const { error } = await supabase.from('mailing_list').insert([{ email }])

    if (error) {
      // Check if the error is related to a duplicate email
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        return { success: false, message: 'This email is already signed up.' }
      }
      return { success: false, message: 'Failed to sign up. Please try again later.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error signing up email:', error)
    return { success: false, message: 'An unexpected error occurred.' }
  }
}
