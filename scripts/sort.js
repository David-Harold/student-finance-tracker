export const sortRecords = (records, field, direction) => {
    const sortedRecords = [...records];
    const multiplier = direction === "desc" ? -1 : 1;

    sortedRecords.sort((firstRecord, secondRecord) => {
        let result;

        if (field === "description"){
            result = firstRecord.description.localeCompare(secondRecord.description);    
        } else if (field === "amount") {
            result = firstRecord.amount - secondRecord.amount;
        } else {
            result = firstRecord.date.localeCompare(secondRecord.date);
        }

        return result * multiplier;
    });

    return sortedRecords;
};