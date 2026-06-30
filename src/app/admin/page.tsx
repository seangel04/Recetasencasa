import { db } from '@/lib/db'
import { format } from 'date-fns'
import CalendarDnd from '@/components/CalendarDnd'

export const dynamic = 'force-dynamic'

export default async function AdminCalendarPage() {
  const now = new Date()
  const monthStr = format(now, 'yyyy-MM')

  const [recipes, entries] = await Promise.all([
    db.recipe.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    db.calendarEntry.findMany({
      where: { date: { startsWith: monthStr } },
      include: { recipe: { select: { id: true, title: true } } },
      orderBy: { date: 'asc' },
    }),
  ])

  return (
    <div className="p-6">
      <CalendarDnd
        recipes={recipes}
        initialEntries={entries.map((e) => ({ date: e.date, recipe: e.recipe }))}
        initialMonth={now}
      />
    </div>
  )
}
