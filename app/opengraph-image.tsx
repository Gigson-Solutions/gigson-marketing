import { ImageResponse } from 'next/og';

export const alt = 'Gigson Solutions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#F4F3EF',
          padding: '80px 96px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 96, fontWeight: 700 }}>
          <span style={{ color: '#3C3C3B' }}>gigson</span>
          <span style={{ color: '#7874F4', marginLeft: 20 }}>solutions</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            color: '#868685',
            display: 'flex',
          }}
        >
          AI Agents · Odoo &amp; Holded ERP · Custom Software
        </div>
      </div>
    ),
    { ...size }
  );
}
