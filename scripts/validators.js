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