import Link from 'next/link'
import { auth, signOut } from '@/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ backgroundColor: 'rgba(72,89,53,0.93)', backdropFilter: 'blur(8px)', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/" style={{ color: '#FBFBFB', fontWeight: 800, fontSize: '18px', textDecoration: 'none', letterSpacing: '-0.3px' }}>
            🌿 Recetas
          </Link>
          <Link href="/admin" style={{ color: '#CADBB7', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
            Calendario
          </Link>
          <Link href="/admin/recetas" style={{ color: '#CADBB7', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
            Banco de recetas
          </Link>
        </div>
        {session && (
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}>
            <button type="submit" style={{ color: '#CADBB7', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Cerrar sesión
            </button>
          </form>
        )}
      </nav>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1300px' }}>{children}</div>
      </div>
    </div>
  )
}
