import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(recipes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { title, description, image, ingredients, instructions, prepTime, servings } = body

  if (!title || !ingredients || !instructions) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const recipe = await db.recipe.create({
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

  return NextResponse.json(recipe, { status: 201 })
}
