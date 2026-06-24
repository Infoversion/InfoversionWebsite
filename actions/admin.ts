'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import ContactReply from '@/emails/contact-reply'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function signIn(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function markAsRead(submissionId: string) {
  const supabase = createServiceClient()
  await supabase
    .from('contact_submissions')
    .update({ status: 'read' })
    .eq('id', submissionId)
    .eq('status', 'new')
  revalidatePath('/admin/queries')
  revalidatePath('/admin')
}

export async function replyToSubmission(
  submissionId: string,
  contactEmail: string,
  contactName: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  if (!body.trim()) {
    return { success: false, error: 'Reply body cannot be empty.' }
  }

  const { error: emailError } = await resend.emails.send({
    from: 'Invoversion <hello@infoversion.com>',
    to: contactEmail,
    replyTo: process.env.ADMIN_EMAIL,
    subject: 'Re: Your enquiry to Invoversion',
    react: ContactReply({ contactName, replyBody: body }),
  })

  if (emailError) {
    return { success: false, error: 'Failed to send email. Please try again.' }
  }

  const supabase = createServiceClient()
  await supabase.from('replies').insert({ submission_id: submissionId, body })
  await supabase
    .from('contact_submissions')
    .update({ status: 'replied' })
    .eq('id', submissionId)

  revalidatePath(`/admin/queries/${submissionId}`)
  revalidatePath('/admin/queries')
  revalidatePath('/admin')

  return { success: true }
}
