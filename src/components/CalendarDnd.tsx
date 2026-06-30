'use client'

import { useState, useCallback } from 'react'
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

type Recipe = { id: string; title: string }
type CalendarEntry = { date: string; recipe: Recipe }

interface Props {
  recipes: Recipe[]
  initialEntries: CalendarEntry[]
  initialMonth: Date
}

function DraggableRecipe({ recipe }: { recipe: Recipe }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${recipe.id}`,
    data: { recipe },
  })
  return (
    <div
      ref={setNodeRef} {...listeners} {...attributes}
      style={{
        backgroundColor: isDragging ? '#CADBB7' : '#FBFBFB',
        border: '1px solid #CADBB7',
        borderRadius: '8px',
        padding: '9px 12px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#485935',
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transition: 'background 0.15s',
      }}
    >
      {recipe.title}
    </div>
  )
}

function CalendarDay({ date, entry, onRemove }: { date: Date; entry?: CalendarEntry; onRemove: (date: string) => void }) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')
  const { setNodeRef, isOver } = useDroppable({ id: `day-${dateStr}`, data: { date: dateStr } })

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '110px',
        borderRadius: '10px',
        padding: '6px',
        border: isOver ? '2px solid #485935' : isToday ? '2px solid #93A267' : '1.5px solid #CADBB7',
        backgroundColor: isOver ? '#E8F0E0' : isToday ? '#F0F5E8' : '#ffffff',
        transition: 'all 0.1s',
      }}
    >
      <div style={{
        fontSize: '13px', fontWeight: 700, padding: '0 2px', marginBottom: '6px',
        color: isToday ? '#485935' : '#93A267',
      }}>
        {format(date, 'd')}
      </div>
      {entry && (
        <div
          className="group"
          style={{ position: 'relative', backgroundColor: '#485935', borderRadius: '6px', padding: '4px 8px' }}
        >
          <span style={{ display: 'block', fontSize: '12px', color: '#CADBB7', fontWeight: 500, paddingRight: '14px', lineHeight: 1.3 }}>
            {entry.recipe.title}
          </span>
          <button
            onClick={() => onRemove(dateStr)}
            style={{
              position: 'absolute', top: '3px', right: '5px',
              background: 'none', border: 'none', color: '#CADBB7',
              fontSize: '14px', cursor: 'pointer', lineHeight: 1, padding: 0, fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function CalendarDnd({ recipes, initialEntries, initialMonth }: Props) {
  const [entries, setEntries] = useState<CalendarEntry[]>(initialEntries)
  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [activeDrag, setActiveDrag] = useState<Recipe | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
  const firstDayOfWeek = (getDay(days[0]) + 6) % 7
  const paddingDays = Array(firstDayOfWeek).fill(null)

  const getEntry = useCallback((dateStr: string) => entries.find((e) => e.date === dateStr), [entries])

  async function assignRecipe(date: string, recipe: Recipe) {
    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, recipeId: recipe.id }),
    })
    if (res.ok) setEntries((prev) => [...prev.filter((e) => e.date !== date), { date, recipe }])
  }

  async function removeEntry(date: string) {
    const res = await fetch(`/api/calendar/${date}`, { method: 'DELETE' })
    if (res.ok) setEntries((prev) => prev.filter((e) => e.date !== date))
  }

  function handleDragStart(event: DragStartEvent) {
    const recipe = event.active.data.current?.recipe as Recipe
    if (recipe) setActiveDrag(recipe)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null)
    const { active, over } = event
    if (!over) return
    const recipe = active.data.current?.recipe as Recipe
    const targetDate = over.data.current?.date as string
    if (recipe && targetDate) assignRecipe(targetDate, recipe)
  }

  const changeMonth = async (dir: 'prev' | 'next') => {
    const next = dir === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1)
    setCurrentMonth(next)
    const res = await fetch(`/api/calendar?month=${format(next, 'yyyy-MM')}`)
    setEntries(await res.json())
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '32px', padding: '32px 40px', minHeight: 'calc(100vh - 60px)' }}>

        {/* Sidebar */}
        <aside style={{ width: '200px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#CADBB7', borderRadius: '14px', padding: '20px 16px' }}>
            <h2 style={{ color: '#485935', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px' }}>
              Banco de recetas
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {recipes.length === 0 ? (
                <p style={{ color: '#6B7B5E', fontSize: '12px', lineHeight: 1.5 }}>
                  Añade recetas desde &quot;Banco de recetas&quot;.
                </p>
              ) : recipes.map((r) => <DraggableRecipe key={r.id} recipe={r} />)}
            </div>
          </div>
        </aside>

        {/* Calendar */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              onClick={() => changeMonth('prev')}
              style={{ backgroundColor: '#CADBB7', border: 'none', color: '#485935', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Anterior
            </button>
            <h2 style={{ color: '#485935', fontWeight: 800, fontSize: '20px', textTransform: 'capitalize', margin: 0 }}>
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
            <button
              onClick={() => changeMonth('next')}
              style={{ backgroundColor: '#CADBB7', border: 'none', color: '#485935', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Siguiente →
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
            {WEEKDAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#93A267', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              return <CalendarDay key={dateStr} date={day} entry={getEntry(dateStr)} onRemove={removeEntry} />
            })}
          </div>

          <p style={{ color: '#93A267', fontSize: '12px', marginTop: '16px' }}>
            💡 Arrastra una receta del panel izquierdo hacia el día que quieras asignar.
          </p>
        </div>

      </div>

      <DragOverlay>
        {activeDrag && (
          <div style={{ backgroundColor: '#485935', color: '#CADBB7', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            {activeDrag.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
