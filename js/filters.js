/**
 * Create io-filters from an array of vocab filters.
 * @param {Array} rawFilters The array of filters.
 * @returns {Array} The io-filters.
 */
function GetVocabFilters(rawFilters) {
    // Expand "All directions" filters
    let filters = [];
    for (let filter of rawFilters) {
        if (filter.direction === "Eng. ↔ Esp.") {
            filters.push({category:filter.category, type: filter.type, direction:"Eng. → Esp."});
            filters.push({category:filter.category, type: filter.type, direction:"Esp. → Eng."});
        }
        else {
            filters.push({category:filter.category, type: filter.type, direction:filter.direction});
        }
    }

    // Get category regex filter
    for (let filter of filters) {
        if (filter.category === "All Categories") {
            filter.category = ".*";
        }
    }

    // Get type regex filter
    for (let filter of filters) {
        switch (filter.type.toLowerCase()) {
            case "adjectives":
                filter.type = "Adjective";
                break;
            case "nouns":
                filter.type = "Noun";
                break;
            case "verbs":
                filter.type = "Verb";
                break;
            case "all types":
                filter.type = ".*";
                break;
            default:
                throw `Unrecognized filter: ${type}.`;
        }
    }

    // Create io-filters
    let ioFilters = [];   // Format: [{outputIndex:0, inputIndex:0, filters:[{index:0, value:"regex"}]}]
    for (let filter of filters) {
        // Create filter
        if (filter.direction.toLowerCase().startsWith("eng")) {
            ioFilters.push({outputIndex:0, inputIndex:1, filters:[{index:2, value:filter.type}, {index:3, value:filter.category}]});
        }
        else {
            ioFilters.push({outputIndex:1, inputIndex:0, filters:[{index:2, value:filter.type}, {index:3, value:filter.category}]});
        }
    }

    // Return io-filters
    return ioFilters;
}



/**
 * Create io-filters from an array of verb filters.
 * @param {Array} rawFilters The array of filters.
 * @returns {Array} The io-filters.
 */
function GetVerbFilters(rawFilters) {
    // Expand "All Tenses" filters
    let filters = [];   // Format: [{tense:"specific tense", subject:"specific subject", type:"regex"}]
    for (let filter of rawFilters) {
        if (filter.tense.toLowerCase() === "all tenses") {
            filters.push({ tense: "present participles", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "past participles", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "present tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "preterite tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "imperfect tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "simple future tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "present subjunctive tense", type: filter.type, subject: filter.subject, direction: filter.direction });
            filters.push({ tense: "imperfect subjunctive tense", type: filter.type, subject: filter.subject, direction: filter.direction });
        }
        else {
            filters.push({ tense: filter.tense.toLowerCase(), type: filter.type, subject: filter.subject, direction: filter.direction });
        }
    }

    // Expand "All Subjects" filters
    for (let filter of filters) {
        if (filter.subject.toLowerCase() === "all subjects" && !["present participles", "past participles"].includes(filter.tense)) {
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
                filter.type = "Stem Changing";
                break;
            case "orthographic":
                filter.type = "Orthographic";
                break;
            case "nonregular":
                filter.type = "Irregular|Stem Changing|Orthographic";
                break;
            case "all types":
                filter.type = ".*";
                break;
            default:
                throw `Unrecognized filter: ${filter.type}.`;
        }
    }

    // Create io-filters
    let ioFilters = [];   // Format: [{outputIndex:0, inputIndex:0, filters:[{index:0, value:"regex"}]}]
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
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    default:
                        inputIndex = 3;
                        break;
                }
                break;
            case "past participles":
                filterIndex = 4;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    default:
                        inputIndex = 5;
                        break;
                }
                break;
            case "present tense":
                filterIndex = 6;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 7;
                        break;
                    case "tú":
                        inputIndex = 8;
                        break;
                    case "él":
                        inputIndex = 9;
                        break;
                    case "nosotros":
                        inputIndex = 10;
                        break;
                    case "ellos":
                        inputIndex = 11;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "preterite tense":
                filterIndex = 12;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 13;
                        break;
                    case "tú":
                        inputIndex = 14;
                        break;
                    case "él":
                        inputIndex = 15;
                        break;
                    case "nosotros":
                        inputIndex = 16;
                        break;
                    case "ellos":
                        inputIndex = 17;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "imperfect tense":
                filterIndex = 18;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 19;
                        break;
                    case "tú":
                        inputIndex = 20;
                        break;
                    case "él":
                        inputIndex = 21;
                        break;
                    case "nosotros":
                        inputIndex = 22;
                        break;
                    case "ellos":
                        inputIndex = 23;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "simple future tense":
                filterIndex = 24;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 25;
                        break;
                    case "tú":
                        inputIndex = 26;
                        break;
                    case "él":
                        inputIndex = 27;
                        break;
                    case "nosotros":
                        inputIndex = 28;
                        break;
                    case "ellos":
                        inputIndex = 29;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "present subjunctive tense":
                filterIndex = 30;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 31;
                        break;
                    case "tú":
                        inputIndex = 32;
                        break;
                    case "él":
                        inputIndex = 33;
                        break;
                    case "nosotros":
                        inputIndex = 34;
                        break;
                    case "ellos":
                        inputIndex = 35;
                        break;
                    default:
                        throw `Unrecognized subject: ${filter.subject}.`;
                }
                break;
            case "imperfect subjunctive tense":
                filterIndex = 36;
                switch (filter.subject) {
                    case "type":
                        inputIndex = filterIndex;
                        break;
                    case "yo":
                        inputIndex = 37;
                        break;
                    case "tú":
                        inputIndex = 38;
                        break;
                    case "él":
                        inputIndex = 39;
                        break;
                    case "nosotros":
                        inputIndex = 40;
                        break;
                    case "ellos":
                        inputIndex = 41;
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
            ioFilters.push({outputIndex:inputIndex, inputIndex:outputIndex, filters:[{index:filterIndex, value:filter.type}]})
        }
        else {
            ioFilters.push({outputIndex:outputIndex, inputIndex:inputIndex, filters:[{index:filterIndex, value:filter.type}]})
        }
    }

    // Return io-filters
    return ioFilters;
}



