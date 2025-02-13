// Selecting necessary elements
document.getElementById("start-button").addEventListener("click", startGame);

const gameScreen = document.getElementById("game-screen");
const gameText = document.getElementById("game-text");
const choicesContainer = document.getElementById("choices");
const puzzleContainer = document.getElementById("puzzle-container");
const puzzleText = document.getElementById("puzzle-text");
const puzzleInput = document.getElementById("puzzle-input");
const puzzleSubmit = document.getElementById("puzzle-submit");
const backButton = document.getElementById("back-button");
const imageChoices = document.getElementById("image-choices"); // Ensure image-choices exists

let inventory = {
    sigilMemory: false,
    sigilPerception: false,
    sigilResolve: false,
    sigilFear: false,
    sigilTruth: false
};

let currentZone = "start";

// Function to update the background
function updateBackground(image) {
    document.body.style.backgroundImage = `url('assets/${image}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

// Function to show collected sigils visually
function showSigil(sigilId) {
    let sigilElement = document.getElementById(sigilId);
    if (sigilElement) {
        sigilElement.classList.remove("hidden");
        sigilElement.classList.add("visible");
    }
}

function updateInventory() {
    console.log("Updating inventory...", inventory); // Debugging log

    if (inventory.sigilMemory) {
        console.log("Memory Sigil Collected");
        document.getElementById("sigil-memory").classList.remove("hidden");
    }
    if (inventory.sigilPerception) {
        console.log("Perception Sigil Collected");
        document.getElementById("sigil-perception").classList.remove("hidden");
    }
    if (inventory.sigilResolve) {
        console.log("Resolve Sigil Collected");
        document.getElementById("sigil-resolve").classList.remove("hidden");
    }
    if (inventory.sigilFear) {
        console.log("Fear Sigil Collected");
        document.getElementById("sigil-fear").classList.remove("hidden");
    }
    if (inventory.sigilTruth) {
        console.log("Truth Sigil Collected");
        document.getElementById("sigil-truth").classList.remove("hidden");
    }
}

function showClue(realClue, fakeClue) {
    let clueContainer = document.getElementById("clue-container");

    // If clueContainer doesn't exist, create it
    if (!clueContainer) {
        clueContainer = document.createElement("p");
        clueContainer.id = "clue-container";
        clueContainer.classList.add("clue-box"); // Add CSS styling
        puzzleContainer.appendChild(clueContainer);
        clueContainer.dataset.shown = "fake"; // Default to fake clue
    }

    // Toggle clue between fake and real
    if (clueContainer.dataset.shown === "fake") {
        clueContainer.innerText = "🔎 Clue: " + realClue; // Show real clue
        clueContainer.dataset.shown = "real";
    } else {
        clueContainer.innerText = "🔎 Clue: " + fakeClue; // Show fake clue first
        clueContainer.dataset.shown = "fake";
    }

    // Ensure clueContainer is visible
    clueContainer.style.display = "block";
}


// Start Game
function startGame() {
    document.body.classList.add("game-screen-active"); // Change background when game starts
    console.log("Start button clicked!");

    let startButton = document.getElementById("start-button");
    let introText = document.getElementById("intro-text");
    let title = document.getElementById("title");

    if (!startButton || !introText || !title) {
        console.error("One or more elements are missing!");
        return;
    }

    startButton.style.display = "none";
    introText.style.display = "none";
    title.style.display = "none";
    

    gameScreen.classList.remove("hidden");
    showText("You find yourself in a foggy corridor...");
    showChoices([{ text: "Step into the unknown.", action: introMemory }]);
}

function collectSigil(sigilId, sigilImageSrc) {
    let sigilDisplay = document.getElementById("sigil-display");
    let sigilContainer = document.getElementById(sigilId);

    // Show Sigil in the center of the screen
    sigilDisplay.src = sigilImageSrc;
    sigilDisplay.style.display = "block";

    // After 5 seconds, hide it and move it to inventory
    setTimeout(() => {
        sigilDisplay.style.display = "none"; // Hide collected sigil display
        sigilContainer.classList.remove("hidden"); // Show in inventory
    }, 3000);
}

// 🏰 Zone 1: Halls of Echoes (Sigil of Memory)
function introMemory() {
    updateBackground("Zone1.jpg");
    showText("You step into a dimly lit hall. The walls whisper with forgotten voices, and shadows move where they shouldn’t...");
    showChoices([{ text: "Are you ready to solve?", action: zoneMemory }]);
}

function zoneMemory() {
    currentZone = "memory";
    showText("A masked figure emerges and says: 'Memories fade. Can you recall the truth?'");

    startPuzzle(
        "Rearrange the words: 'DREAM, WHAT, IS, NEVER, SEEMS, IT'", 
        "DREAM IS NEVER WHAT IT SEEMS",
        collectMemorySigil,
        "The words are a common saying about illusions.", // ✅ True Clue
        "The first and last words should remain unchanged." // ❌ False Clue
    );
}


function collectMemorySigil() {
    inventory.sigilMemory = true;
    collectSigil("sigil-memory", "assets/sigil-memory.png");  // Adjust path
    updateInventory();
    showText("The whispers fade. The Sigil of Memory appears.");
    showChoices([{ text: "Move deeper into the maze.", action: introPerception }]);
}

// 🌀 Zone 2: Labyrinth of Illusions (Sigil of Perception) - **Updated Puzzle**
function introPerception() {
    updateBackground("Zone2.jpg");
    showText("You enter a vast hall of illusions, where symbols shift before your eyes...");
    showChoices([{ text: "Are you ready to solve?", action: zonePerception }]);
}

function zonePerception() {
    currentZone = "perception";
    showText("A shadow whispers: ‘One of these symbols holds the truth. Choose wisely.’");
    startPuzzle(
        "Which symbol represents hidden knowledge?", 
        "MOON",
        collectPerceptionSigil,
        "It is a celestial object that guides the night.", // ✅ True Clue
        "It is the brightest object in the sky." // ❌ False Clue
    );
    showChoices([
        { text: "☀ Sun", action: wrongSymbol },
        { text: "☽ Moon", action: collectPerceptionSigil },
        { text: "✦ Star", action: wrongSymbol },
        { text: "♠ Spade", action: wrongSymbol }
    ]);
}

function collectPerceptionSigil() {
    inventory.sigilPerception = true;
    collectSigil("sigil-perception", "assets/sigil-perception.png");  
    updateInventory();
    showText("The symbol glows and reveals the Sigil of Perception.");
    showChoices([{ text: "Proceed to the next area.", action: introResolve }]);
}

function wrongSymbol() {
    showText("The symbol shatters into pieces. That was an illusion.");
    showChoices([{ text: "Try again.", action: zonePerception }]);
}

// 🔥 Zone 3: Chamber of Choices (Sigil of Resolve)
function introResolve() {
    updateBackground("Zone3.jpg");
    showText("The air grows hotter as you step into a burning labyrinth...");
    showChoices([{ text: "Are you ready to solve?", action: zoneResolve }]);
}

function zoneResolve() {
    currentZone = "resolve";
    showText("You must cross in the correct order before the flames rise!");
    startPuzzle(
        "Which path is the safest?",
        "C B A D",
        collectResolveSigil,
        "The safest path follows a decreasing order.", // ✅ True Clue
        "The path starts with the largest letter." // ❌ False Clue
    );
    showChoices([
        { text: "A → B → C → D", action: wrongChoice },
        { text: "C → B → A → D", action: collectResolveSigil },
        { text: "D → A → B → C", action: wrongChoice }
    ]);
}

function collectResolveSigil() {
    inventory.sigilResolve = true;
    collectSigil("sigil-resolve", "assets/sigil-resolve.png");  
    updateInventory();
    showText("You successfully crossed the burning path and found the Sigil of Resolve!");
    showChoices([{ text: "Proceed to the next area.", action: introFear }]);
}

// 🌑 Zone 4: The Abyss of Whispers (Sigil of Fear)
function introFear() {
    updateBackground("Zone4.jpg");
    showText("The light disappears as you step into an endless void...");
    showChoices([{ text: "Are you ready to solve?", action: zoneFear }]);
}

function zoneFear() {
    currentZone = "fear";
    showText("A voice in the shadows whispers: 'What you fear most lies ahead. Face it or remain lost.'");

    
    startPuzzle(
        "What walks on four legs in the morning, two in the afternoon, and three in the evening?",
        "MAN",
        collectFearSigil,
        "The answer represents different stages of life.", // ✅ True Clue
        "The answer is a mythical creature." // ❌ False Clue
    );
}

function collectFearSigil() {
    inventory.sigilFear = true;
    collectSigil("sigil-fear", "assets/sigil-fear.png");  
    updateInventory();
    showText("A shadow recoils. You have conquered your fear and obtained the Sigil of Fear.");
    showChoices([{ text: "Proceed to the next area.", action: introTruth }]);
}

// ⏳ Zone 5: The Timeless Observatory (Sigil of Truth)
function introTruth() {
    updateBackground("Zone5.jpg");
    showText("You step into a vast observatory where time stands still...");
    showChoices([{ text: "Are you ready to solve?", action: zoneTruth }]);
}

function zoneTruth() {
    currentZone = "truth";
    showText("A celestial being asks: 'What is always coming, but never arrives?'");

    startPuzzle(
        "What is always coming, but never arrives?",
        "TOMORROW",
        collectTruthSigil,
        "The answer is about time and expectations.", // ✅ True Clue
        "The answer is something you can touch." // ❌ False Clue
    );
}

function collectTruthSigil() {
    inventory.sigilTruth = true;
    collectSigil("sigil-truth", "assets/sigil-truth.png");  
    updateInventory();
    showText("The stars align. You have obtained the Sigil of Truth.");
    showChoices([{ text: "Approach the final escape portal.", action: finalChallenge }]);
}

// 🎭 Endings & Game Logic
function finalChallenge() {
    updateBackground("FinalPortal.jpg");
    showText("The portal hums with energy. A shadow appears before you.");
    showChoices([
        { text: "Step through and escape.", action: trueAwakening },
        { text: "Doubt your reality.", action: endlessLoop },
        { text: "Refuse to leave.", action: eternalGuardian },
        { text: "Seek the forbidden truth.", action: forbiddenTruth }
    ]);
}

// 🎭 Endings
function trueAwakening() {
    showText("You wake up, heart pounding. The dream is over... or is it?");
}

function endlessLoop() {
    showText("The maze reforms. You are trapped... forever.");
}

function eternalGuardian() {
    showText("You refuse to leave. The shadow bows and whispers, 'Then you shall remain.' The maze reshapes around you. You are now its eternal guardian.");
}

function forbiddenTruth() {
    showText("You step beyond the portal... but something is wrong. The world twists, revealing a terrible truth. You were never asleep. This is your reality now.");
}

// ❌ Wrong Choice Handler
function wrongChoice() {
    showText("The world distorts. You are lost in the dream. Try again.");
    showChoices([{ text: "Restart from this zone.", action: restartCurrentZone }]);
}


function wrongSymbol() {
    showText("The symbol shatters into pieces. That was an illusion.");
    showChoices([{ text: "Try again.", action: zonePerception }]);
}

// 🔄 Restart Zone Function
function restartCurrentZone() {
    if (currentZone === "memory") zoneMemory();
    else if (currentZone === "perception") zonePerception();
    else if (currentZone === "resolve") zoneResolve();
    else if (currentZone === "fear") zoneFear();
    else if (currentZone === "truth") zoneTruth();
}


// 🚀 Fixing Element Hiding During Transitions
function showText(text) {
    gameText.innerText = text;
    choicesContainer.innerHTML = "";
    puzzleContainer.classList.add("hidden");
    imageChoices.classList.add("hidden");
}


function showChoices(choices) {
    let choicesContainer = document.getElementById("choices");

    if (!choicesContainer) {
        console.error("Error: 'choices' element not found!");
        return;
    }

    choicesContainer.innerHTML = ""; // Clear previous choices
    choicesContainer.classList.remove("hidden"); // Unhide choices

    choices.forEach(choice => {
        let button = document.createElement("button");
        button.innerText = choice.text;
        button.onclick = choice.action;
        choicesContainer.appendChild(button);
    });
}


// Function to display images as clickable choices
function showImageChoices(options) {
    let container = document.getElementById("image-choices");
    container.innerHTML = ""; // Clear previous content
    container.classList.remove("hidden"); // Make sure it's visible

    options.forEach(option => {
        let imgElement = document.createElement("img");
        imgElement.src = option.img;
        imgElement.alt = option.alt;
        imgElement.classList.add("mirror");
        imgElement.onclick = option.action;

        container.appendChild(imgElement);
    });
}

function startPuzzle(prompt, correctAnswer, successCallback, realClue, fakeClue) {
    showText(prompt);
    puzzleContainer.classList.remove("hidden");

    // 🛑 Remove old clue container if it exists
    let existingClue = document.getElementById("clue-container");
    if (existingClue) {
        existingClue.remove();
    }

    // Ensure there's no duplicate clue button
    let existingClueButton = document.getElementById("clue-button");
    if (!existingClueButton) {
        let clueButton = document.createElement("button");
        clueButton.id = "clue-button";
        clueButton.innerText = "Reveal a Clue";
        puzzleContainer.appendChild(clueButton);
    }

    // ✅ Update clue button function every time
    let clueButton = document.getElementById("clue-button");
    clueButton.onclick = function () {
        showClue(realClue, fakeClue);
    };

    puzzleSubmit.onclick = function () {
        if (puzzleInput.value.trim().toUpperCase() === correctAnswer.toUpperCase()) {
            puzzleContainer.classList.add("hidden");
            puzzleInput.value = "";
            successCallback();
        } else {
            showText("That’s not quite right... Try again.");
        }
    };
}


// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    
    if (startButton) {
        startButton.addEventListener("click", startGame);
    } else {
        console.error("Start button not found!");
    }
});
