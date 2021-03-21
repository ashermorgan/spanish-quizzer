// settings-input component
const settingsInput = Vue.component("settingsInput", {
    props: {
        value: {
            type: Object,
            default: getSettings(),
        },
    },

    watch: {
        value: {
            handler: function(value) {
                setSettings(value);

                this.$emit("input", value);
            },
            deep: true,
        },
    },

    activated: function() {
        // Refresh settings
        this.value = getSettings();
    },

    template: `
        <div class="settingsInput" ref="container">
            <div class="appearanceSettings">
                <h2>Appearance</h2>
                <div>
                    <input type="checkbox" id="settingsDarkTheme" v-model="value.darkTheme">
                    <label for="settingsDarkTheme">Dark Mode</label>
                </div>
                <div>
                    <input type="checkbox" id="settingsConjugationColors" v-model="value.conjugationColors">
                    <label for="settingsConjugationColors">Colored conjugations in reference tables</label>
                </div>
            </div>

            <div class="quizzerPromptsSettings">
                <h2>Quizzer Prompts</h2>
                <div>
                    <label for="settingsPromptType">Prompt type</label>
                    <select id="settingsPromptType" v-model="value.promptType">
                        <option>Text</option>
                        <option>Audio</option>
                        <option>Both</option>
                    </select>
                </div>
                <div>
                    <label for="settingsInputType">Input type</label>
                    <select id="settingsInputType" v-model="value.inputType">
                        <option>Text</option>
                        <option>Voice</option>
                        <option>Either</option>
                    </select>
                </div>
                <div>
                    <label for="settingsMultiplePrompts">Multiple prompts</label>
                    <select id="settingsMultiplePrompts" v-model="value.multiplePrompts">
                        <option>Show together</option>
                        <option>Show separately</option>
                        <option>Show one</option>
                    </select>
                </div>
                <div>
                    <input type="checkbox" id="settingsRemoveDuplicates" v-model="value.removeDuplicates">
                    <label for="settingsRemoveDuplicates">Remove duplicate prompts</label>
                </div>
            </div>

            <div class="quizzerGradingSettings">
                <h2>Quizzer Grading</h2>
                <div>
                    <label for="settingsOnMissedPrompt">When I miss a prompt</label>
                    <select id="settingsOnMissedPrompt" v-model="value.onMissedPrompt">
                        <option>Correct me</option>
                        <option>Tell me</option>
                        <option>Ignore it</option>
                    </select>
                </div>
                <div>
                    <label for="settingsRepeatPrompts">Repeat missed prompts</label>
                    <select id="settingsRepeatPrompts" v-model="value.repeatPrompts">
                        <option>Never</option>
                        <option>Immediately</option>
                        <option>5 prompts later</option>
                        <option>5 & 10 prompts later</option>
                        <option>At the end</option>
                    </select>
                </div>
                <div>
                    <label for="settingsMultipleAnswers">Multiple answers</label>
                    <select id="settingsMultipleAnswers" v-model="value.multipleAnswers">
                        <option>Require all</option>
                        <option>Require any</option>
                    </select>
                </div>
            </div>

            <div class="defaultFiltersSettings">
                <h2>Default Verb Filter</h2>
                <div>
                    <select v-model="value.defaultFilters.verbs.tense">
                        <option>All Tenses</option>
                        <option>Present Participles</option>
                        <option>Past Participles</option>
                        <option>Present Tense</option>
                        <option>Preterite Tense</option>
                        <option>Imperfect Tense</option>
                        <option>Simple Future Tense</option>
                        <option>Present Subjunctive Tense</option>
                    </select>
                    <select v-model="value.defaultFilters.verbs.type">
                        <option>All Types</option>
                        <option>Reflexive</option>
                        <option>Regular</option>
                        <option>Nonregular</option>
                        <option>Stem Changing</option>
                        <option>Orthographic</option>
                        <option>Irregular</option>
                    </select>
                    <select v-model="value.defaultFilters.verbs.subject">
                        <option>All Subjects</option>
                        <option>Type</option>
                        <option>Yo</option>
                        <option>Tú</option>
                        <option>Él</option>
                        <option>Nosotros</option>
                        <option>Ellos</option>
                    </select>
                    <select v-model="value.defaultFilters.verbs.direction">
                        <option>Eng. → Conj.</option>
                        <option>Esp. → Conj.</option>
                        <option>Conj. → Eng.</option>
                        <option>Conj. → Esp.</option>
                    </select>
                </div>
                <h2>Default Vocab Filter</h2>
                <div>
                    <select v-model="value.defaultFilters.vocab.category">
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
                    <select v-model="value.defaultFilters.vocab.type">
                        <option>All Types</option>
                        <option>Adjectives</option>
                        <option>Nouns</option>
                        <option>Verbs</option>
                    </select>
                    <select v-model="value.defaultFilters.vocab.direction">
                        <option>Eng. ↔ Esp.</option>
                        <option>Eng. → Esp.</option>
                        <option>Esp. → Eng.</option>
                    </select>
                </div>
            </div>
        </div>
    `,
});



// settings-page component
const settingsPage = Vue.component("settingsPage", {
    props: {
        referer: {
            type: String,
            default: "home",
        },
    },

    template: `
        <div class="settingsPage">
            <page-header @click1="$emit('back', referer);" icon1="x" label1="Back"></page-header>
            <main>
                <h1>Settings</h1>
                <settings-input></settings-input>
            </main>
        </div>
    `,
});
