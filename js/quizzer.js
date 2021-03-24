const quizzer = Vue.component("quizzer", {
    props: {
        startingPrompts: {
            type: Array,
            default: function() {
                return [];
            },
        },
        startingIndex: {
            type: Number,
            default: 0,
        },
        settings: {
            type: Object,
            default: getSettings(),
        },
    },

    data: function() {
        return {
            prompts: this.startingPrompts,
            index: this.startingIndex,
            responce: "",
            responceActive: true,
            shortcuts: {
                "á": /a`/g,
                "é": /e`/g,
                "í": /i`/g,
                "ñ": /n`/g,
                "ñ": /n~/g,
                "ó": /o`/g,
                "ú": /u`/g,
                "ü": /u~/g,
            },
        };
    },

    methods: {
        /**
         * Handles keyup events and implements quizzer keyboard shortcuts.
         */
        keyup: function(e) {
            if (e.keyCode === 13 && e.ctrlKey) {
                this.Reset();
            }
            else if (e.keyCode === 13 && !e.ctrlKey) {
                this.Enter();
            }
        },

        /**
         * Give the user the next prompt and reset the quizzer.
         */
        Reset: function() {
            // Get new prompt
            this.index++;
            if (this.index >= this.prompts.length) {
                return;
            }

            // Show and hide elements
            this.responceActive = true;
            try {
                // Will fail if not mounted
                this.$refs.input.focus();
            }
            catch { }

            // Emit new-prompt event
            this.$emit("new-prompt", this.prompts, this.index);

            // Reset responce
            this.responce = "";

            // Read prompt
            if (this.settings.promptType !== "Text") {
                this.Read(this.prompt[1], this.prompt[0]);
            }

            // Get voice input
            if (this.settings.inputType !== "Text") {
                // Create recognition object
                var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

                // Set language
                if (this.prompt[2].toLowerCase().includes("english")) {
                    recognition.lang = 'en-US';
                }
                else if (this.prompt[2].toLowerCase().includes("spanish")) {
                    recognition.lang = 'es-mx';
                }

                // Set options
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.maxAlternatives = 16;

                // Start listening
                recognition.start();
                recognition.onresult = (event) => {
                    let parsed_responce = ""
                    for (var result of event.results[0]) {
                        parsed_responce += `${result.transcript}, `;
                        parsed_responce += `${result.transcript.split(" or ").join(", ")}, `;
                    }
                    this.responce = parsed_responce;
                    this.Submit();
                };
            }
        },

        /**
         * Process the user's responce.
         */
        Submit: function() {
            // Parse responce
            let responce = this.responce.toLowerCase(); // Make responce lowercase
            for (let shortcut in this.shortcuts) {
                responce = responce.replace(this.shortcuts[shortcut], shortcut);
            }
            let responces = responce.split(",");    // Split string by commas
            for (let i = 0; i < responces.length; i++) {
                responces[i] = responces[i].trim(); // Trim whitespace
            }

            // Parse answer
            let answers = this.prompt[3].toLowerCase().split(","); // Split string by commas
            for (let i = 0; i < answers.length; i++) {
                answers[i] = answers[i].trim(); // Trim whitespace
            }

            // Count correct responces
            let correctResponces = 0;
            for (let answer of answers) {
                if (responces.includes(answer)) {
                    correctResponces++;
                }
            }

            // Determine if responce is correct (and enforce multipleAnswers setting)
            let correct;
            if (this.settings.multipleAnswers === "Require all") {
                correct = correctResponces === answers.length;
            }
            else {
                correct = correctResponces > 0;
            }

            // Give user feedback
            if (!correct && (this.settings.onMissedPrompt === "Correct me" || this.settings.onMissedPrompt === "Tell me")) {
                // Show and hide elements
                this.responceActive = false;
                try {
                    // Will fail if not mounted
                    this.$refs.feedback.scrollIntoView(false);
                    this.$refs.input.focus();
                }
                catch { }
            }
            else if (!correct && this.settings.onMissedPrompt === "Ignore it") {
                this.Continue();
            }
            else {
                // Responce was correct
                this.Reset();
            }
        },

        /**
         * Process an incorrect responce and then reset the quizzer.
         */
        Continue: function() {
            // Repeat prompt
            switch (this.settings.repeatPrompts)
            {
                case "Never":
                    break;
                case "Immediately":
                    this.index--;
                    break;
                case "5 prompts later":
                    var temp = this.prompt;
                    this.prompts.splice(this.index, 1);
                    this.prompts.splice(this.index + 5, 0, temp);
                    this.index--;
                    break;
                case "5 & 10 prompts later":
                    var temp = this.prompt;
                    this.prompts.splice(this.index, 1);
                    this.prompts.splice(this.index + 10, 0, temp);
                    this.prompts.splice(this.index + 5, 0, temp);
                    this.index--;
                    break;
                case "At the end":
                    var temp = this.prompt;
                    this.prompts.splice(this.index, 1);
                    this.prompts.push(temp);
                    this.index--;
                    break;
            }

            // Reset quizzer
            this.Reset();
        },

        /**
         * Calls Submit or Continue depending on the value of responceActive.
         */
        Enter: function() {
            if (this.responceActive) {
                this.Submit();
            }
            else {
                this.Continue();
            }
        },

        /**
         * Get the language code that matches a label.
         * @param {String} label - The label.
         * @returns {String} - The language code ("en", "es", etc.)
         */
        getLang: function(label) {
            if (label.toLowerCase().includes("english") || label.toLowerCase().includes("type") || label.toLowerCase().includes("category")) {
                return "en";
            }
            else {
                return "es";
            }
        },

        /**
         * Read a peice of text.
         * @param {String} text - The text to read.
         * @param {String} label - The language of the text.
         */
        Read: function(text, label)
        {
            var msg = new SpeechSynthesisUtterance(text);
            msg.lang = this.getLang(label);
            window.speechSynthesis.speak(msg);
        },
    },

    computed: {
        /**
         * Get The current prompt.
         * @returns {Array} - The current prompt.
         */
        prompt: function() {
            if (this.index < this.prompts.length) {
                return this.prompts[this.index];
            }
            else {
                return ["", "", "", ""];
            }
        }
    },

    created: function() {
        // Add keyup handler
        window.addEventListener("keyup", this.keyup);

        // Update prompts
        this.prompts = this.startingPrompts;
        this.index = this.startingIndex - 1;

        // Reset quizzer
        this.Reset();
    },

    mounted: function() {
        this.$refs.input.focus();
    },

    destroyed: function() {
        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },

    template: `
    <div>
        <div class="quizzer" v-show="index < prompts.length">
            <p class="quizzerProgress">{{ index }} / {{ prompts.length }}</p>

            <section>
                <label class="quizzerPromptType" for="quizzerPrompt">{{ prompt[0] }}</label>
                <span class="quizzerPrompt" :lang="getLang(prompt[0])" @click="Read(prompt[1], prompt[0]);">{{ settings.promptType === "Audio" ? "Click to hear again" : prompt[1] }}</span>
            </section>

            <section>
                <label class="quizzerInputType" for="quizzerInput">{{ prompt[2] }}</label>
                <input class="quizzerInput" ref="input" type="text" v-model="responce" :readonly="!responceActive || settings.inputType === 'Voice'"
                    :lang="getLang(prompt[2])" autocomplete="off" spellcheck="false" autocorrect="off" placeholder="Type the answer">
            </section>

            <div class="quizzerButtons">
                <button v-if="responceActive" :disabled="settings.inputType === 'Voice'" @click="Submit();">Submit</button>
                <button v-else @click="Continue();">Continue</button>
                <button @click="Reset();">Skip</button>
            </div>

            <div class="quizzerFeedback" ref="feedback" v-show="!responceActive">
                <span v-if="settings.onMissedPrompt === 'Correct me'">
                    The correct answer is
                    <span class="quizzerFeedbackTerm" @click="Read(prompt[3], prompt[2]);">{{ prompt[3].toLowerCase() }}</span>.
                </span>
                <span v-if="settings.onMissedPrompt === 'Tell me'">
                    Incorrect.
                </span>
            </div>
        </div>

        <div class="congrats" v-show="index >= prompts.length">
            <p>Congratulations, You finished all of the prompts!</p>
            <button @click="$emit('finished-prompts')">Continue</button>
        </div>
    </div>
    `,
});



