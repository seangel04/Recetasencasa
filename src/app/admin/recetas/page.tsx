import { db } from '@/lib/db'
import Link from 'next/link'
import DeleteRecipeButton from './DeleteRecipeButton'

export const dynamic = 'force-dynamic'

export default async function RecipeBankPage() {
  const recipes = await db.recipe.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div style={{ padding: '40px', width: '100%' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#485935', fontWeight: 800, fontSize: '28px', margin: 0 }}>Banco de recetas</h1>
          <p style={{ color: '#93A267', fontSize: '14px', marginTop: '4px' }}>{recipes.length} receta{recipes.length !== 1 ? 's' : ''} disponible{recipes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/recetas/nueva"
          style={{
            backgroundColor: '#485935', color: '#FBFBFB',
            padding: '11px 22px', borderRadius: '10px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            letterSpacing: '0.2px',
          }}
        >
          + Nueva receta
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #CADBB7', padding: '64px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: '#93A267', fontSize: '18px', fontWeight: 500, margin: 0 }}>No hay recetas todavía</p>
          <Link href="/admin/recetas/nueva" style={{ color: '#485935', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginTop: '12px', textDecoration: 'none' }}>
            Añade tu primera receta →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recipes.map((r) => (
            <div
              key={r.id}
              className="recipe-row"
              style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #CADBB7', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {r.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image} alt={r.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid #CADBB7' }} />
                )}
                <div>
                <h2 style={{ color: '#485935', fontWeight: 700, fontSize: '17px', margin: 0 }}>{r.title}</h2>
                {r.description && <p style={{ color: '#93A267', fontSize: '13px', marginTop: '3px', marginBottom: 0 }}>{r.description}</p>}
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  {r.prepTime && <span style={{ color: '#aab89a', fontSize: '12px', fontWeight: 500 }}>⏱ {r.prepTime} min</span>}
                  {r.servings && <span style={{ color: '#aab89a', fontSize: '12px', fontWeight: 500 }}>👥 {r.servings} pers.</span>}
                </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href={`/admin/recetas/${r.id}`} style={{ color: '#485935', fontSize: '13px', fontWeight: 600, textDecoration: 'none', backgroundColor: '#CADBB7', padding: '6px 14px', borderRadius: '7px' }}>
                  Editar
                </Link>
                <DeleteRecipeButton id={r.id} title={r.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
