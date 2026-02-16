import { describe, it, expect } from 'vitest'
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndFormat,
  getFirstElement,
  findById
} from './index'

describe('User', () => {
  it('creates user with default isActive', () => {
    const user = createUser(1, 'John')
    expect(user.isActive).toBe(true)
  })
})

describe('Book', () => {
  it('creates book without year', () => {
    const book = createBook({
      title: 'Test',
      author: 'Author',
      genre: 'fiction'
    })
    expect(book.year).toBeUndefined()
  })
})

describe('calculateArea', () => {
  it('calculates circle area', () => {
    const area = calculateArea('circle', 2)
    expect(area).toBeCloseTo(12.566, 2)
  })

  it('calculates square area', () => {
    expect(calculateArea('square', 4)).toBe(16)
  })
})

describe('Status', () => {
  it('returns correct color', () => {
    expect(getStatusColor('active')).toBe('green')
  })
})

describe('StringFormatter', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello')
  })

  it('trims and uppercase', () => {
    expect(trimAndFormat('  hello  ', true)).toBe('HELLO')
  })
})

describe('getFirstElement', () => {
  it('returns first element', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1)
  })

  it('returns undefined if empty', () => {
    expect(getFirstElement([])).toBeUndefined()
  })
})

describe('findById', () => {
  it('finds object by id', () => {
    const items = [{ id: 1, name: 'A' }]
    expect(findById(items, 1)).toEqual({ id: 1, name: 'A' })
  })
})
