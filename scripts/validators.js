export const validateDescription = (description) => {
    const regex = /^\S(.*\S)?$/;
    return regex.test(description);
};

export const validateAmount = (amount) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return regex.test(amount);
};