/**
 * Start a new quizzer session
 */
function CreateSession() {
    // Get prompts
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
    }
    else if (app.state == "verbSettings") {
        // Get prompts
        app.prompts = Shuffle(ApplyVerbFilter(Sets["Verbs"], app.verbFilters));
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



/**
 * Resume the previous quizzer session.
 */
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



/**
 * Perform validation checks and then start the quizzer.
 */
function StartSession() {
    // Validate prompts and promptIndex
    if (!app.prompts) {
        throw "Bad arguments.";
    }
    else if (app.prompts.length == 0) {
        throw "Terms is empty.";
    }
    else if (isNaN(app.promptIndex) || app.promptIndex < 0 || app.promptIndex >= app.prompts.length) {
        throw "Bad arguments.";
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
}



/**
 * Filter a vocab set.
 * @param {Array} vocabSet - The vocab set to filter.
 * @param {String} name - The name of the filter.
 */
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



/**
 * Filter verb conjugations.
 * @param {Array} terms - The list of verb conjugations to filter.
 * @param {Array} filterInfo - A list of filters,
 */
function ApplyVerbFilter(terms, filterInfo) {
    // Expand "All Tenses" filters
    let filters = [];   // Format: [{tense:"specific tense", subject:"specific subject", type:"regex"}]
    for (let filter of filterInfo) {
        if (filter.tense.toLowerCase() == "all tenses") {
            filters.push({ tense: "present participles", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "present tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "preterite tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "imperfect tense", type: filter.type, subject: filter.subject, direction: filter.direction });
        }
        else {
            filters.push({ tense: filter.tense.toLowerCase(), type: filter.type, subject: filter.subject, direction: filter.direction });
        }
    }
    
    // Expand "All Subjects" filters
    for (let filter of filters) {
        if (filter.subject.toLowerCase() == "all subjects" && filter.tense != "present participles") {
            filter.subject = "yo";
            filters.push({ tense: filter.tense, type: filter.type, subject: "tú", direction: filter.direction });
            filters.push({ tense: filter.tense, type: filter.type, subject: "él", direction: filter.direction });
            filters.push({ tense: filter.tense, type: filter.type, subject: "nosotros", direction: filter.direction });
            filters.push({ tense: filter.tense, type: filter.type, subject: "ellos", direction: filter.direction });
        }
        else {
            filter.subject = filter.subject.toLowerCase();
        }
    }

    // Replace regularities with regex filters
    for (let filter of filters) {
        switch (filter.type.toLowerCase()) {
            case "regular":
                filter.type = "Regular";
                break;
            case "reflexive":
                filter.type = "Reflexive";
                break;
            case "irregular":
                filter.type = "Irregular";
                break;
            case "stem changing":
                filter.type = "Stem.?Changing";
                break;
            case "orthographic":
                filter.type = "Orthographic";
                break;
            case "nonregular":
                filter.type = "Irregular|Stem.?Changing|Orthographic";
                break;
            case "all types":
                filter.type = ".*";
                break;
            default:
                throw `Unrecognized filter: ${filter.type}.`;
        }
    }

    // Create io filters
    let ioFilters = [];   // Format: [{outputIndex:0, inputIndex:0, filterIndex:0, filterValue:"regex"}]
    for (let filter of filters) {
        // Get output index
        let outputIndex;
        if (filter.direction.toLowerCase().includes("eng")) {
            outputIndex = 0;
        }
        else if (filter.direction.toLowerCase().includes("esp")) {
            outputIndex = 1;
        }

        // Get input index and filter index
        let inputIndex;
        let filterIndex;
        switch (filter.tense) {
            case "present participles":
                filterIndex = 2;
                inputIndex = 3;
                break;
            case "present tense":
                filterIndex = 4;
                switch (filter.subject) {
                    case "yo":
                        inputIndex = 5;
                        break;
                    case "tú":
                        inputIndex = 6;
                        break;
                    case "él":
                        inputIndex = 7;
                        break;
                    case "nosotros":
                        inputIndex = 8;
                        break;
                    case "ellos":
                        inputIndex = 9;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "preterite tense":
                filterIndex = 10;
                switch (filter.subject) {
                    case "yo":
                        inputIndex = 11;
                        break;
                    case "tú":
                        inputIndex = 12;
                        break;
                    case "él":
                        inputIndex = 13;
                        break;
                    case "nosotros":
                        inputIndex = 14;
                        break;
                    case "ellos":
                        inputIndex = 15;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "imperfect tense":
                filterIndex = 16;
                switch (filter.subject) {
                    case "yo":
                        inputIndex = 17;
                        break;
                    case "tú":
                        inputIndex = 18;
                        break;
                    case "él":
                        inputIndex = 19;
                        break;
                    case "nosotros":
                        inputIndex = 20;
                        break;
                    case "ellos":
                        inputIndex = 21;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            default:
                throw `Unrecognized tense: ${filter.tense}.`;
        }

        // Create filter
        if (filter.direction.toLowerCase().startsWith("conj")) {
            // Swap input and output
            ioFilters.push({outputIndex:inputIndex, inputIndex:outputIndex, filterIndex:filterIndex, filterValue:filter.type})
        }
        else {
            ioFilters.push({outputIndex:outputIndex, inputIndex:inputIndex, filterIndex:filterIndex, filterValue:filter.type})
        }
    }

    // Filter terms
    let results = [];   // Format: [[<output label>, <output>, <input label>, <input>]]
    for (let filter of ioFilters) {
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



/**
 * Shuffles an array of items.
 * @param {Array} items - The array.
 */
function Shuffle(items) {
    // Initialize variables
    var currentIndex = items.length;
    var temp;
    var randomIndex;
    
    // While there are more elements to shuffle
    while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        // Swap the two elements
        temp = items[currentIndex];
        items[currentIndex] = items[randomIndex];
        items[randomIndex] = temp;
    }

    // Return shuffled items
    return items;
}
