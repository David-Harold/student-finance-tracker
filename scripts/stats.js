const RATES = { rwf: 1, usd: 1300, gbp: 1650};

const toRwf = (amount, currency) => amount * (RATES[currency] ?? 1);

export const computeStats = (records) => {
    const byCategory = { food: 0, transport: 0, entertainment: 0, others: 0};

    records.forEach((r) => {
        const key = r.category in byCategory ? r.category : "others";
        byCategory[key] += toRwf(r.amount, r.currency);
    
    });

    const total = Object.values(byCategory).reduce((sum, v) => sum + v, 0);

    return{ total, byCategory };

};