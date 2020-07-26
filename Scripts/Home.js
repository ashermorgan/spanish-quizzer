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
    Papa.parse("Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Verbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Adjectives.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adjectives"] = results.data;
        }
    });
    Papa.parse("Vocab/Adverbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adverbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Prepositions"] = results.data;
        }
    });
    Papa.parse("Vocab/Transitions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Transitions"] = results.data;
        }
    });
    Papa.parse("Vocab/Colors.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Colors"] = results.data;
        }
    });
    Papa.parse("Vocab/Days.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Days"] = results.data;
        }
    });
    Papa.parse("Vocab/Months.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Months"] = results.data;
        }
    });
    Papa.parse("Vocab/Questions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Questions"] = results.data;
        }
    });
    Papa.parse("Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Weather"] = results.data;
        }
    });
    Papa.parse("Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Family"] = results.data;
        }
    });
    Papa.parse("Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Clothes"] = results.data;
        }
    });
    Papa.parse("Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Nature"] = results.data;
        }
    });
    Papa.parse("Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["House"] = results.data;
        }
    });
    Papa.parse("Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Vacation"] = results.data;
        }
    });
    Papa.parse("Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Childhood"] = results.data;
        }
    });
    Papa.parse("Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Professions"] = results.data;
        }
    });
    Papa.parse("Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Health"] = results.data;
        }
    });
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
