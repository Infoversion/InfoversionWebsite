'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'
import { contactSchema, type ContactFormState } from '@/lib/validations/contact'

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

  const adminUrl = `https://infoversion.com/admin/queries/${submission.id}`
  const htmlBody = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:8px">
      <h2 style="margin-top:0">New enquiry from ${result.data.name}</h2>
      <p style="color:#71717a;margin-top:0">${result.data.service}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"/>
      <p><strong>Name:</strong> ${result.data.name}</p>
      <p><strong>Email:</strong> ${result.data.email}</p>
      ${result.data.company ? `<p><strong>Company:</strong> ${result.data.company}</p>` : ''}
      <p><strong>Service:</strong> ${result.data.service}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"/>
      <p><strong>Message</strong></p>
      <div style="background:#f4f4f5;padding:16px;border-radius:6px;color:#3f3f46;line-height:1.6;white-space:pre-wrap">${result.data.message}</div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"/>
      <a href="${adminUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500">View in admin panel →</a>
    </div>`

  try {
    await resend.emails.send({
      from: 'Infoversion <notifications@infoversion.com>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New enquiry from ${result.data.name}`,
      html: htmlBody,
    })
  } catch (emailError) {
    console.error('Admin notification email failed:', emailError)
  }

  return { success: true, name: result.data.name }
}
