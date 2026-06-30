'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const result = await signIn('credentials', { username, password, redirect: false })
    if (result?.error) {
      setError('Usuario o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌿</div>
          <h1 style={{ color: '#485935', fontWeight: 800, fontSize: '28px', margin: 0 }}>Recetas</h1>
          <p style={{ color: '#6B7B5E', fontSize: '14px', marginTop: '6px' }}>Acceso administrador</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(72,89,53,0.12)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={{ display: 'block', color: '#485935', fontWeight: 600, fontSize: '13px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                USUARIO
              </label>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '1.5px solid #CADBB7', backgroundColor: '#fff',
                  color: '#2C2C2C', fontSize: '15px', outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = '#485935' }}
                onBlur={e => { e.target.style.borderColor = '#CADBB7' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#485935', fontWeight: 600, fontSize: '13px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                CONTRASEÑA
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '1.5px solid #CADBB7', backgroundColor: '#fff',
                  color: '#2C2C2C', fontSize: '15px', outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = '#485935' }}
                onBlur={e => { e.target.style.borderColor = '#CADBB7' }}
              />
            </div>

            {error && (
              <p style={{ color: '#b94040', fontSize: '13px', margin: 0, fontWeight: 500 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#485935', color: '#FBFBFB',
                border: 'none', borderRadius: '10px', padding: '14px',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                opacity: loading ? 0.65 : 1, marginTop: '4px',
                letterSpacing: '0.3px',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}
