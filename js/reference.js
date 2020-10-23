// Declare global variables
let app;



/**
 * Initializes the Vue app
 */
function loadVue() {
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            set: "Choose a vocab set",
            sets: {"Choose a vocab set":[]},
            query: ""
        }
    });
}



/**
 * Load the document
 */
function Load() {
    // Call LoadPage method from global.js
    LoadPage();
    
    // Initialize the Vue
    loadVue();

    // Unhide hidden divs
    // Divs were hidden to improve interface for users with JS blocked
    document.querySelector("h1").hidden = false;
    document.getElementById("controls").hidden = false;
    document.getElementById("referenceTable").hidden = false;
    document.querySelector("footer").hidden = false;

    // Set table height
    setTableHeight();

    // Load CSVs
    let setNames = ["Verbs", "Adjectives", "Adverbs", "Prepositions", "Transitions",
                    "Colors", "Days", "Months", "Questions", "Weather", "Family", "Clothes",
                    "Nature", "House", "Vacation", "Childhood", "Professions", "Health"];
    for (let setName of setNames) {
        Papa.parse(`vocab/${setName}.csv`, {
            download: true,
            complete: function(results) {
                // Set verbs
                app.sets[setName] = results.data;
            }
        });
    }
}



/**
 * Set the table height.
 */
function setTableHeight() {
    var tableY = document.getElementById("referenceTable").offsetTop;
    document.getElementById("referenceTable").style.height = `${window.innerHeight - tableY - 50}px`;
}
