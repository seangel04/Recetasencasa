import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await db.recipe.findUnique({ where: { id } })
  if (!recipe) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, description, image, ingredients, instructions, prepTime, servings } = body

  const recipe = await db.recipe.update({
    where: { id },
    data: {
      title,
      description: description || null,
      image: image || null,
      ingredients,
      instructions,
      prepTime: prepTime ? Number(prepTime) : null,
      servings: servings ? Number(servings) : null,
    },
  })

  return NextResponse.json(recipe)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  await db.recipe.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
