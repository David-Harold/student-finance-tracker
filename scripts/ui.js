export const renderRecords = (records) => {
    const recordsBody = document.getElementById("records-body");
    const recordsEmpty = document.getElementById("records-empty");
    const recordsCards = document.getElementById("records-cards");

    recordsBody.textContent = "";
    recordsCards.textContent = "";

    if (records.length === 0) {
        recordsEmpty.hidden = false;
        return;
    }
    recordsEmpty.hidden = true; 

    records.forEach((record) => {
        const row = document.createElement("tr");
        const card = document.createElement("article");

        const heading = document.createElement("h3");
        heading.textContent = record.description;
        
        const amount = document.createElement("p");
        amount.textContent = `${record.amount} ${record.currency.toUpperCase()}`;

        const category = document.createElement("p");
        category.textContent = record.category;

        const date = document.createElement("p");
        date.textContent = record.date;

        card.append(heading, amount, category, date);
        recordsCards.append(card);

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