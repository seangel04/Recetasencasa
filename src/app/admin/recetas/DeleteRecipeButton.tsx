'use client'

import { useRouter } from 'next/navigation'

export default function DeleteRecipeButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }
  return (
    <button
      onClick={handleDelete}
      style={{ color: '#b94040', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
    >
      Eliminar
    </button>
  )
}
