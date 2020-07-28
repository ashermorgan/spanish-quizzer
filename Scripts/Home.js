// Declare global variables
let Sets;               // List of parsed sets
let quizzerType = null; // Type of quizzer



// Load the document
function Load() {
    // Load settings
    if (localStorage.getItem("darkMode") == "true") {
        document.body.classList.toggle("dark");
        document.getElementById("settingsDarkMode").checked = true;
    }
    if (localStorage.getItem("PromptType")) {
        document.getElementById("settingsPromptType").value = localStorage.getItem("PromptType");
    }
    if (localStorage.getItem("InputType")) {
        document.getElementById("settingsInputType").value = localStorage.getItem("InputType");
    }
    if (localStorage.getItem("repeatPrompt")) {
        document.getElementById("settingsRepeatPrompts").value = localStorage.getItem("repeatPrompt");
    }

    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            TitleClicked();
        }
    });
    document.getElementById("quizzerInput").addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            // Key was enter
            if (document.getElementById("quizzerInput").readOnly) {
                Continue();
            }
            else {
                Submit();
            }
        }
    });
    document.getElementById("quizzerEnter").addEventListener("click", function (e) {
        if (document.getElementById("quizzerInput").readOnly) {
            Continue();
        }
        else {
            Submit();
        }
    });

    // Load CSVs
    Sets = [];
    let setNames = ["Verbs", "Adjectives", "Adverbs", "Prepositions", "Transitions",
                    "Colors", "Days", "Months", "Questions", "Weather", "Family", "Clothes",
                    "Nature", "House", "Vacation", "Childhood", "Professions", "Health"];
    for (let setName of setNames) {
        Papa.parse(`Vocab/${setName}.csv`, {
            download: true,
            complete: function(results) {
                // Set verbs
                Sets[setName] = results.data;
            }
        });
    }
}



// Shows specific groups of elements
function Show(div) {
    // Hide all elements
    document.getElementById("home").hidden = true;
    document.getElementById("settings").hidden = true;
    document.getElementById("verbSettings").hidden = true;
    document.getElementById("vocabSettings").hidden = true;
    document.getElementById("quizzerSettings").hidden = true;
    document.getElementById("quizzer").hidden = true;

    // Reset settings error message
    document.getElementById("settingsError").textContent = "";

    // Show elements
    switch (div) {
        default:
        case "home":
            document.getElementById("home").hidden = false;
            quizzerType = null;
            break;
        case "vocab":
            document.getElementById("settings").hidden = false;
            document.getElementById("vocabSettings").hidden = false;
            document.getElementById("quizzerSettings").hidden = false;
            quizzerType = "vocab";
            break;
        case "verbs":
            document.getElementById("settings").hidden = false;
            document.getElementById("verbSettings").hidden = false;
            document.getElementById("quizzerSettings").hidden = false;
            quizzerType = "verbs";
            break;
        case "quizzer":
            document.getElementById("quizzer").hidden = false;
            break;
    }
}



// Controls navigation when user clicks on title
function TitleClicked() {
    if (!document.getElementById("quizzer").hidden) {
        // Go to settings screen
        Show(quizzerType);
    }
    else {
        // Go to home screen
        Show("home");
    }
}
