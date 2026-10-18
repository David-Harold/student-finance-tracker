import {validateDescription, validateAmount,  validateDate, validateCategory, validateUniqueWords } from "./validators.js";

const allowedCurrencies = ["rwf", "usd", "gbp"];
const form = document.getElementById("finance-form");

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    
    let isFormValid = true;

    const descriptionInput = document.getElementById("description");
    const description = descriptionInput.value;
    const descriptionError = document.getElementById("description-error");

    if (!validateDescription(description)) {
        descriptionError.textContent = "Start and end with a non-space character.";
        descriptionInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
    } else if (!validateUniqueWords(description)) {
        descriptionError.textContent = "Do not repeat words.";
        descriptionInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
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
    } else if (Number(amount) <= 0) {
        amountError.textContent = "Amount must be greater than zero.";
        amountInput.setAttribute("aria-invalid", "true");
        isFormValid = false;
    }else{
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
    } else {
        currencyError.textContent = "";
        currencyInput.setAttribute("aria-invalid", "false");
    }

});