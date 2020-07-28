// Declare global variables
let setId = 0;  // Next valid vocab set id number



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



// Add a verb filter
function AddVerbFilter() {
    // Create row
    var clone = document.getElementById("verbFilterTemplate").content.cloneNode(true);

    // Set row ids
    clone.children[0].setAttribute("id", `verbFilter-${setId}`);
    clone.getElementById("verbFilterTense").setAttribute("id", `verbFilterTense-${setId}`);
    clone.getElementById("verbFilterType").setAttribute("id", `verbFilterType-${setId}`);
    
    // Add remove button onclick attribute
    clone.getElementById("verbFilterRemove").setAttribute("onclick", `var element = document.getElementById('verbFilter-${setId}'); element.parentNode.removeChild(element);`);
    
    // Add row
    document.getElementById("verbFiltersInner").appendChild(clone);
    
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



// Update the type filter options
function VerbTenseChanged(filter) {
    // Get type filter element
    let types = document.getElementById(filter.id.replace("verbFilterTense", "verbFilterType"));

    // Enable all types
    types[0].disabled = false;
    types[1].disabled = false;
    types[2].disabled = false;
    types[3].disabled = false;
    types[4].disabled = false;
    types[5].disabled = false;

    // Disable unavailable types
    switch(filter.value)
    {
        case "All Tenses":
            break;
        case "Present Participles":
            types[4].disabled = true; // Orthographic
            if (types.selectedIndex === 4) {
                // Deselect unavailable types
                types.selectedIndex = 0
            }
            break;
        case "Present Tense":
            types[4].disabled = true; // Orthographic
            if (types.selectedIndex === 4) {
                // Deselect unavailable types
                types.selectedIndex = 0
            }
            break;
        case "Preterite Tense":
            break;
        case "Imperfect Tense":
            types[3].disabled = true; // Stem Changing
            types[4].disabled = true; // Orthographic
            if (types.selectedIndex === 3 || types.selectedIndex === 4) {
                // Deselect unavailable types
                types.selectedIndex = 0
            }
            break;
    }
}



// Start a new session
function CreateSession() {
    // Get terms and localStorage prefix
    let terms;
    let prefix;
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

        // Set prefix
        prefix = "vocab-"
    }
    else if (!document.getElementById("verbSettings").hidden) {
        // Get filters
        let filters = [];
        for (let i = 0; i < setId; i++)
        {
            if (document.getElementById(`verbFilter-${i}`))
            {
                // Get filter information
                let tense = document.getElementById(`verbFilterTense-${i}`).value;
                let type = document.getElementById(`verbFilterType-${i}`).value;
                
                // Add filter
                filters.push({tense: tense, regularity: type});
            }
        }

        // Get terms
        terms = Shuffle(ApplyVerbFilter(Sets["Verbs"], filters));

        // Set prefix
        prefix = "verb-"
    }
    
    // Get quizzer settings
    inputType = document.getElementById("settingsInputType").value;
    promptType = document.getElementById("settingsPromptType").value;
    repeatPrompts = document.getElementById("settingsRepeatPrompts").value;
    
    // Start quizzer
    try {
        // Start quizzer
        StartQuizzer(terms, 0, prefix, inputType, promptType, repeatPrompts);

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
    // Get localStorage prefix
    let prefix;
    if (!document.getElementById("vocabSettings").hidden) {
        prefix = "vocab-"
    }
    else if (!document.getElementById("verbSettings").hidden) {
        prefix = "verb-"
    }

    // Load terms and progress
    let terms = JSON.parse(localStorage.getItem(prefix + "terms"));
    let term = parseInt(localStorage.getItem(prefix + "term"));

    // Get quizzer settings
    inputType = document.getElementById("settingsInputType").value;
    promptType = document.getElementById("settingsPromptType").value;
    repeatPrompts = document.getElementById("settingsRepeatPrompts").value;

    // Start quizzer
    try {
        StartQuizzer(terms, term, prefix, inputType, promptType, repeatPrompts);

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



// Filters verbs set given the filter information
function ApplyVerbFilter(terms, filterInfo) {
    // Change regularity strings into regex
    for (config of filterInfo) {
        switch (config.regularity.toLowerCase()) {
            case "regular":
                config.regularity = "Regular";
                break;
            case "irregular":
                config.regularity = "Irregular";
                break;
            case "stem-changing":
            case "stem changing":
                config.regularity = "Stem.?Changing";
                break;
            case "orthographic":
                config.regularity = "Orthographic";
                break;
            case "non-regular":
            case "non regular":
            case "nonregular":
                config.regularity = "Irregular|Stem.?Changing|Orthographic";
                break;
            default:
            case "all":
                config.regularity = ".*";
        }
    }

    // Create filters
    let filters = [];   // Format: [{outputIndex:0, inputIndex:0, filterIndex:0, filterValue:"regex"}]
    for (config of filterInfo) {
        switch (config.tense.toLowerCase()) {
            case "present participle":
            case "present participles":
                filters.push({outputIndex:0, inputIndex:3, filterIndex:2, filterValue:config.regularity});
                break;
            case "present":
            case "present tense":
                filters.push({outputIndex:0, inputIndex:5, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:6, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:7, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:8, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:9, filterIndex:4, filterValue:config.regularity});
                break;
            case "preterite":
            case "preterite tense":
                filters.push({outputIndex:0, inputIndex:11, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:12, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:13, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:14, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:15, filterIndex:10, filterValue:config.regularity});
                break;
            case "imperfect":
            case "imperfect tense":
                filters.push({outputIndex:0, inputIndex:17, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:18, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:19, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:20, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:21, filterIndex:16, filterValue:config.regularity});
                break;
            default:
            case "all":
                filters.push({outputIndex:0, inputIndex:3, filterIndex:2, filterValue:config.regularity});

                filters.push({outputIndex:0, inputIndex:5, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:6, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:7, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:8, filterIndex:4, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:9, filterIndex:4, filterValue:config.regularity});
                
                filters.push({outputIndex:0, inputIndex:11, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:12, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:13, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:14, filterIndex:10, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:15, filterIndex:10, filterValue:config.regularity});
                
                filters.push({outputIndex:0, inputIndex:17, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:18, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:19, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:20, filterIndex:16, filterValue:config.regularity});
                filters.push({outputIndex:0, inputIndex:21, filterIndex:16, filterValue:config.regularity});
                break;
        }
    }

    // Filter terms
    let results = [];   // Format: [[<output label>, <output>, <input label>, <input>]]
    for (filter of filters) {
        // Iterate over terms (minus headers)
        for (term of terms.slice(1)) {
            // Check against filters
            if (term[filter.filterIndex].match(filter.filterValue)) {
                results.push([terms[0][filter.outputIndex], term[filter.outputIndex], terms[0][filter.inputIndex], term[filter.inputIndex]]);
            }
        }
    }
    return results;
}
