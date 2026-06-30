import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const entry = await db.calendarEntry.findUnique({
    where: { date },
    include: { recipe: true },
  })
  return NextResponse.json(entry)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { date } = await params
  await db.calendarEntry.deleteMany({ where: { date } })
  return NextResponse.json({ ok: true })
}
