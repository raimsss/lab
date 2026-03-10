import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest';
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndFormat,
  getFirstElement,
  findById,
  csvToJSON,
  formatCSVFileToJSONFile,
  where,
  sort,
  groupBy,
  having,
  query,
  type Transform,
  type Group,
  type WhereStep,
  type GroupByStep,
  type HavingStep,
  type SortStep,
} from './index';

describe('User', () => {
  it('creates user with default isActive', () => {
    expect(createUser(1, 'John').isActive).toBe(true);
  });
});

describe('Book', () => {
  it('creates book without year', () => {
    expect(createBook({ title: 'Test', author: 'Author', genre: 'fiction' }).year).toBeUndefined();
  });
});

describe('calculateArea', () => {
  it('calculates circle and square areas', () => {
    expect(calculateArea('circle', 2)).toBeCloseTo(12.566, 2);
    expect(calculateArea('square', 4)).toBe(16);
  });
});

describe('Status', () => {
  it('returns correct colors', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('gray');
    expect(getStatusColor('new')).toBe('blue');
  });
});

describe('StringFormatter', () => {
  it('formats strings correctly', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(trimAndFormat('  hello  ', true)).toBe('HELLO');
  });
});

describe('getFirstElement', () => {
  it('returns first element or undefined', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
    expect(getFirstElement([])).toBeUndefined();
  });
});

describe('findById', () => {
  it('finds object by id', () => {
    expect(findById([{ id: 1, name: 'A' }], 1)).toEqual({ id: 1, name: 'A' });
  });
});

describe('csvToJSON', () => {
  it('should convert valid CSV array to JSON array', () => {
    const input = ["p1;p2;p3", "1;A;b", "2;B;v"];
    expect(csvToJSON(input, ';')).toEqual([
      { p1: '1', p2: 'A', p3: 'b' },
      { p1: '2', p2: 'B', p3: 'v' }
    ]);
  });

  it('should handle empty input array', () => {
    expect(csvToJSON([], ';')).toEqual([]);
  });

  it('should throw an error if number of columns is inconsistent', () => {
    const input = ["p1;p2;p3", "1;A", "2;B;v;d"];
    expect(() => csvToJSON(input, ';')).toThrow(/Несоответствие количества столбцов/);
  });
});

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

import { readFile, writeFile } from 'node:fs/promises';

describe('formatCSVFileToJSONFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read file, convert CSV to JSON, and write to output file', async () => {
    vi.mocked(readFile).mockResolvedValue("id;name\n1;Alice\n2;Bob");

    await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

    expect(readFile).toHaveBeenCalledWith('input.csv', { encoding: 'utf-8' });
    expect(writeFile).toHaveBeenCalledWith(
      'output.json',
      JSON.stringify([{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }], null, 2),
      { encoding: 'utf-8' }
    );
  });

  it('should throw an error if readFile fails', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('File not found'));

    await expect(formatCSVFileToJSONFile('bad.csv', 'out.json', ';'))
      .rejects
      .toThrow(/Ошибка при обработке файла/);
  });
});

