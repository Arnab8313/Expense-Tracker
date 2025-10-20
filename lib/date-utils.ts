export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function convertDDMMYYYYToISO(dateString: string): string {
  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

export function convertISOToDDMMYYYY(dateString: string): string {
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}
