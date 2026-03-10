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

export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export function query<T>(...steps: Array<Transform<T> | GroupTransform<T, any>>): Transform<T> {
  return (data: T[]): T[] => {
    return steps.reduce((acc, step) => step(acc as any), data as any) as T[];
  };
}

export const where: Where<any> = (key, value) => (data) => {
  return data.filter((item) => item[key] === value);
};

export const sort: Sort<any> = (key) => (data) => {
  return [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
};

export const groupBy: GroupBy<any> = (key) => (data) => {
  const groups: Record<string, Group<any, any>> = {};

  for (const item of data) {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = { key: item[key], items: [] };
    }
    groups[groupKey].items.push(item);
  }

  return Object.values(groups);
};

export const having: Having<any> = (predicate) => (groups) => {
  return groups.filter(predicate);
};