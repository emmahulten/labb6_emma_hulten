"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Emma Hultén
 */

// --- 1. DOM-referenser ---
const formEl = document.querySelector("#searchform");
const inputEl = document.querySelector("#search");
const resultEl = document.querySelector("#recipe");

const formErrorEl = document.querySelector("#error");
const dataErrorEl = document.querySelector("#message");

// --- 2. Eventlyssnare ---
formEl.addEventListener("submit", onSubmit);


// --- 3. Funktioner ---


// Hantera formulärets submit-event och dirigerar övriga funktioner
async function onSubmit(event) {
    event.preventDefault();

    const input = inputEl.value.trim();
    
    if (!validateForm(input)) {
        return;
    }

    console.log(input);
    // Rensa sökfältet
    inputEl.value = "";
}

// Validera formulärets inmatning
function validateForm(input) {
    formErrorEl.innerHTML = "";

    if (input === "") {
        formErrorEl.innerHTML = "Du behöver ange en sökfras...";
        return false;
    }
    return true;
}

// Hämta data från API
async function getProduct(input) {

}

// Visa sökresultatet
function showResult(data) {

}