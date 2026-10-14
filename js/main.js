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
    
    const data = await getProduct(input);

    // Avbryt om API-anropet inte gav användbar data
    if (data === null) {
        return;
    }

    showResult(data);
    
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

// Hämta recept från API:et och hantera eventuella fel
async function getProduct(input) {
    dataErrorEl.innerHTML = "";

    try {
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${input}`);
        
        if (!response.ok) {
        throw new Error("Kunde inte hämta data från API:et");
       } 
       
       // Hämta JSON
       const data = await response.json();

       if (!data) {
        dataErrorEl.innerHTML = "Kunde inte hämta recept. Försök igen";
        return null;
       }
       if (data.recipes.length === 0) {
        dataErrorEl.innerHTML = "Inget recept hittaes, prova en ny sökfras";
        return null; 
       }

       return data;

    } catch (error) {
        console.log(error);
        dataErrorEl.innerHTML = "Kunde inte hämta recept. Försök igen";
        return null;
        

    }
}

// Visa sökresultatet
function showResult(data) {
    // Tillf. test
    console.log(data);

}