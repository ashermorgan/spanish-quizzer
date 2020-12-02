let settings = Vue.component("settings", {
    props: {
        category: {
            type: String,
            default: "verbs",
        },
    },

    data: function() {
        return {
            verbFilters: [],
            vocabFilters: [],
            settings: getSettings(),
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
                this.vocabFilters.push({set:"All Sets", type:"All Types", direction:"Eng. ↔ Esp."});
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
                case "Simple Future Tense":
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
            let filters = {"All Subjects":true, "Type":true, "Yo":true, "Tú":true, "Él":true, "Nosotros":true, "Ellos":true}

            if (this.verbFilters[index].tense === "Present Participles") {
                // Override filters
                filters["Yo"] = false;
                filters["Tú"] = false;
                filters["Él"] = false;
                filters["Nosotros"] = false;
                filters["Ellos"] = false;
            }

            // Reset subject
            if (this.verbFilters[index].tense === "Present Participles" && this.verbFilters[index].subject !== "Type") {
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
                prompts = Shuffle(ApplyFilters(Sets, GetVocabFilters(this.vocabFilters), this.settings.multiplePrompts));
            }
            else if (this.category === "verbs") {
                // Get prompts
                prompts = Shuffle(ApplyFilters(Sets, GetVerbFilters(this.verbFilters), this.settings.multiplePrompts));
            }

            // Set progress
            let promptIndex = 0;

            // Validate prompts
            if (prompts.length === 0) {
                alert("Your custom vocabulary set must contain at least one term.");
                return;
            }

            // Start quizzer
            this.$emit("start-session", prompts, promptIndex, this.settings);
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
            this.$emit("start-session", prompts, promptIndex, this.settings);
        },

        /**
         * Implements keyboard shortcuts.
         */
        keyup: function(e) {
            try {
                if (window.getComputedStyle(this.$refs.container).display === "none") {
                    return;
                }
            }
            catch {
                // Will fail if not mounted
                return;
            }

            if (e.key === "s") {
                this.CreateSession();
            }
            if (e.key === "r") {
                this.ResumeSession();
            }
        }
    },

    watch: {
        settings: {
            handler: function(value) {
                setSettings(value);
            },
            deep: true,
        },
    },

    created: function() {
        // Add keyup handler
        window.addEventListener("keyup", this.keyup);
    },

    destroyed: function() {
        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },

    template: `
        <div class="settings" ref="container">
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
                        <option>Simple Future Tense</option>
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
                        <option>All Sets</option>
                        <optgroup label="Common Words">
                            <option>Adjectives</option>
                            <option>Adverbs</option>
                            <option>Prepositions</option>
                            <option>Transitions</option>
                            <option>Verbs</option>
                        </optgroup>
                        <optgroup label="Basic Words">
                            <option>Colors</option>
                            <option>Days</option>
                            <option>Months</option>
                            <option>Questions</option>
                        </optgroup>
                        <optgroup label="Advanced Words">
                            <option>Childhood</option>
                            <option>Clothes</option>
                            <option>Family</option>
                            <option>Health</option>
                            <option>House</option>
                            <option>Nature</option>
                            <option>Professions</option>
                            <option>Vacation</option>
                            <option>Weather</option>
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
                    <input type="checkbox" id="settingsDarkTheme" v-model="settings.darkTheme">
                    <label for="settingsDarkTheme">Dark Mode</label>
                </div>
                <div>
                    <label for="settingsPromptType">Prompt type</label>
                    <select id="settingsPromptType" v-model="settings.promptType">
                        <option>Text</option>
                        <option>Audio</option>
                        <option>Both</option>
                    </select>
                </div>
                <div>
                    <label for="settingsInputType">Input type</label>
                    <select id="settingsInputType" v-model="settings.inputType">
                        <option>Text</option>
                        <option>Voice</option>
                        <option>Either</option>
                    </select>
                </div>
                <div>
                    <label for="settingsOnMissedPrompt">When I miss a prompt</label>
                    <select id="settingsOnMissedPrompt" v-model="settings.onMissedPrompt">
                        <option>Correct me</option>
                        <option>Tell me</option>
                        <option>Ignore it</option>
                    </select>
                </div>
                <div>
                    <label for="settingsRepeatPrompts">Repeat missed prompts</label>
                    <select id="settingsRepeatPrompts" v-model="settings.repeatPrompts">
                        <option>Never</option>
                        <option>Immediately</option>
                        <option>5 prompts later</option>
                        <option>At the end</option>
                    </select>
                </div>
                <div>
                    <label for="settingsMultiplePrompts">Multiple prompts</label>
                    <select id="settingsMultiplePrompts" v-model="settings.multiplePrompts">
                        <option>Show together</option>
                        <option>Show separately</option>
                        <option>Show one</option>
                    </select>
                </div>
                <div>
                    <label for="settingsMultipleAnswers">Multiple answers</label>
                    <select id="settingsMultipleAnswers" v-model="settings.multipleAnswers">
                        <option>Require all</option>
                        <option>Require any</option>
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
