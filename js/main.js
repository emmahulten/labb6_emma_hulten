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

    // Hämta värde från formuläret
    const input = inputEl.value.trim();
    
    // Validera inmatningen
    if (!validateForm(input)) {
        return;
    }

    // Rensa tidigare recept vid giltig sökning, även utan träffar
    resultEl.innerHTML = "";

    // Spara returvärdet för nästa funktionsanrop
    const data = await getProduct(input);

    // Avbryt om API-anropet inte gav användbar data
    if (data === null) {
        return;
    }

    // Skicka receptdatan till funktionen som visar resultat
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

       const data = await response.json();

        if (data.recipes.length === 0) {
            dataErrorEl.innerHTML = "Inget recept hittades, prova en ny sökfras";
            return null; 
        }
        // Returnera receptdatan till onSubmit()
        return data;

    } catch (error) {
        console.log(error);
        dataErrorEl.innerHTML = "Kunde inte hämta recept. Försök igen";
        return null;
    }
}

// Visa sökresultatet
function showResult(data) {

    // Välj det första receptet från sökresultatet
    const recipe = data.recipes[0];

    let ingredientsHTML = "";
    let instructionsHTML = "";

    // Skapa HTML-lista med ingredienser
    for (let i = 0; i < recipe.ingredients.length; i++) {
        ingredientsHTML += `<li>${recipe.ingredients[i]}</li>`;
    }

    // Skapa HTML-lista med instruktioner
    for (let i = 0; i < recipe.instructions.length; i++) {
        instructionsHTML += `<li>${recipe.instructions[i]}</li>`;
    }

    // Skriv ut receptet med tillhörande listor
    resultEl.innerHTML = `
        <article>
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="Bild på maträtten.">
            <div class="recipe-info">
                <p><strong>Servings: </strong>${recipe.servings}</p>
                <p><strong>Prep time: </strong>${recipe.prepTimeMinutes}</p>
                <p><strong>Cooking time: </strong>${recipe.cookTimeMinutes}</p>
                <p><strong>Difficulty: </strong>${recipe.difficulty}</p>
            </div>
            <h4>Ingredients</h4>
            <ul>
                ${ingredientsHTML}
            </ul>
            <h4>Instructions</h4>
            <ol>
                ${instructionsHTML}
            </ol>
        </article>`;
}