describe('lab5 - type system for query pipeline', () => {
  type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
  };

  const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
  ];

  describe('Type system - operation order validation', () => {
    it('should validate correct order: where -> groupBy -> having -> sort', () => {
      expectTypeOf(where).toMatchTypeOf<WhereStep<User>>();
      expectTypeOf(groupBy).toMatchTypeOf<GroupByStep<User>>();
      expectTypeOf(having).toMatchTypeOf<HavingStep<User>>();
      expectTypeOf(sort).toMatchTypeOf<SortStep<User>>();
    });

    it('should allow all where operations first', () => {
      const validQuery = query<User>(
        where("name", "John"),
        where("surname", "Doe"),
        groupBy("city"),
        having(group => group.items.length > 1),
        sort("age")
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow where then sort', () => {
      const validQuery = query<User>(
        where("name", "John"),
        where("surname", "Doe"),
        sort("age"),
        sort("name")
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow groupBy then having', () => {
      const validQuery = query<User>(
        groupBy("city"),
        having(group => group.items.length > 1)
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow only where operations', () => {
      const validQuery = query<User>(
        where("name", "John"),
        where("surname", "Doe")
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow only groupBy operations', () => {
      const validQuery = query<User>(
        groupBy("city"),
        groupBy("age")
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow only having operations', () => {
      const validQuery = query<User>(
        having(group => group.items.length > 1)
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow only sort operations', () => {
      const validQuery = query<User>(
        sort("age"),
        sort("name")
      );
      expectTypeOf(validQuery).toBeFunction();
    });

    it('should allow empty query', () => {
      const validQuery = query<User>();
      expectTypeOf(validQuery).toBeFunction();
    });
  });

  describe('where', () => {
    it('should filter by exact match', () => {
      const filterByName = where<User>("name", "John");
      const result = filterByName(users);

      expect(result).toHaveLength(3);
      expect(result.every(u => u.name === "John")).toBe(true);
    });

    it('should return empty array if no matches', () => {
      const filterByCity = where<User>("city", "Moscow");
      const result = filterByCity(users);

      expect(result).toHaveLength(0);
    });
  });

  describe('sort', () => {
    it('should sort by age ascending', () => {
      const sortByAge = sort<User>("age");
      const result = sortByAge(users);

      expect(result[0].age).toBe(33);
      expect(result[1].age).toBe(34);
      expect(result[2].age).toBe(35);
      expect(result[3].age).toBe(35);
    });

    it('should sort by name', () => {
      const sortByName = sort<User>("name");
      const result = sortByName(users);

      expect(result[0].name).toBe("John");
      expect(result[3].name).toBe("Mike");
    });

    it('should not mutate original array', () => {
      const sortByAge = sort<User>("age");
      const original = [...users];
      sortByAge(users);

      expect(users).toEqual(original);
    });
  });

  describe('groupBy', () => {
    it('should group by city', () => {
      const groupByCity = groupBy<User>("city");
      const result = groupByCity(users);

      expect(result).toHaveLength(2);

      const nyGroup = result.find(g => g.key === "NY");
      expect(nyGroup?.items).toHaveLength(2);
      expect(nyGroup?.items.every(u => u.city === "NY")).toBe(true);

      const laGroup = result.find(g => g.key === "LA");
      expect(laGroup?.items).toHaveLength(2);
      expect(laGroup?.items.every(u => u.city === "LA")).toBe(true);
    });

    it('should group by age', () => {
      const groupByAge = groupBy<User>("age");
      const result = groupByAge(users);

      expect(result).toHaveLength(3);

      const age35Group = result.find(g => g.key === 35);
      expect(age35Group?.items).toHaveLength(2);
    });
  });

  describe('having', () => {
    it('should filter groups with more than 1 item', () => {
      const groupByCity = groupBy<User>("city");
      const groups = groupByCity(users);

      const filterGroups = having<User>((group) => group.items.length > 1);
      const result = filterGroups(groups);

      expect(result).toHaveLength(2);
    });

    it('should filter groups with age > 34', () => {
      const groupByCity = groupBy<User>("city");
      const groups = groupByCity(users);

      const filterGroups = having<User>((group) =>
        group.items.some(u => u.age > 34)
      );
      const result = filterGroups(groups);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("LA");
    });
  });

  describe('query', () => {
    it('should chain where and sort', () => {
      const pipeline = query<User>(
        where("name", "John"),
        where("surname", "Doe"),
        sort("age")
      );

      const result = pipeline(users);

      expect(result).toHaveLength(3);
      expect(result[0].age).toBe(33);
      expect(result[1].age).toBe(34);
      expect(result[2].age).toBe(35);
      expect(result.every(u => u.name === "John" && u.surname === "Doe")).toBe(true);
    });

    it('should chain groupBy and having', () => {
      const pipeline = query<User>(
        groupBy("city"),
        having<User>((group) => group.items.length > 1)
      );

      const result = pipeline(users);

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe("NY");
      expect(result[0].items).toHaveLength(2);
      expect(result[1].key).toBe("LA");
      expect(result[1].items).toHaveLength(2);
    });

    it('should combine all operations in correct order', () => {
      const pipeline = query<User>(
        where("surname", "Doe"),
        groupBy("city"),
        having<User>((group) => group.items.some(u => u.age > 34))
      );

      const result = pipeline(users);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("LA");
      expect(result[0].items).toHaveLength(2);
      expect(result[0].items.every(u => u.surname === "Doe")).toBe(true);
    });

    it('should handle empty pipeline', () => {
      const pipeline = query<User>();
      const result = pipeline(users);

      expect(result).toEqual(users);
    });

    it('should work with different data types', () => {
      type Product = { id: number; name: string; price: number };
      const products: Product[] = [
        { id: 1, name: "A", price: 100 },
        { id: 2, name: "B", price: 200 },
        { id: 3, name: "A", price: 150 },
      ];

      const pipeline = query<Product>(
        where("name", "A"),
        sort("price")
      );

      const result = pipeline(products);

      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(100);
      expect(result[1].price).toBe(150);
    });
  });
});