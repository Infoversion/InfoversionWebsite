import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components'

interface AdminNotificationProps {
  name: string
  email: string
  company?: string
  service: string
  message: string
  submissionId: string
}

export default function AdminNotification({
  name,
  email,
  company,
  service,
  message,
  submissionId,
}: AdminNotificationProps) {
  const adminUrl = `https://infoversion.com/admin/queries/${submissionId}`

  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name} — {service}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f5', padding: '32px 0' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            New enquiry from {name}
          </Text>
          <Text style={{ color: '#71717a', marginTop: '0' }}>{service}</Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ margin: '4px 0' }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ margin: '4px 0' }}>
            <strong>Email:</strong> {email}
          </Text>
          {company && (
            <Text style={{ margin: '4px 0' }}>
              <strong>Company:</strong> {company}
            </Text>
          )}
          <Text style={{ margin: '4px 0' }}>
            <strong>Service:</strong> {service}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ fontWeight: 'bold', marginBottom: '8px' }}>Message</Text>
          <Text
            style={{
              backgroundColor: '#f4f4f5',
              padding: '16px',
              borderRadius: '6px',
              color: '#3f3f46',
              lineHeight: '1.6',
            }}
          >
            {message}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Link
            href={adminUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            View in admin panel →
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
