// filter-input component
const filterInput = Vue.component("filterInput", {
    props: {
        category: {
            type: String,
            default: "verbs",
        },
    },

    computed: {
        value: function() {
            if (this.category === "verbs") {
                return this.verbFilters;
            }
            else if (this.category === "vocab") {
                return this.vocabFilters;
            }
        }
    },

    data: function() {
        return {
            verbFilters: [],
            vocabFilters: [],
        };
    },

    watch: {
        value: {
            handler: function(value) {
                this.$emit("input", value);
            },
            deep: true,
        },
    },

    methods: {
        /**
         * Add a filter to the filters page.
         */
        AddFilter: function() {
            if (this.category === "verbs") {
                this.verbFilters.push({tense:"All Tenses", type:"All Types", subject:"All Subjects", direction:"Eng. → Conj."});
            }
            else if (this.category === "vocab") {
                this.vocabFilters.push({category:"All Categories", type:"All Types", direction:"Eng. ↔ Esp."});
            }
        },

        /**
         * Remove a filter from the filters page.
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
                    filters["Reflexive"] = false;
                    filters["Orthographic"] = false;
                    break;
                case "Past Participles":
                    filters["Reflexive"] = false;
                    filters["Stem Changing"] = false;
                    filters["Orthographic"] = false;
                    break;
                case "Present Tense":
                    filters["Orthographic"] = false;
                    break;
                case "Preterite Tense":
                    break;
                case "Imperfect Tense":
                    filters["Stem Changing"] = false;
                    filters["Orthographic"] = false;
                    break;
                case "Simple Future Tense":
                    filters["Stem Changing"] = false;
                    filters["Orthographic"] = false;
                    break;
                case "Present Subjunctive Tense":
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

            if (["Present Participles", "Past Participles"].includes(this.verbFilters[index].tense)) {
                // Override filters
                filters["Yo"] = false;
                filters["Tú"] = false;
                filters["Él"] = false;
                filters["Nosotros"] = false;
                filters["Ellos"] = false;
            }

            // Reset subject
            if (["Present Participles", "Past Participles"].includes(this.verbFilters[index].tense) && this.verbFilters[index].subject !== "Type") {
                this.verbFilters[index].subject = "All Subjects";
            }

            // Return filters
            return filters;
        },

        /**
         * Get the filters available for a vocab category.
         * @param {Number} index - The index of the vocab filter.
         * @returns {Array} - An array containing available filters.
         */
        getCategoryFilters: function(index) {
            // Get filter options
            let filters = {"All Types":true, "Adjectives":true, "Nouns":true, "Verbs":true}
            switch(this.vocabFilters[index].category)
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
                case "Numbers":
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
                case "Food":
                case "Health":
                    break;
            }

            // Reset type if needed
            if (!filters[this.vocabFilters[index].type]) {
                this.vocabFilters[index].type = "All Types";
            }

            // Return filters
            return filters;
        }
    },

    template: `
        <div class="filtersInput" ref="container">
            <div class="verbSettings" v-show="category === 'verbs'">
                <h1>
                    Verb Filters
                    <button title="Add filter" class="icon" @click="AddFilter();"><img src="./images/plus.svg" alt=""></button>
                </h1>

                <div v-for="(filter, index) in verbFilters" class="filter">
                    <select v-model="filter.tense">
                        <option>All Tenses</option>
                        <option>Present Participles</option>
                        <option>Past Participles</option>
                        <option>Present Tense</option>
                        <option>Preterite Tense</option>
                        <option>Imperfect Tense</option>
                        <option>Simple Future Tense</option>
                        <option>Present Subjunctive Tense</option>
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
                    <button title="Remove filter" class="icon" @click="RemoveFilter(index);"><img src="./images/trash.svg" alt=""></button>
                </div>
            </div>


            <div class="vocabSettings" v-show="category === 'vocab'">
                <h1>
                    Vocabulary Filters
                    <button title="Add filter" class="icon" @click="AddFilter();"><img src="./images/plus.svg" alt=""></button>
                </h1>

                <div v-for="(filter, index) in vocabFilters" class="filter">
                    <select class="vocabSetName" v-model="filter.category">
                        <option>All Categories</option>
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
                            <option>Numbers</option>
                            <option>Questions</option>
                        </optgroup>
                        <optgroup label="Advanced Words">
                            <option>Childhood</option>
                            <option>Clothes</option>
                            <option>Family</option>
                            <option>Food</option>
                            <option>Health</option>
                            <option>House</option>
                            <option>Nature</option>
                            <option>Professions</option>
                            <option>Vacation</option>
                            <option>Weather</option>
                        </optgroup>
                    </select>
                    <select v-model="filter.type">
                        <option v-for="(available, type) in getCategoryFilters(index)" :disabled="!available">{{ type }}</option>
                    </select>
                    <select v-model="filter.direction">
                        <option>Eng. ↔ Esp.</option>
                        <option>Eng. → Esp.</option>
                        <option>Esp. → Eng.</option>
                    </select>
                    <button title="Remove filter" class="icon" @click="RemoveFilter(index);"><img src="./images/trash.svg" alt=""></button>
                </div>
            </div>
        </div>
    `,
});



// filters-page component
const filtersPage = Vue.component("filtersPage", {
    props: {
        category: {
            type: String,
            default: "verbs",
        }
    },

    data: function() {
        return {
            filters: [],
            settings: getSettings(),
        };
    },

    methods: {
        /**
         * Start a new quizzer session
         */
        StartSession: function() {
            // Get prompts
            let prompts;
            if (this.category === "vocab") {
                prompts = Shuffle(ApplyFilters(this.$root.$data.data.vocab, GetVocabFilters(this.filters), this.settings));
            }
            else if (this.category === "verbs") {
                // Get prompts
                prompts = Shuffle(ApplyFilters(this.$root.$data.data.verbs, GetVerbFilters(this.filters), this.settings));
            }

            // Set progress
            let promptIndex = 0;

            // Validate prompts
            if (prompts.length === 0) {
                alert("You must have at least one filter.");
                return;
            }

            // Validate browser for voice input
            if (this.settings.inputType !== "Text") {
                if ((window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition) === undefined) {
                    alert("Your browser does not support voice input.");
                    return;
                }
            }

            // Start quizzer
            this.$router.push({name:"quizzer", params:{startingPrompts:prompts, startingIndex:promptIndex, settings:this.settings, referer:this.category}});
        },

        /**
         * Handle a keyup event (implements some keyboard shortcuts).
         * @param {object} e - The event args.
         */
        keyup: function(e) {
            if (this._inactive) return;
            if (e.key === "s") this.StartSession();
        }
    },

    created: function() {
        // Add keyup handler
        window.addEventListener("keyup", this.keyup);
    },

    activated: function() {
        // Add 1 filter by default
        if (this.filters.length === 0) this.$refs.filters.AddFilter();
    },

    destroyed: function() {
        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },

    template: `
        <div class="filtersPage">
            <page-header icon1="arrow-left" label1="Back" @click1="$emit('back');"
                icon2="settings" label2="Settings" @click2="$router.push({name:'settings', params:{referer:$route.name}})"></page-header>
            <main>
                <filter-input ref="filters" :category="category" v-model="filters"></filter-input>
                <h1>Quizzer Settings</h1>
                <settings-input v-model="settings"></settings-input>
                <button class="settingsStart" @click="StartSession();">Start</button>
            </main>
        </div>
    `,
});
