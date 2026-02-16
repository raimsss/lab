// 1. User

export interface User {
  id: number
  name: string
  email?: string
  isActive: boolean
}

export function createUser(
  id: number,
  name: string,
  email?: string,
  isActive: boolean = true
): User {
  return {
    id,
    name,
    email,
    isActive
  }
}

// 2. Book

export type Genre = 'fiction' | 'non-fiction'

export interface Book {
  title: string
  author: string
  year?: number
  genre: Genre
}

export function createBook(book: Book): Book {
  return book
}

// 3. calculateArea (перегрузка)

export function calculateArea(shape: 'circle', radius: number): number
export function calculateArea(shape: 'square', side: number): number
export function calculateArea(
  shape: 'circle' | 'square',
  value: number
): number {
  if (shape === 'circle') {
    return Math.PI * value * value
  } else {
    return value * value
  }
}

// 4. Status

export type Status = 'active' | 'inactive' | 'new'

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'active':
      return 'green'
    case 'inactive':
      return 'gray'
    case 'new':
      return 'blue'
  }
}

// 5. StringFormatter

export type StringFormatter = (
  str: string,
  uppercase?: boolean
) => string

export const capitalizeFirst: StringFormatter = (
  str,
  uppercase = false
) => {
  if (!str) return str
  const result = str[0].toUpperCase() + str.slice(1)
  return uppercase ? result.toUpperCase() : result
}

export const trimAndFormat: StringFormatter = (
  str,
  uppercase = false
) => {
  const trimmed = str.trim()
  return uppercase ? trimmed.toUpperCase() : trimmed
}

// 6. getFirstElement

export function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined
}

// 7. findById

export interface HasId {
  id: number
}

export function findById<T extends HasId>(
  items: T[],
  id: number
): T | undefined {
  return items.find(item => item.id === id)
}
