// Start a new session
function CreateSession() {
    // Get prompts and localStorage prefix
    let prefix;
    if (app.state == "vocabSettings") {
        // Filter and load Sets into prompts
        app.prompts = [];
        for (let filter of app.vocabFilters)
        {
            // Add filtered set
            app.prompts.push(...ApplyVocabFilter(Sets[filter.set], filter.type));
        }

        // Shuffle prompts
        app.prompts = Shuffle(app.prompts);

        // Set prefix
        prefix = "vocab-"
    }
    else if (app.state == "verbSettings") {
        // Get prompts
        app.prompts = Shuffle(ApplyVerbFilter(Sets["Verbs"], app.verbFilters));

        // Set prefix
        prefix = "verb-"
    }

    // Set progress
    app.promptIndex = 0;
    
    // Start quizzer
    try {
        StartSession();
    }
    catch (e) {
        switch (e) {
            case "Terms is empty.":
                app.errorMsg = "Your custom vocabulary set must contain at least one term.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            default:
                app.errorMsg = "An error occured.";
                document.getElementById("settingsError").scrollIntoView(false);
                throw e;
        }
    }
}



// Resume the previous session
function ResumeSession() {
    // Get localStorage prefix
    let prefix;
    if (app.state == "vocabSettings") {
        prefix = "vocab-"
    }
    else if (app.state == "verbSettings") {
        prefix = "verb-"
    }

    // Load prompts and progress
    app.prompts = JSON.parse(localStorage.getItem(prefix + "prompts"));
    app.promptIndex = parseInt(localStorage.getItem(prefix + "prompt"));

    // Start quizzer
    try {
        StartSession();
    }
    catch (e) {
        switch (e) {
            case "Bad arguments.":
                app.errorMsg = "An error occured while resuming the previous session.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            case "Terms is empty.":
                app.errorMsg = "Your custom vocabulary set must contain at least one term.";
                document.getElementById("settingsError").scrollIntoView(false);
                break;
            default:
                app.errorMsg = "An error occured.";
                document.getElementById("settingsError").scrollIntoView(false);
                throw e;
        }
    }
}



// Performs validations and then starts the quizzer
function StartSession() {
    // Validate prompts and promptIndex
    if (!app.prompts || isNaN(app.promptIndex) || app.promptIndex < -1 || app.promptIndex > app.prompts.length) {
        throw "Bad arguments.";
    }
    else if (app.prompts.length == 0) {
        throw "Terms is empty.";
    }

    // Validate browser for voice input
    if (app.inputType != "Text") {
        if (typeof InstallTrigger !== "undefined") {
            // Browser is Firefox
            alert("You must enable speech recognition in about:config.");
        }
        else if (!window.chrome || (!window.chrome.webstore && !window.chrome.runtime)) {
            // Browser is not Googole Chrome or Microsoft (Chromium) Edge
            alert("Your browser does not support voice input.");
            return;
        }
    }

    // Give iOS devices ringer warning for prompt audio
    if (app.promptType != "Text") {
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            alert("Please make sure your ringer is on in order to hear audio prompts.");
        }
    }

    // Show and hide elements (also enables the quizzer)
    if (app.state == "verbSettings") {
        app.state = "verbQuizzer";
    }
    else if (app.state == "vocabSettings") {
        app.state = "vocabQuizzer";
    }
    else {
        app.state = "quizzer";
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

        case "Nouns":
            io = [[0,1], [1,0]];
            value = [[2, ["Noun"], false]];
            break;
        case "Verbs":
            io = [[0,1], [1,0]];
            value = [[2, ["Verb"], false]];
            break;
        case "Adjectives":
            io = [[0,1], [1,0]];
            value = [[2, ["Adjective"], false]];
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



// Filters verbs set given the filter information
function ApplyVerbFilter(terms, filterInfo) {
    // Create filters
    let filters = [];   // Format: [{outputIndex:0, inputIndex:0, filterIndex:0, filterValue:"regex"}]
    for (let config of filterInfo) {
        // Get regularity
        let regularity;
        switch (config.type.toLowerCase()) {
            case "regular":
                regularity = "Regular";
                break;
            case "reflexive":
                regularity = "Reflexive";
                break;
            case "irregular":
                regularity = "Irregular";
                break;
            case "stem-changing":
            case "stem changing":
                regularity = "Stem.?Changing";
                break;
            case "orthographic":
                regularity = "Orthographic";
                break;
            case "non-regular":
            case "non regular":
            case "nonregular":
                regularity = "Irregular|Stem.?Changing|Orthographic";
                break;
            default:
            case "all":
                regularity = ".*";
        }

        // Create filter
        switch (config.tense.toLowerCase()) {
            case "present participle":
            case "present participles":
                filters.push({outputIndex:0, inputIndex:3, filterIndex:2, filterValue:regularity});
                break;
            case "present":
            case "present tense":
                filters.push({outputIndex:0, inputIndex:5, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:6, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:7, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:8, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:9, filterIndex:4, filterValue:regularity});
                break;
            case "preterite":
            case "preterite tense":
                filters.push({outputIndex:0, inputIndex:11, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:12, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:13, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:14, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:15, filterIndex:10, filterValue:regularity});
                break;
            case "imperfect":
            case "imperfect tense":
                filters.push({outputIndex:0, inputIndex:17, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:18, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:19, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:20, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:21, filterIndex:16, filterValue:regularity});
                break;
            default:
            case "all":
                filters.push({outputIndex:0, inputIndex:3, filterIndex:2, filterValue:regularity});

                filters.push({outputIndex:0, inputIndex:5, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:6, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:7, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:8, filterIndex:4, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:9, filterIndex:4, filterValue:regularity});
                
                filters.push({outputIndex:0, inputIndex:11, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:12, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:13, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:14, filterIndex:10, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:15, filterIndex:10, filterValue:regularity});
                
                filters.push({outputIndex:0, inputIndex:17, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:18, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:19, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:20, filterIndex:16, filterValue:regularity});
                filters.push({outputIndex:0, inputIndex:21, filterIndex:16, filterValue:regularity});
                break;
        }
    }

    // Filter terms
    let results = [];   // Format: [[<output label>, <output>, <input label>, <input>]]
    for (let filter of filters) {
        // Iterate over terms (minus headers)
        for (let term of terms.slice(1)) {
            // Check against filters
            if (term[filter.filterIndex].match(filter.filterValue)) {
                results.push([terms[0][filter.outputIndex], term[filter.outputIndex], terms[0][filter.inputIndex], term[filter.inputIndex]]);
            }
        }
    }
    return results;
}
