// Declare global variables
let app;



/**
 * Initialize the Vue app
 */
function loadVue() {
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            data: {},
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
                    case "reference":
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
                // Save progress
                localStorage.setItem("last-session", JSON.stringify({ prompts: prompts, index: index }));
            },

            /**
             * Perform validation checks and then start the quizzer.
             */
            startQuizzer: function(prompts, promptIndex, settings) {
                this.settings = settings;
                this.prompts = prompts;
                this.promptIndex = promptIndex;
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

    // Add event Listeners
    document.addEventListener("keydown", KeyDown);

    // Load Spanish-Quizzer data
    app.data = await loadData();
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