/**
 * Creates an array of prompts from an array of io-filters.
 * @param {Object} terms The terms to filter.
 * @param {Array} filters The io-filters.
 * @returns {Array} The prompts.
 */
function ApplyFilters(terms, filters, options={}) {
    // Set options
    if (!"multiplePrompts" in options) options.multiplePrompts = "Show together";
    if (!"removeDuplicates" in options) options.removeDuplicates = false;

    // Filter terms
    let results = [];   // Format: [[<output label>, <output>, <input label>, <input>]]
    for (let filter of filters) {
        // Iterate over terms (minus headers)
        for (let term of terms.slice(1)) {
            // Check against filters
            let matchesFilter = true;
            for (let filterFilter of filter.filters) {
                if (!term[filterFilter.index].match(filterFilter.value)) {
                    matchesFilter = false;
                }
            }

            // Add prompt
            if (matchesFilter) {
                results.push([terms[0][filter.outputIndex], term[filter.outputIndex], terms[0][filter.inputIndex], term[filter.inputIndex]]);
            }
        }
    }

    // Iterate over prompts to enforce multiplePrompts setting
    for (let result of results) {
        // Get array of prompt outputs
        let prompts = result[1].split(/\s*,\s*/);

        // Check if multiple outputs exist
        if (prompts.length > 1) {
            switch (options.multiplePrompts) {
                case "Show one":
                    // Set current prompt's output to a random prompt
                    result[1] = prompts[Math.floor(Math.random() * (prompts.length - 1))]
                    break;

                case "Show separately":
                    result[1] = prompts[0]; // Set current prompt's output to 1st prompt
                    for (let prompt of prompts.splice(1)) {
                        // Add seperate prompts for extra outputs
                        results.push([result[0], prompt, result[2], result[3]])
                    }
                    break;

                case "Show together":
                default:
                    // Do nothing
                    break;
            }
        }
    }

    // Remove duplicate prompts
    if (options.removeDuplicates) {
        results = results.filter((result, index) => {
            return index === results.findIndex(obj => {
                try {
                    return obj[0] === result[0] && obj[1] === result[1] && obj[2] === result[2] && obj[3] === result[3];
                }
                catch {
                    return false;
                }
            });
        });
    }

    // Return prompts
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
