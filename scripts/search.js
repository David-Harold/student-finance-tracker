export const compileSearch = (text, caseSensitive) => {
    if (text === "") return null; 
    try {
        return new RegExp(text, caseSensitive ? "" : "i");
    } catch {
        return null;
    }
};