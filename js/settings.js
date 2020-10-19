let settings = Vue.component("settings", {
    props: {
        category: {
            type: Boolean,
            default: "verbs",
        },
    },

    data: function() {
        return {
            darkTheme: document.body.classList.contains("dark"),
            verbFilters: [],
            vocabFilters: [],
            promptType: localStorage.getItem("promptType") || "Text",
            inputType: localStorage.getItem("inputType") || "Text",
            onMissedPrompt: localStorage.getItem("onMissedPrompt") || "Correct me",
            repeatPrompts: localStorage.getItem("repeatPrompts") || "Never",
        };
    },

    methods: {
        /**
         * Add a filter to the settings page.
         */
        AddFilter: function() {
            if (this.category === "verbs") {
                this.verbFilters.push({tense:"All Tenses", type:"All Types", subject:"All Subjects", direction:"Eng. → Conj."});
            }
            else if (this.category === "vocab") {
                this.vocabFilters.push({set:"Verbs", type:"All Types", direction:"Eng. ↔ Esp."});
            }
        },

        /**
         * Remove a filter from the settings page.
         * @param {Number} index - The index of the verb filter.
         */
        RemoveFilter: function(index) {
            if (this.category === "verbs") {
                this.verbFilters.splice(index, 1);
            }
            else if (this.category === "vocab") {
                this.vocabFilters.splice(index, 1);
            }
        },

        /**
         * Get the regularity filters available for a verb filter.
         * @param {Number} index - The index of the verb filter.
         * @returns {object} - An object with boolean properties for each regularity filter.
         */
        getTenseTypes: function(index) {
            // Get filter options
            let filters = {"All Types":true, "Reflexive":true, "Regular":true, "Nonregular":true, "Stem Changing":true, "Orthographic":true, "Irregular":true}
            switch(this.verbFilters[index].tense)
            {
                case "All Tenses":
                    break;
                case "Present Participles":
                    filters["Reflexive"] = false;       // Reflexive
                    filters["Orthographic"] = false;    // Orthographic
                    break;
                case "Present Tense":
                    filters["Orthographic"] = false;    // Orthographic
                    break;
                case "Preterite Tense":
                    break;
                case "Imperfect Tense":
                    filters["Stem Changing"] = false;   // Stem Changing
                    filters["Orthographic"] = false;    // Orthographic
                    break;
            }

            // Reset type if needed
            if (!filters[this.verbFilters[index].type]) {
                this.verbFilters[index].type = "All Types";
            }

            // Return filters
            return filters;
        },

        /**
         * Get the subject filters available for a verb filter.
         * @param {Number} index - The index of the verb filter.
         * @returns {object} - An object with boolean properties for each subject filter.
         */
        getTenseSubjects: function(index) {
            // Set default filters
            let filters = {"All Subjects":true, "Yo":true, "Tú":true, "Él":true, "Nosotros":true, "Ellos":true}
            
            if (this.verbFilters[index].tense === "Present Participles") {
                // Override filters
                filters["Yo"] = false;
                filters["Tú"] = false;
                filters["Él"] = false;
                filters["Nosotros"] = false;
                filters["Ellos"] = false;
                
                // Reset subject
                this.verbFilters[index].subject = "All Subjects";
            }

            // Return filters
            return filters;
        },

        /**
         * Get the filters available for a vocab Set.
         * @param {Number} index - The index of the vocab filter.
         * @returns {Array} - An array containing available filters.
         */
        getSetFilters: function(index) {
            // Get filter options
            let filters = {"All Types":true, "Adjectives":true, "Nouns":true, "Verbs":true}
            switch(this.vocabFilters[index].set)
            {
                case "Verbs":
                    filters["Adjectives"] = false;
                    filters["Nouns"] = false;
                    filters["Verbs"] = false;
                    break;
                
                case "Adjectives":
                    filters["Nouns"] = false;
                    filters["Verbs"] = false;
                    break;

                case "Adverbs":
                    filters["Adjectives"] = false;
                    filters["Nouns"] = false;
                    filters["Verbs"] = false;
                    break;

                case "Prepositions":
                case "Transitions":
                case "Questions":
                    filters["Adjectives"] = false;
                    filters["Nouns"] = false;
                    filters["Verbs"] = false;
                    break;
                
                case "Colors":
                    filters["Nouns"] = false;
                    filters["Verbs"] = false;
                    break;
                
                case "Days":
                case "Months":
                    filters["Adjectives"] = false;
                    filters["Verbs"] = false;
                    break;
                
                case "Weather":
                case "Professions":
                    filters["Adjectives"] = false;
                    break;

                case "Family":
                case "Clothes":
                    filters["Verbs"] = false;
                    break;
                
                case "Nature":
                case "House":
                case "Vacation":
                case "Childhood":
                case "Health":
                    break;
            }

            // Reset type if needed
            if (!filters[this.vocabFilters[index].type]) {
                this.vocabFilters[index].type = "All Types";
            }

            // Return filters
            return filters;
        },

        /**
         * Start a new quizzer session
         */
        CreateSession: function() {
            // Get prompts
            let prompts;
            if (this.category === "vocab") {
                // Filter and load Sets into prompts
                prompts = [];
                for (let filter of this.vocabFilters)
                {
                    // Add filtered set
                    prompts.push(...ApplyVocabFilter(Sets[filter.set], filter.type, filter.direction));
                }

                // Shuffle prompts
                prompts = Shuffle(prompts);
            }
            else if (this.category === "verbs") {
                // Get prompts
                prompts = Shuffle(ApplyVerbFilter(Sets["Verbs"], this.verbFilters));
            }

            // Set progress
            let promptIndex = 0;

            // Validate prompts
            if (prompts.length === 0) {
                alert("Your custom vocabulary set must contain at least one term.");
                return;
            }
            
            // Start quizzer
            this.$emit("start-session", prompts, promptIndex, this.promptType, this.inputType, this.onMissedPrompt, this.repeatPrompts);
        },

        /**
         * Resume the previous quizzer session.
         */
        ResumeSession: function() {
            // Get localStorage prefix
            let prefix;
            if (this.category === "vocab") {
                prefix = "vocab-"
            }
            else if (this.category === "verbs") {
                prefix = "verb-"
            }

            // Load prompts and progress
            let prompts = JSON.parse(localStorage.getItem(prefix + "prompts"));
            let promptIndex = parseInt(localStorage.getItem(prefix + "prompt"));

            // Validate prompts and promptIndex
            if (!prompts) {
                alert("An error occured while resuming the previous session.");
                return;
            }
            else if (prompts.length === 0) {
                alert("Your custom vocabulary set must contain at least one term.");
                return;
            }
            else if (isNaN(promptIndex) || promptIndex < 0 || promptIndex >= prompts.length) {
                alert("An error occured while resuming the previous session.");
                return;
            }

            // Start quizzer
            this.$emit("start-session", prompts, promptIndex, this.promptType, this.inputType, this.onMissedPrompt, this.repeatPrompts);
        },
    },

    watch: {
        /**
         * Update the app theme.
         */
        darkTheme: function(value) {
            SetTheme(value);
        },

        /**
         * Update the promptType setting in localStorage.
         * @param {String} value - The prompt type.
         */
        promptType: function(value) {
            localStorage.setItem("promptType", value);
        },

        /**
         * Update the inputType setting in localStorage.
         * @param {String} value - The input type.
         */
        inputType: function(value) {
            localStorage.setItem("inputType", value);
        },

        /**
         * Update the onMissedPrompt setting in localStorage.
         * @param {String} value - The onMissedPrompt setting value.
         */
        onMissedPrompt: function(value) {
            localStorage.setItem("onMissedPrompt", value);
        },

        /**
         * Update the repeatPrompts setting in localStorage.
         * @param {String} value - The repeat prompts setting value.
         */
        repeatPrompts: function(value) {
            localStorage.setItem("repeatPrompts", value);
        },
    },
    
    template: `
        <div class="settings">
            <div class="verbSettings" v-show="category === 'verbs'">
                <h1>Choose your settings and then click start.</h1>

                <h2>
                    Verb Filters
                    <button @click="AddFilter();">Add Filter</button>
                </h2>
                
                <div v-for="(filter, index) in verbFilters" class="filter">
                    <select v-model="filter.tense">
                        <option>All Tenses</option>
                        <option>Present Participles</option>
                        <option>Present Tense</option>
                        <option>Preterite Tense</option>
                        <option>Imperfect Tense</option>
                    </select>
                    <select v-model="filter.type">
                        <option v-for="(available, type) in getTenseTypes(index)" :disabled="!available">{{ type }}</option>
                    </select>
                    <select v-model="filter.subject">
                        <option v-for="(available, subject) in getTenseSubjects(index)" :disabled="!available">{{ subject }}</option>
                    </select>
                    <select v-model="filter.direction">
                        <option>Eng. → Conj.</option>
                        <option>Esp. → Conj.</option>
                        <option>Conj. → Eng.</option>
                        <option>Conj. → Esp.</option>
                    </select>
                    <button class="itemRemove" @click="RemoveFilter(index);">╳</button>
                </div>
            </div>


            <div class="vocabSettings" v-show="category === 'vocab'">
                <h1>Choose your settings and then click start.</h1>

                <h2>
                    Vocabulary Sets
                    <button @click="AddFilter();">Add set</button>
                </h2>

                <div v-for="(filter, index) in vocabFilters" class="filter">
                    <select class="vocabSetName" v-model="filter.set">
                        <optgroup label="Common Words">
                            <option>Verbs</option>
                            <option>Adjectives</option>
                            <option>Adverbs</option>
                            <option>Prepositions</option>
                            <option>Transitions</option>
                        </optgroup>
                        <optgroup label="Spanish 1">
                            <option>Colors</option>
                            <option>Days</option>
                            <option>Months</option>
                            <option>Questions</option>
                            <option>Weather</option>
                            <option>Family</option>
                            <option>Clothes</option>
                        </optgroup>
                        <optgroup label="Spanish 2">
                            <option>Nature</option>
                            <option>House</option>
                            <option>Vacation</option>
                            <option>Childhood</option>
                            <option>Professions</option>
                            <option>Health</option>
                        </optgroup>
                    </select>
                    <select v-model="filter.type">
                        <option v-for="(available, type) in getSetFilters(index)" :disabled="!available">{{ type }}</option>
                    </select>
                    <select v-model="filter.direction">
                        <option>Eng. ↔ Esp.</option>
                        <option>Eng. → Esp.</option>
                        <option>Esp. → Eng.</option>
                    </select>
                    <button class="itemRemove" @click="RemoveFilter(index);">╳</button>
                </div>
            </div>


            <div class="quizzerSettings">
                <h2>Quizzer Settings</h2>

                <div>
                    <input type="checkbox" id="settingsDarkTheme" v-model="darkTheme">
                    <label for="settingsDarkTheme">Dark Mode</label>
                </div>
                <div>
                    <label for="settingsPromptType">Prompt type</label>
                    <select id="settingsPromptType" v-model="promptType">
                        <option>Text</option>
                        <option>Audio</option>
                        <option>Both</option>
                    </select>
                </div>
                <div>
                    <label for="settingsInputType">Input type</label>
                    <select id="settingsInputType" v-model="inputType">
                        <option>Text</option>
                        <option>Voice</option>
                        <option>Either</option>
                    </select>
                </div>
                <div>
                    <label for="settingsRepeatPrompts">When I miss a prompt</label>
                    <select id="settingsRepeatPrompts" v-model="onMissedPrompt">
                        <option>Correct me</option>
                        <option>Tell me</option>
                        <option>Ignore it</option>
                    </select>
                </div>
                <div>
                    <label for="settingsRepeatPrompts">Repeat missed prompts</label>
                    <select id="settingsRepeatPrompts" v-model="repeatPrompts">
                        <option>Never</option>
                        <option>Immediately</option>
                        <option>5 prompts later</option>
                        <option>At the end</option>
                    </select>
                </div>
            </div>

            <div class="settingButtons">
                <button class="settingsStart" @click="CreateSession();">Start</button>
                <button class="settingsResume" @click="ResumeSession();">Resume</button>
            </div>
        </div>
    `,
});



