import { describe, it, expect } from 'vitest';
import { createUser, createBook, calculateArea, getStatusColor, capitalizeFirst, trimAndFormat, getFirstElement, findById } from './index';
// Задание 1: User
describe('User', () => {
    it('creates user with default isActive', () => {
        expect(createUser(1, 'John').isActive).toBe(true);
    });
});
// Задание 2: Book
describe('Book', () => {
    it('creates book without year', () => {
        expect(createBook({ title: 'Test', author: 'Author', genre: 'fiction' }).year).toBeUndefined();
    });
});
// Задание 3: calculateArea
describe('calculateArea', () => {
    it('calculates circle and square areas', () => {
        expect(calculateArea('circle', 2)).toBeCloseTo(12.566, 2);
        expect(calculateArea('square', 4)).toBe(16);
    });
});
// Задание 4: Status
describe('Status', () => {
    it('returns correct colors', () => {
        expect(getStatusColor('active')).toBe('green');
        expect(getStatusColor('inactive')).toBe('gray');
        expect(getStatusColor('new')).toBe('blue');
    });
});
// Задание 5: StringFormatter
describe('StringFormatter', () => {
    it('formats strings correctly', () => {
        expect(capitalizeFirst('hello')).toBe('Hello');
        expect(trimAndFormat('  hello  ', true)).toBe('HELLO');
    });
});
// Задание 6: getFirstElement
describe('getFirstElement', () => {
    it('returns first element or undefined', () => {
        expect(getFirstElement([1, 2, 3])).toBe(1);
        expect(getFirstElement([])).toBeUndefined();
    });
});
// Задание 7: findById
describe('findById', () => {
    it('finds object by id', () => {
        expect(findById([{ id: 1, name: 'A' }], 1)).toEqual({ id: 1, name: 'A' });
    });
});
