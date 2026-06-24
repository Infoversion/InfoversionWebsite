'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'
import { contactSchema, type ContactFormState } from '@/lib/validations/contact'
import AdminNotification from '@/emails/admin-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Silently discard spam before full validation — don't reveal honeypot detection
  const honeypot = (formData.get('_honeypot') as string) || ''
  if (honeypot) {
    return { success: true, name: (formData.get('name') as string) || '' }
  }

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: (formData.get('company') as string) || undefined,
    service: formData.get('service') as string,
    message: formData.get('message') as string,
  }

  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  const supabase = createServiceClient()
  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company ?? null,
      service: result.data.service,
      message: result.data.message,
    })
    .select('id')
    .single()

  if (error || !submission) {
    return {
      success: false,
      errors: { _form: ['Something went wrong. Please try again.'] },
    }
  }

  const { error: emailError } = await resend.emails.send({
    from: 'Invoversion <notifications@infoversion.com>',
    to: process.env.ADMIN_EMAIL!,
    subject: `New enquiry from ${result.data.name}`,
    react: AdminNotification({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company,
      service: result.data.service,
      message: result.data.message,
      submissionId: submission.id,
    }),
  })

  if (emailError) {
    console.error('Admin notification email failed:', emailError)
  }

  return { success: true, name: result.data.name }
}