/**
 * Filter a vocab set.
 * @param {Array} vocabSet - The vocab set to filter.
 * @param {String} type - The word type filter.
 * @param {String} direction - The direction filter.
 * @returns {Array} - A list of prompts.
 */
function ApplyVocabFilter(terms, type, direction) {
    // Get type regex filter
    let regularity;
    switch (type.toLowerCase()) {
        case "adjectives":
            regularity = "Adjective";
            break;
        case "nouns":
            regularity = "Noun";
            break;
        case "verbs":
            regularity = "Verb";
            break;
        case "all types":
            regularity = ".*";
            break;
        default:
            throw `Unrecognized filter: ${type}.`;
    }

    // Filter terms
    let results = [];   // Format: [[<output label>, <output>, <input label>, <input>]]
    for (let term of terms.slice(1)) {
        // Check against filters
        if (term[2].match(regularity)) {
            if (direction === "Eng. ↔ Esp.") {
                results.push([terms[0][0], term[0], terms[0][1], term[1]]);
                results.push([terms[0][1], term[1], terms[0][0], term[0]]);
            }
            else if (direction === "Eng. → Esp.") {
                results.push([terms[0][0], term[0], terms[0][1], term[1]]);
            }
            else if (direction === "Esp. → Eng.") {
                results.push([terms[0][1], term[1], terms[0][0], term[0]]);
            }
            else {
                throw `Unrecognized direction: ${direction}.`;
            }
        }
    }
    return results;
}



/**
 * Filter verb conjugations.
 * @param {Array} terms - The list of verb conjugations to filter.
 * @param {Array} filterInfo - A list of filters.
 * @returns {Array} - A list of prompts.
 */
function ApplyVerbFilter(terms, filterInfo) {
    // Expand "All Tenses" filters
    let filters = [];   // Format: [{tense:"specific tense", subject:"specific subject", type:"regex"}]
    for (let filter of filterInfo) {
        if (filter.tense.toLowerCase() === "all tenses") {
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
        if (filter.subject.toLowerCase() === "all subjects" && filter.tense !== "present participles") {
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
