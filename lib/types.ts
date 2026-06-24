export type SubmissionStatus = 'new' | 'read' | 'replied'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  service: string
  message: string
  status: SubmissionStatus
  created_at: string
}

export interface Reply {
  id: string
  submission_id: string
  body: string
  sent_at: string
}
