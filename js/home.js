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
            category: "home",   // Can be either "verbs" or "vocab"
            
            promptType: "Text",
            inputType: "Text",
            onMissedPrompt: "Correct me",
            repeatPrompts: "Never",

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
             * @param {String} promptType - The prompt type.
             * @param {String} inputType - The input type.
             * @param {String} onMissedPrompt - The onMissedPrompt setting value.
             * @param {String} repeatPrompts - The repeat prompts setting value.
             */
            StartSession: function(prompts, promptIndex, promptType, inputType, onMissedPrompt, repeatPrompts) {
                // Validate browser for voice input
                if (this.inputType !== "Text") {
                    if (typeof InstallTrigger !== "undefined") {
                        // Browser is Firefox
                        alert("You must enable speech recognition in about:config.");
                    }
                    else if (!window.chrome || (!window.chrome.webstore && !window.chrome.runtime)) {
                        // Browser is not Googole Chrome or Microsoft (Chromium) Edge
                        alert("Your browser does not support voice input.");
                        return;
                    }
                }

                // Give iOS devices ringer warning for prompt audio
                if (this.promptType !== "Text") {
                    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                        alert("Please make sure your ringer is on in order to hear audio prompts.");
                    }
                }

                // Copy over prompts and promptIndex
                this.prompts = prompts;
                this.promptIndex = promptIndex;

                // Copy over settings
                this.promptType = promptType
                this.inputType = inputType
                this.onMissedPrompt = onMissedPrompt
                this.repeatPrompts = repeatPrompts

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
            category = "verbs";
            state = "settings";
        }
        if (e.key === "v") {
            category = "vocab";
            state = "settings";
        }
        if (e.key === "r") {
            window.location = "reference.html";
        }
    }
}
