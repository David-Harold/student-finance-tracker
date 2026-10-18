export const renderRecords = (records) => {
    const recordsBody = document.getElementById("records-body");
    const recordsEmpty = document.getElementById("records-empty");

    recordsBody.textContent = "";

    if (records.length === 0) {
        recordsEmpty.hidden = false;
        return;
    }

    recordsEmpty.hidden = true; 

    records.forEach((record) => {
        const row = document.createElement("tr");

        const values = [
            record.description,
            record.amount,
            record.category,
            record.date,
            record.currency.toUpperCase(),
            "",
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);

        });

        recordsBody.append(row);
    });
};