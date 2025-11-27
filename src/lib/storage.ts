/**
 * LocalStorage utility for persisting Manara data
 */

const STORAGE_PREFIX = 'facilitypro_'
const STORAGE_VERSION = 'v1'

export const StorageKeys = {
  PROPERTIES: `${STORAGE_PREFIX}${STORAGE_VERSION}_properties`,
  TENANTS: `${STORAGE_PREFIX}${STORAGE_VERSION}_tenants`,
  LEASES: `${STORAGE_PREFIX}${STORAGE_VERSION}_leases`,
  EMPLOYEES: `${STORAGE_PREFIX}${STORAGE_VERSION}_employees`,
  VENDORS: `${STORAGE_PREFIX}${STORAGE_VERSION}_vendors`,
  WORK_ORDERS: `${STORAGE_PREFIX}${STORAGE_VERSION}_work_orders`,
  MAINTENANCE: `${STORAGE_PREFIX}${STORAGE_VERSION}_maintenance`,
  FACILITIES: `${STORAGE_PREFIX}${STORAGE_VERSION}_facilities`,
  PAYMENTS: `${STORAGE_PREFIX}${STORAGE_VERSION}_payments`,
  CANVASES: `${STORAGE_PREFIX}${STORAGE_VERSION}_canvases`,
}

export function saveToStorage<T>(key: string, data: T): void {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return

  try {
    const serialized = JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() }
      }
      return value
    })
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const parsed = JSON.parse(item, (key, value) => {
      // Convert ISO strings back to Date objects
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value)
      }
      return value
    })
    return parsed
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

export function clearStorage(): void {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return

  Object.values(StorageKeys).forEach((key) => {
    localStorage.removeItem(key)
  })
}
