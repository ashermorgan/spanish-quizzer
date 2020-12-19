let filterInput = Vue.component("filterInput", {
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
                <h1>Choose your settings and then click start.</h1>

                <h2>
                    Verb Filters
                    <button @click="AddFilter();">Add Filter</button>
                </h2>

                <div v-for="(filter, index) in verbFilters" class="filter">
                    <select v-model="filter.tense">
                        <option>All Tenses</option>
                        <option>Present Participles</option>
                        <option>Past Participles</option>
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
        </div>
    `,
});
