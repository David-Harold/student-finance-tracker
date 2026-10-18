export const validateDescription = (description) => {
    const regex = /^\S(.*\S)?$/;
    return regex.test(description);
};

export const validateAmount = (amount) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return regex.test(amount);
};

export const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

export const validateCategory = (category) => {
    const regex = /^[a-zA-Z]([a-zA-Z -]*[a-zA-Z])?$/;
    return regex.test(category);
};

export const validateUniqueWords = (input) => {
    const regex = /\b(\w+)\s+\1\b/i;
    return !regex.test(input);
};

const ALLOWED_CURRENCIES = ["rwf", "usd", "gbp"];

export const validateRecord = (obj) => {
    if(typeof obj !== "object" || obj === null) return "not an object";
    if(typeof obj.id !== "number" ) return "id must be a number";
    if(typeof obj.description !== "string" || !validateDescription(obj.description)) return "invalid description";
    if(!validateUniqueWords(obj.description)) return "description has repeated adjacent words";
    if(typeof obj.amount !== "number" || obj.amount <= 0 || !validateAmount(String(obj.amount))) return "invalid amount";
    if(!validateDate(obj.date)) return "invalid date";
    if(!validateCategory(obj.date)) return "invalid category";
    if(!ALLOWED_CURRENCIES.includes(obj.currency)) return "invalid currency";
    if(typeof obj.createdAt !== "string") return "createdAt must be a string";
    return null;
};