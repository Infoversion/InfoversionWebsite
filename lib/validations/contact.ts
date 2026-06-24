import { z } from 'zod'

export const SERVICE_OPTIONS = [
  'App Development',
  'Web Development',
  'IT Consulting & PM',
  'Agile Transformation',
  'Other',
] as const

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  company: z.string().optional(),
  service: z.enum(SERVICE_OPTIONS, {
    error: 'Please select a service',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export type ContactFormState = {
  success: boolean
  name?: string
  errors?: {
    name?: string[]
    email?: string[]
    company?: string[]
    service?: string[]
    message?: string[]
    _form?: string[]
  }
}
