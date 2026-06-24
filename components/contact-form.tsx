'use client'

import { useActionState, useRef, useState } from 'react'
import { submitContact } from '@/actions/contact'
import { SERVICE_OPTIONS, type ContactFormState } from '@/lib/validations/contact'
import { createBrowserClient } from '@supabase/ssr'

const initial: ContactFormState = { success: false }

const MAX_FILE_SIZE_MB = 10
const MAX_FILES = 5
const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const selected = Array.from(e.target.files ?? [])

    if (selected.length + files.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed.`)
      return
    }

    const invalid = selected.filter(
      (f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE_MB * 1024 * 1024
    )
    if (invalid.length > 0) {
      setFileError(`Some files were rejected. Max ${MAX_FILE_SIZE_MB}MB per file. Accepted: images, PDF, Word, Excel, text.`)
      return
    }

    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFileError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(files.length > 0)

    const formData = new FormData(e.currentTarget)

    if (files.length > 0) {
      const supabase = getSupabase()
      const uploadedUrls: string[] = []

      for (const file of files) {
        const path = `contact-attachments/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const { error } = await supabase.storage.from('attachments').upload(path, file)
        if (error) {
          setFileError(`Failed to upload ${file.name}. Please try again.`)
          setUploading(false)
          return
        }
        const { data } = supabase.storage.from('attachments').getPublicUrl(path)
        uploadedUrls.push(data.publicUrl)
      }

      if (uploadedUrls.length > 0) {
        const existing = formData.get('message') as string
        formData.set(
          'message',
          `${existing}\n\n--- Attachments ---\n${uploadedUrls.join('\n')}`
        )
      }
    }

    setUploading(false)
    action(formData)
  }

  if (state.success && state.name) {
    return (
      <div className="bg-surface border border-border rounded-xl p-10 text-center">
        <p className="text-text-primary font-semibold text-xl mb-3">Message received.</p>
        <p className="text-text-secondary text-lg">
          Thank you, {state.name}. We&apos;ll be in touch within 1 business day.
        </p>
      </div>
    )
  }

  const isBusy = pending || uploading

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
      />

      <div className="space-y-3">
        <label htmlFor="name" className="block text-base font-medium text-text-primary">
          Full name <span aria-hidden="true" className="text-text-secondary">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-start"
          placeholder="Jane Smith"
        />
        {state.errors?.name && (
          <p className="text-red-400 text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="email" className="block text-base font-medium text-text-primary">
          Email address <span aria-hidden="true" className="text-text-secondary">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-start"
          placeholder="jane@company.com"
        />
        {state.errors?.email && (
          <p className="text-red-400 text-sm">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="company" className="block text-base font-medium text-text-primary">
          Company / Organisation
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-start"
          placeholder="Acme Corp"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="service" className="block text-base font-medium text-text-primary">
          Service interested in <span aria-hidden="true" className="text-text-secondary">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          defaultValue=""
          className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start appearance-none"
        >
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {state.errors?.service && (
          <p className="text-red-400 text-sm">{state.errors.service[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="message" className="block text-base font-medium text-text-primary">
          Message <span aria-hidden="true" className="text-text-secondary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={6}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-start resize-none"
          placeholder="Tell us about your project or question…"
        />
        {state.errors?.message && (
          <p className="text-red-400 text-sm">{state.errors.message[0]}</p>
        )}
      </div>

      {/* Attachments */}
      <div className="space-y-3">
        <label className="block text-base font-medium text-text-primary">
          Attachments <span className="text-text-secondary font-normal text-sm">(optional — up to {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each)</span>
        </label>

        {files.length > 0 && (
          <ul className="space-y-2 mb-3">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-text-secondary text-lg">📎</span>
                  <span className="text-text-primary text-sm truncate">{file.name}</span>
                  <span className="text-text-secondary text-xs flex-shrink-0">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-text-secondary hover:text-red-400 text-sm ml-4 flex-shrink-0 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {files.length < MAX_FILES && (
          <label className="flex items-center gap-3 w-full cursor-pointer rounded-lg border border-dashed border-border bg-surface px-4 py-4 hover:border-accent-start/60 transition-colors">
            <span className="text-text-secondary text-xl">+</span>
            <span className="text-text-secondary text-sm">
              {files.length === 0 ? 'Add files' : 'Add more files'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}

        {fileError && <p className="text-red-400 text-sm">{fileError}</p>}
      </div>

      {state.errors?._form && (
        <p className="text-red-400 text-sm">{state.errors._form[0]}</p>
      )}

      <button
        type="submit"
        disabled={isBusy}
        className="gradient-bg w-full text-white text-base font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading files…' : pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
