const STORAGE_KEY = "student-finance-records";

export const loadRecords = () => {
    try {
        const savedRecords = localStorage.getItem(STORAGE_KEY); 

        if (!savedRecords) {
            return [];
        }

        const records = JSON.parse(savedRecords);
        return Array.isArray(records) ? records : [];
    } catch {
        return[];

    }
};

export const saveRecords = (records) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};