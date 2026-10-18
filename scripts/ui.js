import { computeStats } from "./stats.js";

const makeButtons = (record) => {
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.setAttribute("aria-label", `Edit ${record.description}`);
    editBtn.dataset.id = record.id;
    editBtn.dataset.action = "edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete ${record.description}`);
    deleteBtn.dataset.id = record.id;
    deleteBtn.dataset.action = "delete"; 

    const fragment = document.createDocumentFragment();
    fragment.append(editBtn, deleteBtn);
    return fragment;

}; 
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
        const cardButtons = makeButtons(record);
        card.append(heading, amount, category, date, cardButtons)

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
            } else if (index === 5) {
                cell.append(makeButtons(record));
            } else {
                cell.textContent = value;
            }
            row.append(cell);

        });

        recordsBody.append(row);
    });
};

export const renderDashboard = (records, cap) => {
    const dashEmpty = document.getElementById("dash-empty");

    if (records.length === 0) {
        dashEmpty.hidden = false;
        document.getElementById("dash-total").textContent = "_";
        document.getElementById("dash-food").textContent = "_";
        document.getElementById("dash-transport").textContent = "_";
        document.getElementById("dash-entertainment").textContent = "_";
        document.getElementById("dash-others").textContent = "_";
        document.getElementById("dash-cap-status").textContent = "";
        return;
    }

    dashEmpty.hidden = true;
    const { total, byCategory } = computeStats(records);
    const fmt = (n) => `${Math.round(n).toLocaleString()} RWF`;

    document.getElementById("dash-total").textContent = fmt(total);
    document.getElementById("dash-food").textContent = fmt(byCategory.food)
    document.getElementById("dash-transport").textContent = fmt(byCategory.transport);
    document.getElementById("dash-entertainment").textContent = fmt(byCategory.entertainment);
    document.getElementById("dash-others").textContent = fmt(byCategory.others);

    const capStatus = document.getElementById("dash-cap-status");
    if (cap === null) {
        capStatus.textContent = "";
    } else if (total > cap) {
        capStatus.textContent = `Over cap by ${fmt(total - cap)}`;
    } else{
        capStatus.textContent = `Under cap - ${fmt(cap - total)} remaining`;
    }
};