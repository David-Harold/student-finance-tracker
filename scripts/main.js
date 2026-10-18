import {validateDescription, validateAmount, validateDate, validateCategory, validateUniqueWords, validateRecord } from "./validators.js";
import { loadRecords, saveRecords, loadCap, saveCap } from "./storage.js";
import { renderRecords, renderDashboard } from "./ui.js";
import { sortRecords } from "./sort.js";
import { compileSearch } from "./search.js";
import { exportRecords } from "./transfer.js";

const allowedCurrencies = ["rwf", "usd", "gbp"];
const form = document.getElementById("finance-form");
let records = loadRecords();
let editingId = null;
let cap = loadCap();

const sortFieldSelect = document.getElementById("sort-field");
const sortDirectionSelect = document.getElementById("sort-direction");

let currentSortField = sortFieldSelect.value;
let currentSortDirection = sortDirectionSelect.value;

const searchInput = document.getElementById("search-records");
const caseSensitiveCheckbox = document.getElementById("case-sensitive");
const searchMessage = document.getElementById("search-message");

const renderSortedRecords = () => {
    const text = searchInput.value;
    const regex = compileSearch(text, caseSensitiveCheckbox.checked);

    const filtered = regex !== null
        ? records.filter(r => regex.test(r.description) || regex.test(r.category))
        : records;


    const sorted = sortRecords(filtered, currentSortField, currentSortDirection);
    renderRecords(sorted, regex);
    renderDashboard(records, cap);

    if (text === "") {
        searchMessage.textContent = "";
    } else if (regex === null) {
        searchMessage.textContent = "Invalid pattern";
    } else {
        searchMessage.textContent = `${sorted.length} record${sorted.length === 1 ? "" : "s"} found`;
    }
 
};

renderSortedRecords();

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    
    let isFormValid = true;
    let firstInvalidInput = null;

    const descriptionInput = document.getElementById("description");
    const description = descriptionInput.value;
    const descriptionError = document.getElementById("description-error");

    if (!validateDescription(description)) {
        descriptionError.textContent = "Start and end with a non-space character.";
        descriptionInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= descriptionInput;

    } else if (!validateUniqueWords(description)) {
        descriptionError.textContent = "Do not repeat words.";
        descriptionInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= descriptionInput;
    } else {
        descriptionError.textContent = "";
        descriptionInput.setAttribute("aria-invalid", "false");
    }

    const amountInput =document.getElementById("amount");
    const amount = amountInput.value;
    const amountError = document.getElementById("amount-error");

    if (!validateAmount(amount)) {
        amountError.textContent = "Enter a valid amount.";
        amountInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= amountInput;
    } else if (Number(amount) <= 0) {
        amountError.textContent = "Amount must be greater than zero.";
        amountInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??=amountInput;
    } else {
        amountError.textContent = "";
        amountInput.setAttribute("aria-invalid", "false"); 
    }

    const dateInput = document.getElementById("date");
    const date = dateInput.value;
    const dateError = document.getElementById("date-error");

    if (!validateDate(date)) {
        dateError.textContent = "Choose a valid date.";
        dateInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= dateInput;
    } else {
        dateError.textContent = "";
        dateInput.setAttribute("aria-invalid", "false");
        
    }

    const categoryInput = document.getElementById("category");
    const category = categoryInput.value;
    const categoryError = document.getElementById("category-error");

    if (!validateCategory(category)) {
        categoryError.textContent = "Choose a category.";
        categoryInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= categoryInput;
    } else {
        categoryError.textContent = "";
        categoryInput.setAttribute("aria-invalid", "false");
    }

    const currencyInput = document.getElementById("currency");
    const currency = currencyInput.value;
    const currencyError = document.getElementById("currency-error");

    if (!allowedCurrencies.includes(currency)) {
        currencyError.textContent = "Choose a currency.";
        currencyInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
        firstInvalidInput ??= currencyInput;
    } else {
        currencyError.textContent = "";
        currencyInput.setAttribute("aria-invalid", "false");
    }

    const formMessage = document.getElementById("form-message");

    if (!isFormValid){
        formMessage.textContent = "Please correct the errors before saving.";
        firstInvalidInput.focus();
        return;
    }

    if (editingId !== null) {
        const index = records.findIndex(r => r.id === editingId);
        records[index] = {
            ...records[index],
            description,
            amount: Number(amount),
            category,
            date,
            currency,
            updatedAt: new Date().toISOString(),
        };
        editingId = null;
        submitButton.textContent = "Save Record";
    } else {
        const record = {
            id: Date.now(),
            description,
            amount: Number(amount),
            category,
            date,
            currency,
            createdAt: new Date().toISOString(),
        };
        records.push(record);
    }

   
    saveRecords(records);
    renderSortedRecords();
    formMessage.textContent = "Record saved.";
    form.reset();

});

