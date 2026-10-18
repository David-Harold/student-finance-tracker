const highlightText = (element, text, regex) => {
    element.textContent = "";
    if (!regex) {
        element.textContent = text;
        return;
    }
    const g = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags :regex.flags + "g");
    let last = 0;
    for (const match of text.matchAll(g)) {
        if (match[0] === "") continue;
        element.append(document.createTextNode(text.slice(last, match.index)));
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        element.append(mark);
        last = match.index + match[0].length;
    }
    element.append(document.createTextNode(text.slice(last)));
};
export const renderRecords = (records, regex = null) => {
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
        highlightText(heading, record.description, regex);
        
        const amount = document.createElement("p");
        amount.textContent = `${record.amount} ${record.currency.toUpperCase()}`;

        const category = document.createElement("p");
        highlightText(category, record.category, regex);

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

        values.forEach((value, index) => {
            const cell = document.createElement("td");
            if (index === 0) {
                highlightText(cell, String(value), regex);
            } else if (index === 2) {
                highlightText(cell, String(value), regex);
            } else {
                cell.textContent = value;
            }
            row.append(cell);

        });

        recordsBody.append(row);
    });
};