// Declare global variables
var Sets;       // List of parsed sets
var setId = 0;  // Next valid set id number



// Update local storage
function UpdateLocalStorage() {
    localStorage.setItem("darkMode", document.getElementById("settingsDarkMode").checked);
    localStorage.setItem("PromptType", document.getElementById("settingsPromptType").value);
    localStorage.setItem("InputType", document.getElementById("settingsInputType").value);
    localStorage.setItem("repeatPrompt", document.getElementById("settingsRepeatPrompts").value);
}



// Add a filtered set
function AddVocabSet() {
    // Create row
    var clone = document.getElementById("vocabSetTemplate").content.cloneNode(true);

    // Set row ids
    clone.children[0].setAttribute("id", `vocabSet-${setId}`);
    clone.getElementById("vocabSetName").setAttribute("id", `vocabSetName-${setId}`);
    clone.getElementById("vocabSetFilter").setAttribute("id", `vocabSetFilter-${setId}`);
    
    // Add remove button onclick attribute
    clone.getElementById("vocabSetRemove").setAttribute("onclick", `var element = document.getElementById('vocabSet-${setId}'); element.parentNode.removeChild(element);`);
    
    // Add row
    document.getElementById("vocabSetsInner").appendChild(clone);
    
    // Add filters
    VocabSetChanged(document.getElementById(`vocabSetName-${setId}`));
    
    // Increment setId
    setId++; // increment fileId to get a unique ID for the new element
}



// Update the filter option
function VocabSetChanged(setName) {
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
    filterId = setName.id.replace("vocabSetName", "vocabSetFilter");
    document.getElementById(filterId).innerHTML = html;
}



// Start a new session
function CreateSession() {
    // Get terms
    let terms;
    if (!document.getElementById("vocabSettings").hidden) {
        // Filter and load Sets into Terms
        terms = [];
        for (var i = 0; i < setId; i++)
        {
            if (document.getElementById(`vocabSet-${i}`))
            {
                // Get filter information
                var set = document.getElementById(`vocabSetName-${i}`).value;
                var filter = document.getElementById(`vocabSetFilter-${i}`).value;

                // Add filtered set
                terms.push(...ApplyVocabFilter(Sets[set], filter));
            }
        }

        // Shuffle terms
        terms = Shuffle(terms);
    }
    else if (!document.getElementById("verbSettings").hidden) {
        // Filter and load Sets into Terms
        let filter = document.getElementById(`verbSetFilter`).value;
        terms = ApplyVerbFilter(Sets["Verbs"], filter);

        // Shuffle terms
        terms = Shuffle(terms);
    }
    
    // Start quizzer
    try {
        // Start quizzer
        StartQuizzer(terms, 0);

        // Show and hide elements
        Show("quizzer");
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
function ApplyVocabFilter(vocabSet, name) {
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



// Filters verbs set given the filter name
function ApplyVerbFilter(vocabSet, name) {
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
