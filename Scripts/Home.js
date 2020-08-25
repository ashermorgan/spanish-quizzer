// Declare global variables
let Sets;               // List of parsed sets
let quizzerType = null; // Type of quizzer
let app;



// Load the document
function Load() {
    // Initialize Vue
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            "state": "home"
        },

        methods: {
            Back: function() {
                switch (app.state) {
                    case "verbQuizzer":
                        app.state = "verbSettings";
                        break;
                    case "vocabQuizzer":
                        app.state = "vocabSettings";
                        break;
                    case "verbSettings":
                    case "vocabSettings":
                    case "home":
                    default:
                        app.state = "home";
                        break;
                }
            }
        }
    });

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
    document.addEventListener("keydown", KeyDown);
    document.getElementById("quizzerInput").addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            // Key was Ctrl+Enter
            Reset(); // Skip prompt
        }
        else if (e.keyCode === 13) {
            // Key was Enter
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



// Handles keyDown events (implements keyboard shortcuts)
function KeyDown(e) {
    if (e.key === "Escape") {
        app.Back();
    }

    // Home shortcuts
    if (app.state = "home") {
        if (e.key === "c") {
            app.state = "verbSettings";
        }
        if (e.key === "v") {
            app.state = "vocabSettings";
        }
        if (e.key === "r") {
            window.location = "/reference.html";
        }
    }

    // Settings shortcuts
    if (app.state == "verbSettings" || app.state == "vocabSettings") {
        if (e.key === "s") {
            CreateSession();
        }
        if (e.key === "r") {
            ResumeSession();
        }
    }
}
