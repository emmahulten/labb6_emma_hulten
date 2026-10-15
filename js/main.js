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

// Hanterar formulärets submit-event och dirigerar övriga funktioner
async function onSubmit(event) {
    event.preventDefault();

    // Rensa tidigare felmeddelanden
    dataErrorEl.innerHTML = "";
    formErrorEl.innerHTML = "";

    // Rensa tidigare recept vid varje nytt sökförsök
    resultEl.innerHTML = "";

    // Hämta värde från formuläret
    const input = inputEl.value.trim();

    // Rensa sökfältet
    inputEl.value = "";
    
    // Validera inmatningen
    if (!validateForm(input)) {
        return;
    }

    // Hämta och spara receptdata för visning
    const data = await getProduct(input);

    // Avbryt om inget recept kunde hämtas
    if (!data) {
        return;
    }

    // Skicka receptdatan till funktionen som visar resultat
    showResult(data);
}

// Validera formulärets inmatning
function validateForm(input) {
    
    if (input === "") {
        formErrorEl.innerHTML = "Du behöver ange en sökfras...";
        return false;
    }
    return true;
}

// Hämta recept från API:et och hantera eventuella fel
async function getProduct(input) {
    try {
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${input}`);
        
        if (!response.ok) {
            throw new Error("Kunde inte hämta data från API:et");
        }
        
        const data = await response.json();

        if (data.recipes.length === 0) {
            dataErrorEl.innerHTML = "Inget recept hittades, prova en ny sökfras";
            return;
        }
        // Returnera receptdatan till onSubmit()
        return data;

    } catch (error) {
        console.log(error);
        dataErrorEl.innerHTML = "Kunde inte hämta recept. Försök igen";
        return;
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
                <p><strong>Prep time: </strong>${recipe.prepTimeMinutes} minutes</p>
                <p><strong>Cooking time: </strong>${recipe.cookTimeMinutes} minutes</p>
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