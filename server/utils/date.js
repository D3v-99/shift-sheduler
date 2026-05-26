export const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const toStartOfDay = (value) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export const toEndOfDay = (value) => {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

export const startOfWeek = (value) => {
  // UTC-based to avoid timezone shifts when crossing week boundaries
  const d = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()))
  const day = d.getUTCDay()
  // Monday = 1, Sunday = 0 => diff to previous Monday
  const diff = (day === 0 ? -6 : 1) - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export const endOfWeek = (value) => {
  const start = startOfWeek(value)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 6)
  end.setUTCHours(23, 59, 59, 999)
  return end
}

export const dateKey = (value) => toStartOfDay(value).toISOString().slice(0, 10)
