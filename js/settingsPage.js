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
            <page-header @click1="$emit('back', referer);" icon1="x"></page-header>
            <main>
                <h1>Settings</h1>
                <settings-input></settings-input>
            </main>
        </div>
    `,
});
