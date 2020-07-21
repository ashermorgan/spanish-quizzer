// Declare global variables
var Sets;       // List of parsed sets
var setId = 0;  // Next valid set id number



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
    Sets = [];
    Papa.parse("Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Verbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Adjectives.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adjectives"] = results.data;
        }
    });
    Papa.parse("Vocab/Adverbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adverbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Prepositions"] = results.data;
        }
    });
    Papa.parse("Vocab/Transitions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Transitions"] = results.data;
        }
    });
    Papa.parse("Vocab/Colors.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Colors"] = results.data;
        }
    });
    Papa.parse("Vocab/Days.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Days"] = results.data;
        }
    });
    Papa.parse("Vocab/Months.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Months"] = results.data;
        }
    });
    Papa.parse("Vocab/Questions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Questions"] = results.data;
        }
    });
    Papa.parse("Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Weather"] = results.data;
        }
    });
    Papa.parse("Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Family"] = results.data;
        }
    });
    Papa.parse("Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Clothes"] = results.data;
        }
    });
    Papa.parse("Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Nature"] = results.data;
        }
    });
    Papa.parse("Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["House"] = results.data;
        }
    });
    Papa.parse("Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Vacation"] = results.data;
        }
    });
    Papa.parse("Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Childhood"] = results.data;
        }
    });
    Papa.parse("Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Professions"] = results.data;
        }
    });
    Papa.parse("Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Health"] = results.data;
        }
    });

    // Add set
    AddSet();

    // Show and hide elements
    Reload();
}



// Reload the document
function Reload() {
    document.getElementById("settings").hidden = false;
    document.getElementById("settingsError").textContent = "";
    document.getElementById("quizzer").hidden = true;
}



// Add a filtered set
function AddSet() {
    // Create row
    var clone = document.getElementById("settingsSetTemplate").content.cloneNode(true);

    // Set row ids
    clone.children[0].setAttribute("id", `settingsSet-${setId}`);
    clone.getElementById("settingsSetName").setAttribute("id", `settingsSetName-${setId}`);
    clone.getElementById("settingsSetFilter").setAttribute("id", `settingsSetFilter-${setId}`);
    
    // Add remove button onclick attribute
    clone.getElementById("settingsSetRemove").setAttribute("onclick", `var element = document.getElementById('settingsSet-${setId}'); element.parentNode.removeChild(element);`);
    
    // Add row
    document.getElementById("settingsSetsInner").appendChild(clone);
    
    // Add filters
    settingsSetChanged(document.getElementById(`settingsSetName-${setId}`));
    
    // Increment setId
    setId++; // increment fileId to get a unique ID for the new element
}



// Update the filter option
function settingsSetChanged(setName) {
    // Get filter options
    var items = [];
    switch(setName.value)
    {
        case "Verbs":
            items = ["All Definitions", "Spanish Infinitives", "English Infinitives", "Reverse Conjugations"];
            break;
        
        case "Adjectives":
        case "Adverbs":
        case "Prepositions":
        case "Transitions":
        case "Colors":
        case "Days":
        case "Months":
        case "Questions":
            items = ["All Definitions", "English to Spanish", "Spanish to English"];
            break;

        case "Weather":
        case "Professions":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Verbs"];
            break;

        case "Family":
        case "Clothes":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Adjectives"];
            break;
        
        case "Nature":
        case "House":
        case "Vacation":
        case "Childhood":
        case "Health":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Verbs", "Adjectives"];
            break;
    }

    // Create html
    var html = ""
    for (var item of items) {
        html += "<option>" + item + "</option>"
    }

    // Set html
    filterId = setName.id.replace("settingsSetName", "settingsSetFilter");
    document.getElementById(filterId).innerHTML = html;
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
    let terms = [];
    for (var i = 0; i < setId; i++)
    {
        if (document.getElementById(`settingsSet-${i}`))
        {
            // Get filter information
            var set = document.getElementById(`settingsSetName-${i}`).value;
            var filter = document.getElementById(`settingsSetFilter-${i}`).value;
    
            // Add filtered set
            terms.push(...ApplyFilter(Sets[set], filter));
        }
    }

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
        case "English to Spanish":
            io = [[0,1]];
            value = [];
            break;

        case "English Infinitives":
        case "Spanish to English":
            io = [[1,0]];
            value = [];
            break;
        
        case "Reverse Conjugations":
            io = [[3,0], [5,0], [6,0], [7,0], [8,0], [9,0], [11,0], [12,0], [13,0], [14,0], [15,0], [17,0], [18,0], [19,0], [20,0], [21,0]];
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