sortFieldSelect.addEventListener("change", () => {
    currentSortField = sortFieldSelect.value;
    renderSortedRecords();
});

sortDirectionSelect.addEventListener("change", () => {
    currentSortDirection = sortDirectionSelect.value;
    renderSortedRecords();
});

const submitButton = form.querySelector("button[type='submit']");

document.getElementById("records-body").addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    handleAction(btn.dataset.action, Number(btn.dataset.id));
});

document.getElementById("records-cards").addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    handleAction(btn.dataset.action, Number(btn.dataset.id));
});

const handleAction = (action, id) => {
    if (action === "delete") {
        if (!confirm("Delete this record?")) return;
        records = records.filter(r => r.id !== id);
        saveRecords(records);
        renderSortedRecords();
        return;
    }

    if (action === "edit") {
        const record = records.find(r => r.id === id);
        if (!record) return;

        document.getElementById("description").value = record.description;
        document.getElementById("amount").value = record.amount;
        document.getElementById("category").value = record.category;
        document.getElementById("date").value = record.date;
        document.getElementById("currency").value = record.currency;

        editingId = record.id;
        submitButton.textContent = "Update record";
        document.getElementById("description").focus();
        }
};
searchInput.addEventListener("input", renderSortedRecords);
caseSensitiveCheckbox.addEventListener("change", renderSortedRecords);

document.getElementById("save-cap").addEventListener("click", () => {
    const input = document.getElementById("spending-cap");
    const value = Number(input.value);
    const capMessage = document.getElementById("cap-message");

    if (!input.value || value < 0) {
        capMessage.textContent = "Enter a valid amount";
        return;
    }

    cap = value;
    saveCap(cap);
    renderDashboard(records, cap);
    capMessage.textContent = "Cap saved.";
});

document.getElementById("export-json").addEventListener("click", () =>{
    exportRecords(records);
});

document.getElementById("import-json").addEventListener("change", async (event) =>{
    const file = event.target.files[0];
    const transferMessage = document.getElementById("transfer-message");

    if (!file) return;

    let parsed;
    try {
        const text = await file.text();
        parsed = JSON.parse(text);
    } catch {
        transferMessage.textContent = "Invalid file: could not parse JSON.";
        event.target.value = "";
        return;
    }

    if(!Array.isArray(parsed)) {
        transferMessage.textContent = "Invalid file: expected an array of records. ";
        event.target.value = "";
        return;
    }

    for (let i=0; i <parsed.length; i++) {
        const error = validateRecord(parsed[i]);
        if (error !== null) {
            transferMessage.textContent = `Invalid file: record ${i + 1}, ${error}.`;
            event.target.value = "";
            return;
        }
    }

    if (!confirm(`Replace all current records with ${parsed.length} iported records?`)) {
        event.target.value = "";
        return;
    }

    records = parsed.map((r) => ({
        id: r.id,
        description: r.description,
        amount: r.amount,
        category: r.category,
        date: r.date,
        currency: r.currency,
        createdAt: r.createdAt,
        ...allowedCurrencies(r.updatedAt !== undefined ? { updatedAt: r.updateAt } : {}),

    }));

    saveRecords(records);
    renderSortedRecords();
    transferMessage.textContent =  `Imported ${records.length} record${records.length == 1 ? "" : "s"}.`;
    event.target.value = "";
});