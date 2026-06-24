'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

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

  const htmlBody = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:8px">
      <p style="font-size:16px;margin-top:0">Hi ${contactName},</p>
      <p style="color:#3f3f46;line-height:1.6">Thank you for reaching out to Infoversion. Here is our response:</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"/>
      <div style="background:#f4f4f5;padding:16px;border-radius:6px;color:#3f3f46;line-height:1.6;white-space:pre-wrap">${body}</div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"/>
      <p style="color:#71717a;font-size:12px;margin-bottom:0">Infoversion LLC · infoversion.com</p>
    </div>`

  const { error: emailError } = await resend.emails.send({
    from: 'Infoversion <hello@infoversion.com>',
    to: contactEmail,
    replyTo: process.env.ADMIN_EMAIL,
    subject: 'Re: Your enquiry to Infoversion',
    html: htmlBody,
  })

  if (emailError) {
    return { success: false, error: 'Failed to send email. Please try again.' }
  }

  const supabase = createServiceClient()
  const { error: insertError } = await supabase
    .from('replies')
    .insert({ submission_id: submissionId, body })

  if (insertError) {
    return { success: false, error: 'Email sent but reply could not be saved. Please check the database.' }
  }

  const { error: updateError } = await supabase
    .from('contact_submissions')
    .update({ status: 'replied' })
    .eq('id', submissionId)

  if (updateError) {
    console.error('Failed to update submission status:', updateError)
  }

  revalidatePath(`/admin/queries/${submissionId}`)
  revalidatePath('/admin/queries')
  revalidatePath('/admin')

  return { success: true }
}
