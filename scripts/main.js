import {validateDescription, validateAmount, validateDate, validateCategory, validateUniqueWords } from "./validators.js";
import { loadRecords, saveRecords } from "./storage.js";
import { renderRecords } from "./ui.js";
import { sortRecords } from "./sort.js";
import { compileSearch } from "./search.js";

const allowedCurrencies = ["rwf", "usd", "gbp"];
const form = document.getElementById("finance-form");
let records = loadRecords();

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

    const record = {
        id: Date.now(),
        description,
        amount: Number(amount),
        category,
        date,
        currency,
        createdAt: new Date().toISOString()
    };

    records.push(record);
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

searchInput.addEventListener("input", renderSortedRecords);
caseSensitiveCheckbox.addEventListener("change", renderSortedRecords);