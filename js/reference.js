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
async function Load() {
    // Update theme
    SetTheme(null);

    // Initialize the Vue
    loadVue();

    // Unhide hidden divs
    // Divs were hidden to improve interface for users with JS blocked
    document.querySelector("h1").hidden = false;
    document.getElementById("controls").hidden = false;
    document.getElementById("referenceTable").hidden = false;

    // Set table height
    setTableHeight();

    // Load vocab
    app.sets = {...app.sets, ...await loadVocab()};

    // Add data to "All Sets"
    for (let set in app.sets) {
        if (set === "Verbs") {
            for (let row of app.sets[set].slice(1)) {
                app.sets["All Sets"].push([row[0], row[1], "Verb"]);
            }
        }
        else {
            app.sets["All Sets"].push(...app.sets[set].slice(1));
        }
    }

    // Sort "All Sets"
    app.sets["All Sets"].sort(function(a, b) {
        if (a[0] === "English") return false;       // Header row should be at the top
        else if (b[0] === "English") return true;   // Header row should be at the top
        else return a[0] > b[0];                    // Sort other rows by 1st item
    })
}



/**
 * Set the table height.
 */
function setTableHeight() {
    var tableY = document.getElementById("referenceTable").offsetTop;
    document.getElementById("referenceTable").style.height = `${window.innerHeight - tableY - 10}px`;
}
