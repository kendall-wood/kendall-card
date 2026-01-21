'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodePage() {
  // Use the local network IP for mobile access
  const localUrl = 'http://192.168.1.86:3000';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px', fontSize: '24px', textAlign: 'center' }}>
        Scan to view on mobile
      </h1>
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <QRCodeSVG 
          value={localUrl}
          size={300}
          level="H"
          includeMargin={true}
        />
      </div>
      <p style={{ 
        fontSize: '14px', 
        color: '#888', 
        textAlign: 'center',
        maxWidth: '300px',
        marginTop: '10px'
      }}>
        {localUrl}
      </p>
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center',
        maxWidth: '300px',
        marginTop: '20px'
      }}>
        Make sure your phone is on the same Wi-Fi network
      </p>
    </div>
  );
}




