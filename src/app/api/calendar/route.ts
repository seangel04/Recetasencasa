import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // YYYY-MM

  const entries = await db.calendarEntry.findMany({
    where: month ? { date: { startsWith: month } } : undefined,
    include: { recipe: { select: { id: true, title: true } } },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { date, recipeId } = await req.json()
  if (!date || !recipeId) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const entry = await db.calendarEntry.upsert({
    where: { date },
    create: { date, recipeId },
    update: { recipeId },
    include: { recipe: { select: { id: true, title: true } } },
  })

  return NextResponse.json(entry)
}
