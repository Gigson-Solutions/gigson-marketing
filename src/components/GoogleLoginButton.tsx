'use client';

import { useEffect, useState } from 'react';

// Payload admin UI component — se carga en la pantalla de login antes del formulario.
// Plain <a> intencionado: next/link haría prefetch del endpoint OAuth y causaría errores 204.
//
// `?error=...` es lo que `payload-oauth2` añade al redirigir aquí tras un fallo
// (dominio no permitido, code inválido, fallo de intercambio de token con Google...).
// Antes este componente lo ignoraba por completo — el login fallaba en silencio,
// sin ningún indicio visible de qué pasó ("no sucede nada" al hacer SSO).
export default function GoogleLoginButton() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setError(params.get('error'));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}
    >
      {error && (
        <p
          style={{
            margin: 0,
            padding: '0.6rem 0.9rem',
            borderRadius: '4px',
            background: '#fce8e6',
            color: '#c5221f',
            fontSize: '12px',
            fontFamily: 'Roboto, Arial, sans-serif',
            maxWidth: '320px',
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}
      <a
        href="/api/users/oauth/authorize"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.6rem 1.25rem',
          border: '1px solid #dadce0',
          borderRadius: '4px',
          textDecoration: 'none',
          color: '#3c4043',
          fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          background: '#fff',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,.08)',
          transition: 'box-shadow 0.15s',
        }}
      >
        {/* Google G logo */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.333C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        Continue with Google
      </a>
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: '#80868b',
          textAlign: 'center',
        }}
      >
        Solo cuentas @somosgigson.com
      </p>
    </div>
  );
}
