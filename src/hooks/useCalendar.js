import { useState, useCallback } from 'react'

// Set this to your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export function useCalendar() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSlots = useCallback(async (dateStr, durationMin) => {
    if (!APPS_SCRIPT_URL) {
      // Dev mode: return mock slots so UI is testable without backend
      setSlots(generateMockSlots(dateStr))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const url = `${APPS_SCRIPT_URL}?action=availability&date=${dateStr}&duration=${durationMin}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch (e) {
      setError(e.message)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  const bookSlot = useCallback(async ({ name, phone, service, date, time, duration }) => {
    if (!APPS_SCRIPT_URL) {
      // Dev mode: simulate success
      await new Promise(r => setTimeout(r, 1000))
      return { success: true }
    }
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ name, phone, service, date, time, duration }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }, [])

  return { slots, loading, error, fetchSlots, bookSlot }
}

function generateMockSlots(dateStr) {
  const day = new Date(dateStr).getDay()
  if (day === 0) return [] // Sunday closed
  const hours = []
  const end = day === 6 ? 18 : day === 5 ? 21 : 20
  for (let h = 9; h < end; h++) {
    hours.push(`${String(h).padStart(2, '0')}:00`)
    hours.push(`${String(h).padStart(2, '0')}:30`)
  }
  // Randomly remove ~30% to simulate bookings
  return hours.filter(() => Math.random() > 0.3)
}
