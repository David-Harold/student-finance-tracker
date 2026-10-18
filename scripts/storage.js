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

const CAP_KEY = "student-finance-cap";

export const loadCap = () => {
    const saved = localStorage.getItem(CAP_KEY);
    return saved !== null ? Number(saved) : null;
};

export const savecap = (cap) => {
    localStorage.setItem(CAP_KEY, String(cap));
};