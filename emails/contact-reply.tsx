import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Preview,
} from '@react-email/components'

interface ContactReplyProps {
  contactName: string
  replyBody: string
}

export default function ContactReply({ contactName, replyBody }: ContactReplyProps) {
  return (
    <Html>
      <Head />
      <Preview>A reply from Invoversion</Preview>
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
          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>Hi {contactName},</Text>
          <Text style={{ color: '#3f3f46', lineHeight: '1.6' }}>
            Thank you for reaching out to Invoversion. Here is our response:
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text
            style={{
              backgroundColor: '#f4f4f5',
              padding: '16px',
              borderRadius: '6px',
              color: '#3f3f46',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}
          >
            {replyBody}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ color: '#71717a', fontSize: '12px' }}>
            Invoversion LLC · infoversion.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
