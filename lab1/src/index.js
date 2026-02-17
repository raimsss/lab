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
