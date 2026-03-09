import { readFile, writeFile } from 'node:fs/promises';

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

export function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined
}

export interface HasId {
  id: number
}

export function findById<T extends HasId>(
  items: T[],
  id: number
): T | undefined {
  return items.find(item => item.id === id)
}

export function csvToJSON(input: string[], delimiter: string): object[] {
  if (input.length === 0) {
    return [];
  }

  const headers = input[0].split(delimiter);
  const result: object[] = [];

  for (let i = 1; i < input.length; i++) {
    const values = input[i].split(delimiter);

    if (values.length !== headers.length) {
      throw new Error(
        `Несоответствие количества столбцов в строке ${i + 1}. ` +
        `Ожидалось: ${headers.length}, получено: ${values.length}`
      );
    }

    const rowObject: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j].trim()] = values[j].trim();
    }
    result.push(rowObject);
  }

  return result;
}

export async function formatCSVFileToJSONFile(
  inputFile: string,
  outputFile: string,
  delimiter: string
): Promise<void> {
  try {
    const fileContent = await readFile(inputFile, { encoding: 'utf-8' });
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const jsonData = csvToJSON(lines, delimiter);
    await writeFile(outputFile, JSON.stringify(jsonData, null, 2), { encoding: 'utf-8' });
  } catch (error) {
    throw new Error(`Ошибка при обработке файла: ${error}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n=== ДЕМОНСТРАЦИЯ РАБОТЫ ФУНКЦИЙ ===\n')

  console.log('1. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ:')
  const user1 = createUser(1, 'Иван')
  const user2 = createUser(2, 'Мария', 'maria@example.com', false)
  console.log('  user1 (isActive по умолчанию):', user1)
  console.log('  user2 (isActive = false):', user2)
  console.log()

  console.log('2. СОЗДАНИЕ КНИГИ:')
  const book1 = createBook({
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'fiction'
  })
  const book2 = createBook({
    title: 'История России',
    author: 'Историк',
    year: 2023,
    genre: 'non-fiction'
  })
  console.log('  book1 (без года):', book1)
  console.log('  book2 (с годом):', book2)
  console.log()

  console.log('3. ВЫЧИСЛЕНИЕ ПЛОЩАДИ:')
  const circleArea = calculateArea('circle', 5)
  const squareArea = calculateArea('square', 4)
  console.log(`  Площадь круга (радиус 5): ${circleArea.toFixed(2)}`)
  console.log(`  Площадь квадрата (сторона 4): ${squareArea}`)
  console.log()

  console.log('4. ЦВЕТА СТАТУСОВ:')
  console.log(`  active -> ${getStatusColor('active')}`)
  console.log(`  inactive -> ${getStatusColor('inactive')}`)
  console.log(`  new -> ${getStatusColor('new')}`)
  console.log()

  console.log('5. ФОРМАТИРОВАНИЕ СТРОК:')
  const testStr = '  привет мир  '
  console.log(`  Исходная строка: "${testStr}"`)
  console.log(`  capitalizeFirst: "${capitalizeFirst('hello')}"`)
  console.log(`  trimAndFormat: "${trimAndFormat(testStr, false)}"`)
  console.log(`  trimAndFormat + uppercase: "${trimAndFormat(testStr, true)}"`)
  console.log()

  console.log('6. ПЕРВЫЙ ЭЛЕМЕНТ МАССИВА:')
  const numbers = [10, 20, 30, 40, 50]
  const emptyArray: number[] = []
  console.log(`  Массив [10, 20, 30, 40, 50] -> первый элемент: ${getFirstElement(numbers)}`)
  console.log(`  Пустой массив -> первый элемент: ${getFirstElement(emptyArray)}`)
  console.log()

  console.log('7. ПОИСК ПО ID:')
  const items = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 3', price: 300 }
  ]
  const foundItem = findById(items, 2)
  const notFoundItem = findById(items, 5)
  console.log('  Товары:', items)
  console.log('  Поиск id=2:', foundItem)
  console.log('  Поиск id=5:', notFoundItem)
  console.log()

  console.log('8. ДОПОЛНИТЕЛЬНЫЕ ПРИМЕРЫ:')
  const users = [
    createUser(1, 'Анна', 'anna@mail.com'),
    createUser(2, 'Петр', 'petr@mail.com', false),
    createUser(3, 'Елена')
  ]
  console.log('  Все пользователи:', users)
  const activeUsers = users.filter(user => user.isActive)
  console.log('  Активные пользователи:', activeUsers)
  const fictionBook = createBook({
    title: 'Преступление и наказание',
    author: 'Достоевский',
    genre: 'fiction',
    year: 1866
  })
  console.log('  Книга в жанре fiction:', fictionBook)

  console.log('\n=== ДЕМОНСТРАЦИЯ НОВЫХ ФУНКЦИЙ LAB3 ===\n')

  console.log('1. csvToJSON:')
  const csvData = ["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"]
  const jsonResult = csvToJSON(csvData, ';')
  console.log('  Входные данные:', csvData)
  console.log('  Результат:', jsonResult)
  console.log()

  console.log('2. csvToJSON (ошибка):')
  try {
    const badCsvData = ["p1;p2;p3", "1;A;b;c"]
    csvToJSON(badCsvData, ';')
  } catch (e: any) {
    console.log('  Ошибка поймана:', e.message)
  }
  console.log()

  console.log('\n=== КОНЕЦ ДЕМОНСТРАЦИИ ===\n')
}