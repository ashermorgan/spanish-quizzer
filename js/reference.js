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
            sets: {"Choose a vocab set":[], "All Sets":[["English", "Spanish", "Type"]]},
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
    let setNames = ["Adjectives", "Adverbs", "Prepositions", "Transitions", "Verbs",
                    "Colors", "Days", "Months", "Questions",
                    "Childhood", "Clothes", "Family", "Food", "Health", "House", "Nature", "Professions", "Vacation", "Weather"];
    for (let setName of setNames) {
        Papa.parse(`vocab/${setName}.csv`, {
            download: true,
            complete: function(results) {
                // Add Set
                app.sets[setName] = results.data;

                // Add data to "All Sets"
                if (setName === "Verbs") {
                    for (let row of results.data.slice(1)) {
                        app.sets["All Sets"].push([row[0], row[1], "Verb"]);
                    }
                }
                else {
                    app.sets["All Sets"].push(...results.data.slice(1));
                }

                // Sort "All Sets"
                app.sets["All Sets"].sort(function(a, b) {
                    if (a[0] === "English") return false;       // Header row should be at the top
                    else if (b[0] === "English") return true;   // Header row should be at the top
                    else return a[0] > b[0];                    // Sort other rows by 1st item
                })
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
