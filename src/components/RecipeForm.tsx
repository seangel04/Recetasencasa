'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Recipe = {
  id?: string
  title: string
  description?: string | null
  image?: string | null
  ingredients: string
  instructions: string
  prepTime?: number | null
  servings?: number | null
}

const fieldStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid #CADBB7',
  backgroundColor: '#ffffff',
  color: '#2C2C2C',
  fontSize: '15px',
  outline: 'none',
  resize: 'vertical' as const,
}

const labelStyle = {
  display: 'block' as const,
  color: '#485935',
  fontWeight: 600 as const,
  fontSize: '12px',
  letterSpacing: '0.5px',
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
}

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [image, setImage] = useState<string | null>(recipe?.image ?? null)
  const [uploading, setUploading] = useState(false)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setImage(url)
    } else {
      setError('Error al subir la imagen')
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      image,
      ingredients: (form.elements.namedItem('ingredients') as HTMLTextAreaElement).value,
      instructions: (form.elements.namedItem('instructions') as HTMLTextAreaElement).value,
    }
    const url = recipe?.id ? `/api/recipes/${recipe.id}` : '/api/recipes'
    const method = recipe?.id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      router.push('/admin/recetas')
      router.refresh()
    } else {
      setError('Error al guardar la receta')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div>
        <label style={labelStyle}>Nombre de la receta *</label>
        <input name="title" type="text" required defaultValue={recipe?.title} style={fieldStyle}
          placeholder="Ej: Arroz con pollo"
          onFocus={e => { e.target.style.borderColor = '#485935' }}
          onBlur={e => { e.target.style.borderColor = '#CADBB7' }} />
      </div>

      <div>
        <label style={labelStyle}>Descripción <span style={{ color: '#93A267', fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
        <textarea name="description" rows={2} defaultValue={recipe?.description ?? ''} style={fieldStyle}
          placeholder="Breve descripción del plato"
          onFocus={e => { e.target.style.borderColor = '#485935' }}
          onBlur={e => { e.target.style.borderColor = '#CADBB7' }} />
      </div>

      <div>
        <label style={labelStyle}>Foto del plato <span style={{ color: '#93A267', fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Vista previa" style={{ display: 'block', width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #CADBB7', marginBottom: '10px' }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{
            display: 'inline-block', backgroundColor: '#CADBB7', color: '#485935',
            padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer',
          }}>
            {uploading ? 'Subiendo...' : image ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
          {image && (
            <button type="button" onClick={() => setImage(null)} style={{ color: '#93A267', background: 'none', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Quitar
            </button>
          )}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Ingredientes * <span style={{ color: '#93A267', fontWeight: 400, textTransform: 'none' }}>— uno por línea</span></label>
        <textarea name="ingredients" rows={7} required defaultValue={recipe?.ingredients} style={fieldStyle}
          placeholder={"500g de pechuga de pollo\n2 tazas de arroz\n1 cebolla\nSal y pimienta al gusto"}
          onFocus={e => { e.target.style.borderColor = '#485935' }}
          onBlur={e => { e.target.style.borderColor = '#CADBB7' }} />
      </div>

      <div>
        <label style={labelStyle}>Preparación * <span style={{ color: '#93A267', fontWeight: 400, textTransform: 'none' }}>— un paso por línea</span></label>
        <textarea name="instructions" rows={9} required defaultValue={recipe?.instructions} style={fieldStyle}
          placeholder={"Cortar el pollo en trozos medianos\nSofreír la cebolla en aceite hasta dorar\nAgregar el pollo y cocinar 10 minutos\nAñadir el arroz y el caldo"}
          onFocus={e => { e.target.style.borderColor = '#485935' }}
          onBlur={e => { e.target.style.borderColor = '#CADBB7' }} />
      </div>

      {error && <p style={{ color: '#b94040', fontSize: '13px', fontWeight: 500, margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={loading || uploading}
          style={{
            backgroundColor: '#485935', color: '#FBFBFB',
            border: 'none', borderRadius: '10px', padding: '13px 28px',
            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            opacity: (loading || uploading) ? 0.65 : 1,
          }}
        >
          {loading ? 'Guardando...' : recipe?.id ? 'Guardar cambios' : 'Añadir receta'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ color: '#93A267', background: 'none', border: 'none', padding: '13px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>

    </form>
  )
}
