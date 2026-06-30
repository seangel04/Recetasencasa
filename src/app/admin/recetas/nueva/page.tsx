import RecipeForm from '@/components/RecipeForm'

export default function NewRecipePage() {
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#485935', fontWeight: 800, fontSize: '26px', margin: '0 0 8px' }}>Nueva receta</h1>
      <p style={{ color: '#93A267', fontSize: '14px', marginBottom: '32px' }}>Completa los campos para añadir la receta al banco.</p>
      <RecipeForm />
    </div>
  )
}
