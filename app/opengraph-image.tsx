import { ImageResponse } from 'next/og'

export const alt = 'Infoversion — Build Smart Apps, Transform Boldly'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: 'white',
            }}
          >
            /V
          </div>
          <span
            style={{
              color: '#F0F6FC',
              fontSize: 42,
              fontWeight: 700,
              display: 'flex',
            }}
          >
            Infoversion
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 900,
            letterSpacing: '-1.5px',
            color: '#F0F6FC',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span style={{ display: 'flex' }}>Build Smart Apps,</span>
          <span style={{ display: 'flex', color: '#818CF8' }}>Transform Boldly</span>
        </div>

        {/* Services */}
        <div
          style={{
            display: 'flex',
            color: '#8B949E',
            fontSize: 22,
            marginTop: 28,
          }}
        >
          iOS · Android · Web Development · IT Consulting · Agile Coaching
        </div>

        {/* URL */}
        <div
          style={{
            display: 'flex',
            color: '#484F58',
            fontSize: 16,
            marginTop: 48,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          infoversion.com
        </div>
      </div>
    ),
    size,
  )
}
