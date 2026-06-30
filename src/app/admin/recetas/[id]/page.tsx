import { db } from '@/lib/db'
import RecipeForm from '@/components/RecipeForm'
import { notFound } from 'next/navigation'

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await db.recipe.findUnique({ where: { id } })
  if (!recipe) notFound()

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#485935', fontWeight: 800, fontSize: '26px', margin: '0 0 8px' }}>Editar receta</h1>
      <p style={{ color: '#93A267', fontSize: '14px', marginBottom: '32px' }}>{recipe.title}</p>
      <RecipeForm recipe={recipe} />
    </div>
  )
}
