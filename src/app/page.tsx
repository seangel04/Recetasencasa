import { db } from '@/lib/db'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const entry = await db.calendarEntry.findUnique({
    where: { date: today },
    include: { recipe: true },
  })

  const recipe = entry?.recipe
  const dateLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', borderBottom: '1px solid #CADBB7', padding: '0 clamp(20px, 5vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ color: '#485935', fontWeight: 700, fontSize: '20px' }}>🌿 Recetas</span>
        <Link href="/admin" style={{ color: '#93A267', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          Admin →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: 'rgba(202,219,183,0.85)', backdropFilter: 'blur(4px)', padding: 'clamp(40px, 7vw, 56px) clamp(20px, 5vw, 40px) clamp(48px, 8vw, 64px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ color: '#485935', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', opacity: 0.8 }}>
            {dateLabel}
          </p>
          <h1 style={{ color: '#485935', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
            {recipe ? recipe.title : 'Receta\ndel día'}
          </h1>
          {recipe?.description && (
            <p style={{ color: '#485935', opacity: 0.75, fontSize: '18px', maxWidth: '480px', lineHeight: 1.6 }}>
              {recipe.description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: 'clamp(32px, 6vw, 48px) clamp(20px, 5vw, 40px)' }}>
        {!recipe ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #CADBB7', padding: '64px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
            <p style={{ color: '#93A267', fontSize: '22px', fontWeight: 500 }}>No hay receta para hoy</p>
            <p style={{ color: '#aab89a', fontSize: '15px', marginTop: '8px' }}>El administrador asignará una receta pronto.</p>
          </div>
        ) : (
          <>
          {recipe.image && (
            <div style={{ marginBottom: '32px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #CADBB7', boxShadow: '0 4px 20px rgba(72,89,53,0.10)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={recipe.image} alt={recipe.title} style={{ display: 'block', width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #CADBB7', padding: 'clamp(20px, 5vw, 32px)' }}>
              <h2 style={{ color: '#485935', fontWeight: 700, fontSize: '22px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #CADBB7' }}>
                Ingredientes
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recipe.ingredients.split('\n').filter(Boolean).map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '17px', color: '#2C2C2C', lineHeight: 1.4 }}>
                    <span style={{ color: '#93A267', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>•</span>
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #CADBB7', padding: 'clamp(20px, 5vw, 32px)' }}>
              <h2 style={{ color: '#485935', fontWeight: 700, fontSize: '22px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #CADBB7' }}>
                Preparación
              </h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', lineHeight: 1.5 }}>
                    <span style={{ flexShrink: 0, width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#CADBB7', color: '#485935', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '17px', color: '#2C2C2C', paddingTop: '4px' }}>{step.trim()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          </>
        )}
      </section>

      <footer style={{ backgroundColor: '#485935', padding: '28px 40px' }}>
        <p style={{ color: '#CADBB7', fontSize: '13px', textAlign: 'center', margin: 0 }}>
          🌿 Recetas del día — hecho con cariño
        </p>
      </footer>

    </div>
  )
}
