// Declare global variables
let Sets;               // List of parsed sets
let app;



/**
 * Initialize the Vue app
 */
function loadVue() {
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            state: "home",      // Can be either "home", "settings", or "quizzer"
            category: "verbs",  // Can be either "verbs" or "vocab"
            
            settings: {
                promptType: "Text",
                inputType: "Text",
                onMissedPrompt: "Correct me",
                repeatPrompts: "Never",
            },

            prompts: [],
            promptIndex: 0,
        },

        methods: {
            /**
             * Return to the previous state.
             */
            Back: function() {
                switch (app.state) {
                    case "quizzer":
                    case "congrats":
                        app.state = "settings";
                        break;
                    case "settings":
                    case "home":
                    default:
                        app.state = "home";
                        break;
                }
            },

            /**
             * Update the user's progress in localStorage.
             * @param {Array} prompts - The list of prompts.
             * @param {Number} index - The index of the current prompt.
             */
            updateProgress: function(prompts, index) {
                // Get localStorage prefix
                let prefix = app.category === "verbs" ? "verb-" : "vocab-";

                // Save progress to local storage
                localStorage.setItem(prefix + "prompts", JSON.stringify(prompts));
                localStorage.setItem(prefix + "prompt", JSON.stringify(index));
            },

            /**
             * Perform validation checks and then start the quizzer.
             * @param {Array} prompts - The list of prompts.
             * @param {Number} promptIndex - The index of the current prompt.
             * @param {Object} settings - The user's settings.
             */
            StartSession: function(prompts, promptIndex, settings) {
                // Validate browser for voice input
                if (settings.inputType !== "Text") {
                    if ((window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition) === undefined) {
                        alert("Your browser does not support voice input.");
                        return;
                    }
                }

                // Give iOS devices ringer warning for prompt audio
                if (settings.promptType !== "Text") {
                    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                        alert("Please make sure your ringer is on in order to hear audio prompts.");
                    }
                }

                // Copy over parameters
                this.prompts = prompts;
                this.promptIndex = promptIndex;
                this.settings = settings;

                // Show and hide elements (also enables the quizzer)
                this.state = "quizzer";
            }
        },
    });
}



/**
 * Load the document.
 */
function Load() {
    // Call LoadPage method from global.js
    LoadPage();

    // Initialize the Vue app
    loadVue();

    // Unhide hidden divs
    // Divs were hidden to improve interface for users with JS blocked
    document.getElementById("home").hidden = false;
    document.getElementById("settings").hidden = false;
    document.getElementById("quizzer").hidden = false;
    document.getElementById("congrats").hidden = false;
    document.querySelector("footer").hidden = false;

    // Add event Listeners
    document.addEventListener("keydown", KeyDown);

    // Load CSVs
    Sets = [];
    let setNames = ["Verbs", "Adjectives", "Adverbs", "Prepositions", "Transitions",
                    "Colors", "Days", "Months", "Questions", "Weather", "Family", "Clothes",
                    "Nature", "House", "Vacation", "Childhood", "Professions", "Health"];
    for (let setName of setNames) {
        Papa.parse(`vocab/${setName}.csv`, {
            download: true,
            complete: function(results) {
                // Set verbs
                Sets[setName] = results.data;
            }
        });
    }
}



/**
 * Handle a keyDown event (implements some keyboard shortcuts).
 * @param {object} e - The event args.
 */
function KeyDown(e) {
    if (e.key === "Escape") {
        app.Back();
    }

    // Home shortcuts
    if (app.state === "home") {
        if (e.key === "c") {
            app.category = "verbs";
            app.state = "settings";
        }
        if (e.key === "v") {
            app.category = "vocab";
            app.state = "settings";
        }
        if (e.key === "r") {
            window.location = "reference.html";
        }
    }
}
