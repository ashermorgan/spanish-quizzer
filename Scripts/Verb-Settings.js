// Declare global variables
var Verbs;       // List of parsed verbs



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
    document.getElementById("title").addEventListener("click", function (e) {
        if (document.getElementById("quizzer").hidden == false) {
            Reload();
        }
        else {
            window.location = "/";
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
    Verbs = [];
    Papa.parse("Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Verbs = results.data;
        }
    });

    // Show and hide elements
    Reload();
}



// Reload the document
function Reload() {
    document.getElementById("settings").hidden = false;
    document.getElementById("settingsError").textContent = "";
    document.getElementById("quizzer").hidden = true;
}



// Update local storage
function UpdateLocalStorage() {
    localStorage.setItem("darkMode", document.getElementById("settingsDarkMode").checked);
    localStorage.setItem("PromptType", document.getElementById("settingsPromptType").value);
    localStorage.setItem("InputType", document.getElementById("settingsInputType").value);
    localStorage.setItem("repeatPrompt", document.getElementById("settingsRepeatPrompts").value);
}



// Start a new session
function CreateSession() {
    // Filter and load Sets into Terms
    let filter = document.getElementById(`settingsSetFilter`).value;
    let terms = ApplyFilter(Verbs, filter);

    // Shuffle terms
    terms = Shuffle(terms);

    try {
        // Start quizzer
        StartQuizzer(terms, 0);

        // Show and hide elements
        document.getElementById("settings").hidden = true;
        document.getElementById("quizzer").hidden = false;
    }
    catch (e) {
        switch (e) {
            case "Terms is empty.":
                document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            default:
                document.getElementById("settingsError").textContent = "An error occured.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
        }
    }
}



// Resume the previous session
function ResumeSession() {
    // Load terms and progress
    let terms = JSON.parse(localStorage.getItem("terms"));
    let term = parseInt(localStorage.getItem("term"));

    // Start quizzer
    try {
        StartQuizzer(terms, term);

        // Show and hide elements
        document.getElementById("settings").hidden = true;
        document.getElementById("quizzer").hidden = false;
    }
    catch (e) {
        switch (e) {
            case "Bad arguments.":
                document.getElementById("settingsError").textContent = "An error occured while resuming the previous session.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            case "Terms is empty.":
                document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            default:
                document.getElementById("settingsError").textContent = "An error occured.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
        }
    }
}



// Filters a vocabulary set given the filter name
function ApplyFilter(vocabSet, name) {
    // Declare variables
    var io;     // Format: [[<output index>, <input index>]]
    var value;  // Format: [[<index>, [<values>], exclude?]]

    // Get filter
    switch (name) {
        case "All Definitions":
            io = [[0,1], [1,0]];
            value = [];
            break;

        case "Spanish Infinitives":
            io = [[0,1]];
            value = [];
            break;

        case "English Infinitives":
            io = [[1,0]];
            value = [];
            break;
        
        case "All Conjugations":
            io = [[0,3], [0,5], [0,6], [0,7], [0,8], [0,9], [0,11], [0,12], [0,13], [0,14], [0,15], [0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [];
            break;
        
        case "Reverse Conjugations":
            io = [[3,0], [5,0], [6,0], [7,0], [8,0], [9,0], [11,0], [12,0], [13,0], [14,0], [15,0], [17,0], [18,0], [19,0], [20,0], [21,0]];
            value = [];
            break;

        case "Present Participles":
            io = [[0,3]];
            value = [];
            break;

        case "Present Tense":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [];
            break;

        case "Preterite Tense":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]]
            value = [];
            break;

        case "Imperfect Tense":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [];
            break;

        case "Present Participle non-Regular":
            io = [[0,3]];
            value = [[2, ["Regular"], true]];
            break;

        case "Present non-Regular":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [[4, ["Regular"], true]];
            break;

        case "Preterite non-Regular":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]];
            value = [[10, ["Regular"], true]];
            break;

        case "Imperfect non-Regular":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [[16, ["Regular"], true]];
            break;

        case "Present Participle Regular":
            io = [[0,3]];
            value = [[2, ["Regular"], false]];
            break;

        case "Present Regular":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [[4, ["Regular"], false]];
            break;

        case "Preterite Regular":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]];
            value = [[10, ["Regular"], false]];
            break;

        case "Imperfect Regular":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [[16, ["Regular"], false]];
            break;

        default:
            io = [];
            value = [];
            break;
    }

    // Filter terms by value
    var vSet = vocabSet.slice(1);  // Format: same as vocabSet but without headers
    for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            if (value[i][2]) {
                // Exclude values
                if (value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
            else {
                // Include values
                if (!value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
        }
    }

    // Filter terms by input/output
    var ioSet = []; // Format: [<output type>, <output>, <input type>, <input>]
    for (var i = 0; i < io.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            ioSet.push([vocabSet[0][io[i][0]], vSet[j][io[i][0]], vocabSet[0][io[i][1]], vSet[j][io[i][1]]]);
        }
    }

    // Return filtered set
    return ioSet;
}