// quizzer-page component
const quizzerPage = Vue.component("quizzerPage", {
    props: {
        "referer": {
            type: String,
            default: "home",
        },
        "startingPrompts": {
            type: Array
        },
        "startingIndex": {
            type: Number
        },
        "settings": {
            type: Object
        }
    },

    data: function() {
        return {
            prompts: this.startingPrompts,
            index: this.startingIndex,
        }
    },

    methods: {
        /**
         * Update the user's progress in localStorage.
         * @param {Array} prompts - The list of prompts.
         * @param {Number} index - The index of the current prompt.
         */
        updateProgress: function(prompts, index) {
            // Save progress
            localStorage.setItem("last-session", JSON.stringify({ prompts: prompts, index: index }));
        }
    },

    created: function() {
        // Try to resume session if props are missing
        if (this.prompts == undefined || this.index == undefined) {
            try {
                // Get last session
                let { prompts, index } = JSON.parse(localStorage.getItem("last-session"));

                // Validate prompts and promptIndex
                if (prompts && !isNaN(index) && index >= 0 && index < prompts.length) {
                    this.prompts = prompts;
                    this.index = index;
                }
            } catch {}
        }

        // Go back if props are missing
        if (this.prompts == undefined || this.index == undefined) {
            alert("Unable to resume the previous session");
            this.$emit("back", this.referer);
        }
    },

    template: `
        <div class="quizzer-page">
            <page-header @click1="$emit('back', referer);" icon1="x" label1="Back"></page-header>
            <main>
                <quizzer :starting-prompts="prompts" :starting-index="index" :settings="settings"
                    @new-prompt="updateProgress" @finished-prompts="$emit('back', referer);">
                </quizzer>
            </main>
        </div>
    `,
});
