// 1. User
export function createUser(id, name, email, isActive = true) {
    return {
        id,
        name,
        email,
        isActive
    };
}
export function createBook(book) {
    return book;
}
export function calculateArea(shape, value) {
    if (shape === 'circle') {
        return Math.PI * value * value;
    }
    else {
        return value * value;
    }
}
export function getStatusColor(status) {
    switch (status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'gray';
        case 'new':
            return 'blue';
    }
}
export const capitalizeFirst = (str, uppercase = false) => {
    if (!str)
        return str;
    const result = str[0].toUpperCase() + str.slice(1);
    return uppercase ? result.toUpperCase() : result;
};
export const trimAndFormat = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};
// 6. getFirstElement
export function getFirstElement(arr) {
    return arr.length > 0 ? arr[0] : undefined;
}
export function findById(items, id) {
    return items.find(item => item.id === id);
}
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('\n=== ДЕМОНСТРАЦИЯ РАБОТЫ ФУНКЦИЙ ===\n');
    // 1. Демонстрация User
    console.log('1. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ:');
    const user1 = createUser(1, 'Иван');
    const user2 = createUser(2, 'Мария', 'maria@example.com', false);
    console.log('  user1 (isActive по умолчанию):', user1);
    console.log('  user2 (isActive = false):', user2);
    console.log();
    // 2. Демонстрация Book
    console.log('2. СОЗДАНИЕ КНИГИ:');
    const book1 = createBook({
        title: 'Война и мир',
        author: 'Лев Толстой',
        genre: 'fiction'
    });
    const book2 = createBook({
        title: 'История России',
        author: 'Историк',
        year: 2023,
        genre: 'non-fiction'
    });
    console.log('  book1 (без года):', book1);
    console.log('  book2 (с годом):', book2);
    console.log();
    // 3. Демонстрация calculateArea
    console.log('3. ВЫЧИСЛЕНИЕ ПЛОЩАДИ:');
    const circleArea = calculateArea('circle', 5);
    const squareArea = calculateArea('square', 4);
    console.log(`  Площадь круга (радиус 5): ${circleArea.toFixed(2)}`);
    console.log(`  Площадь квадрата (сторона 4): ${squareArea}`);
    console.log();
    // 4. Демонстрация getStatusColor
    console.log('4. ЦВЕТА СТАТУСОВ:');
    console.log(`  active -> ${getStatusColor('active')}`);
    console.log(`  inactive -> ${getStatusColor('inactive')}`);
    console.log(`  new -> ${getStatusColor('new')}`);
    console.log();
    // 5. Демонстрация StringFormatter
    console.log('5. ФОРМАТИРОВАНИЕ СТРОК:');
    const testStr = '  привет мир  ';
    console.log(`  Исходная строка: "${testStr}"`);
    console.log(`  capitalizeFirst: "${capitalizeFirst('hello')}"`);
    console.log(`  trimAndFormat: "${trimAndFormat(testStr, false)}"`);
    console.log(`  trimAndFormat + uppercase: "${trimAndFormat(testStr, true)}"`);
    console.log();
    // 6. Демонстрация getFirstElement
    console.log('6. ПЕРВЫЙ ЭЛЕМЕНТ МАССИВА:');
    const numbers = [10, 20, 30, 40, 50];
    const emptyArray = [];
    console.log(`  Массив [10, 20, 30, 40, 50] -> первый элемент: ${getFirstElement(numbers)}`);
    console.log(`  Пустой массив -> первый элемент: ${getFirstElement(emptyArray)}`);
    console.log();
    // 7. Демонстрация findById
    console.log('7. ПОИСК ПО ID:');
    const items = [
        { id: 1, name: 'Товар 1', price: 100 },
        { id: 2, name: 'Товар 2', price: 200 },
        { id: 3, name: 'Товар 3', price: 300 }
    ];
    const foundItem = findById(items, 2);
    const notFoundItem = findById(items, 5);
    console.log('  Товары:', items);
    console.log('  Поиск id=2:', foundItem);
    console.log('  Поиск id=5:', notFoundItem);
    console.log();
    // 8. Дополнительные примеры
    console.log('8. ДОПОЛНИТЕЛЬНЫЕ ПРИМЕРЫ:');
    // Несколько пользователей
    const users = [
        createUser(1, 'Анна', 'anna@mail.com'),
        createUser(2, 'Петр', 'petr@mail.com', false),
        createUser(3, 'Елена')
    ];
    console.log('  Все пользователи:', users);
    // Активные пользователи
    const activeUsers = users.filter(user => user.isActive);
    console.log('  Активные пользователи:', activeUsers);
    // Книги по жанрам
    const fictionBook = createBook({
        title: 'Преступление и наказание',
        author: 'Достоевский',
        genre: 'fiction',
        year: 1866
    });
    console.log('  Книга в жанре fiction:', fictionBook);
    console.log('\n=== КОНЕЦ ДЕМОНСТРАЦИИ ===\n');
}
