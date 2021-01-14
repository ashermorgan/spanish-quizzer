// Declare global variables
let app;



/**
 * Initializes the Vue app
 */
function loadVue() {
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            category: "Choose a category",
            data: {"Choose a category":[]},
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

    // Load Spanish-Quizzer data
    app.data = {...app.data, ...await loadData()};
}



/**
 * Set the table height.
 */
function setTableHeight() {
    var tableY = document.getElementById("referenceTable").offsetTop;
    document.getElementById("referenceTable").style.height = `${window.innerHeight - tableY - 10}px`;
}
