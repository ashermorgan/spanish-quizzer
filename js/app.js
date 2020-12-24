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
            filters: [],
            settings: getSettings(),
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
             * Start a new quizzer session
             */
            CreateSession: function() {
                // Get prompts
                if (this.category === "vocab") {
                    this.prompts = Shuffle(ApplyFilters(Sets, GetVocabFilters(this.filters), this.settings.multiplePrompts));
                }
                else if (this.category === "verbs") {
                    // Get prompts
                    this.prompts = Shuffle(ApplyFilters(Sets, GetVerbFilters(this.filters), this.settings.multiplePrompts));
                }

                // Set progress
                this.promptIndex = 0;

                // Start quizzer
                this.StartSession();
            },

            /**
             * Resume the previous quizzer session.
             */
            ResumeSession: function() {
                // Get localStorage prefix
                let prefix;
                if (this.category === "vocab") {
                    prefix = "vocab-"
                }
                else if (this.category === "verbs") {
                    prefix = "verb-"
                }

                // Load prompts and progress
                this.prompts = JSON.parse(localStorage.getItem(prefix + "prompts"));
                this.promptIndex = parseInt(localStorage.getItem(prefix + "prompt"));

                // Start quizzer
                this.StartSession();
            },

            /**
             * Perform validation checks and then start the quizzer.
             */
            StartSession: function() {
                // Validate prompts and promptIndex
                if (!this.prompts) {
                    alert("An error occured while resuming the previous session.");
                    return;
                }
                else if (this.prompts.length === 0) {
                    alert("Your custom vocabulary set must contain at least one term.");
                    return;
                }
                else if (isNaN(this.promptIndex) || this.promptIndex < 0 || this.promptIndex >= this.prompts.length) {
                    alert("An error occured while resuming the previous session.");
                    return;
                }

                // Validate browser for voice input
                if (this.settings.inputType !== "Text") {
                    if ((window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition) === undefined) {
                        alert("Your browser does not support voice input.");
                        return;
                    }
                }

                // Give iOS devices ringer warning for prompt audio
                if (this.settings.promptType !== "Text") {
                    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                        alert("Please make sure your ringer is on in order to hear audio prompts.");
                    }
                }

                // Show and hide elements (also enables the quizzer)
                this.state = "quizzer";
            },
        },
    });
}



/**
 * Load the document.
 */
async function Load() {
    // Set theme
    SetTheme(null);

    // Initialize the Vue app
    loadVue();

    // Unhide hidden divs
    // Divs were hidden to improve interface for users with JS blocked
    document.getElementById("home").hidden = false;
    document.getElementById("settings").hidden = false;
    document.getElementById("congrats").hidden = false;

    // Add event Listeners
    document.addEventListener("keydown", KeyDown);

    // Load vocab
    Sets = await loadVocab();
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

    // Settings shortcuts
    if (app.state === "settings") {
        if (e.key === "s") {
            app.CreateSession();
        }
        if (e.key === "r") {
            app.ResumeSession();
        }
    }
}
