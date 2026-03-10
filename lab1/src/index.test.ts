import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createUser, createBook, calculateArea, getStatusColor,
  capitalizeFirst, trimAndFormat, getFirstElement, findById,
  csvToJSON,
  formatCSVFileToJSONFile
} from './index'

describe('User', () => {
  it('creates user with default isActive', () => {
    expect(createUser(1, 'John').isActive).toBe(true)
  })
})

describe('Book', () => {
  it('creates book without year', () => {
    expect(createBook({ title: 'Test', author: 'Author', genre: 'fiction' }).year).toBeUndefined()
  })
})

describe('calculateArea', () => {
  it('calculates circle and square areas', () => {
    expect(calculateArea('circle', 2)).toBeCloseTo(12.566, 2)
    expect(calculateArea('square', 4)).toBe(16)
  })
})

describe('Status', () => {
  it('returns correct colors', () => {
    expect(getStatusColor('active')).toBe('green')
    expect(getStatusColor('inactive')).toBe('gray')
    expect(getStatusColor('new')).toBe('blue')
  })
})

describe('StringFormatter', () => {
  it('formats strings correctly', () => {
    expect(capitalizeFirst('hello')).toBe('Hello')
    expect(trimAndFormat('  hello  ', true)).toBe('HELLO')
  })
})

describe('getFirstElement', () => {
  it('returns first element or undefined', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1)
    expect(getFirstElement([])).toBeUndefined()
  })
})

describe('findById', () => {
  it('finds object by id', () => {
    expect(findById([{ id: 1, name: 'A' }], 1)).toEqual({ id: 1, name: 'A' })
  })
})

describe('csvToJSON', () => {
  it('should convert valid CSV array to JSON array', () => {
    const input = ["p1;p2;p3", "1;A;b", "2;B;v"]
    const delimiter = ';'
    const expected = [
      { p1: '1', p2: 'A', p3: 'b' },
      { p1: '2', p2: 'B', p3: 'v' }
    ]
    expect(csvToJSON(input, delimiter)).toEqual(expected)
  })

  it('should handle empty input array', () => {
    expect(csvToJSON([], ';')).toEqual([])
  })

  it('should trim whitespace from headers and values', () => {
    const input = [" p1 ; p2 ", " 1 ; A "]
    const expected = [{ p1: '1', p2: 'A' }]
    expect(csvToJSON(input, ';')).toEqual(expected)
  })

  it('should throw an error if number of columns is inconsistent', () => {
    const input = ["p1;p2;p3", "1;A", "2;B;v;d"]
    expect(() => csvToJSON(input, ';')).toThrow(/Несоответствие количества столбцов/)
  })

  it('should work with different delimiters', () => {
    const input = ["p1,p2,p3", "1,A,b", "2,B,v"]
    const delimiter = ','
    const expected = [
      { p1: '1', p2: 'A', p3: 'b' },
      { p1: '2', p2: 'B', p3: 'v' }
    ]
    expect(csvToJSON(input, delimiter)).toEqual(expected)
  })
})

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))

import { readFile, writeFile } from 'node:fs/promises'

describe('formatCSVFileToJSONFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should read file, convert CSV to JSON, and write to output file', async () => {
    const mockCsvContent = "id;name\n1;Alice\n2;Bob"
    const expectedJson = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]
    const expectedJsonString = JSON.stringify(expectedJson, null, 2)

    vi.mocked(readFile).mockResolvedValue(mockCsvContent)

    const inputPath = 'input.csv'
    const outputPath = 'output.json'
    const delimiter = ';'

    await formatCSVFileToJSONFile(inputPath, outputPath, delimiter)

    expect(readFile).toHaveBeenCalledTimes(1)
    expect(readFile).toHaveBeenCalledWith(inputPath, { encoding: 'utf-8' })

    expect(writeFile).toHaveBeenCalledTimes(1)
    expect(writeFile).toHaveBeenCalledWith(outputPath, expectedJsonString, { encoding: 'utf-8' })
  })

  it('should handle empty lines and trailing newline correctly', async () => {
    const mockCsvContent = "id;name\n1;Alice\n2;Bob\n"
    const expectedJson = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]
    const expectedJsonString = JSON.stringify(expectedJson, null, 2)

    vi.mocked(readFile).mockResolvedValue(mockCsvContent)

    await formatCSVFileToJSONFile('in.csv', 'out.json', ';')

    expect(writeFile).toHaveBeenCalledWith('out.json', expectedJsonString, { encoding: 'utf-8' })
  })

  it('should throw an error if readFile fails', async () => {
    const errorMessage = 'File not found'
    vi.mocked(readFile).mockRejectedValue(new Error(errorMessage))

    await expect(formatCSVFileToJSONFile('bad.csv', 'out.json', ';'))
      .rejects
      .toThrow(`Ошибка при обработке файла: Error: ${errorMessage}`)
  })

  it('should throw an error if csvToJSON throws an error', async () => {
    const mockBadCsvContent = "id;name\n1;Alice;extra"
    vi.mocked(readFile).mockResolvedValue(mockBadCsvContent)

    await expect(formatCSVFileToJSONFile('bad.csv', 'out.json', ';'))
      .rejects
      .toThrow(/Ошибка при обработке файла/)
  })
})