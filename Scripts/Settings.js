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
            items = ["All Definitions", "Spanish Infinitives", "English Infinitives",
                    "All Conjugations", "Reverse Conjugations",
                    "Present Participles", "Present Tense", "Preterite Tense", "Imperfect Tense",
                    "Present Participle non-Regular", "Present non-Regular", "Preterite non-Regular", "Imperfect non-Regular",
                    "Present Participle Regular", "Present Regular", "Preterite Regular", "Imperfect Regular"];
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