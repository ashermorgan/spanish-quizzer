// Declare global variables
let Prefix;         // Dictionary of quizzer settings



Vue.component("quizzer", {
    props: {
        active: {
            type: Boolean,
            default: false,
        },

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

        promptType: {
            type: String,
            default: "Text",
        },
        inputType: {
            type: String,
            default: "Text",
        },
        repeatPrompts: {
            type: String,
            default: "Never",
        },
    },

    data: function() {
        return {
            prompts: this.startingPrompts,
            index: this.startingIndex,
            responce: "",
            responceActive: true,
            congratsActive: false,
        };
    },

    watch: {
        active: function(value) {
            if (value) {
                // Update prompts
                this.prompts = this.startingPrompts;
                this.index = this.startingIndex - 1;
                
                // Reset quizzer
                this.Reset();
            }
        },
    },

    methods: {
        // Give the user a new prompt
        Reset: function() {
            // Check is Quizzer is active
            if (!this.active) {
                return;
            }

            // Show and hide elements
            this.responceActive = true;
            this.congratsActive = false;
            
            // Get new prompt
            this.index++;
            if (this.index == this.prompts.length) {
                // The user just finished
                this.prompts = Shuffle(this.prompts);
                this.index = 0;
                this.congratsActive = true;
            }

            // Emit new-prompt event
            this.$emit("new-prompt", this.prompts, this.index);

            // Reset responce
            this.responce = "";

            // Read prompt
            if (this.promptType != "Text") {
                Read(this.prompt[1], this.prompt[0]);
            }

            // Get voice input
            if (this.inputType != "Text") {
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
                recognition.onresult = function(event) {
                    responce = ""
                    for (var result of event.results[0]) {
                        responce += `${result.transcript}, `;
                        responce += `${result.transcript.split(" or ").join(", ")}, `;
                    }
                    this.responce = responce;
                    this.Submit();
                };
            }
        },

        // Processes a user's submitted responce
        Submit: function() {
            // Check is Quizzer is active
            if (!this.active) {
                return;
            }

            // Parse responce
            var responce = this.responce.toLowerCase(); // Make responce lowercase
            responce = responce.replace(/a`/g, "á"); // Apply accented a shortcut
            responce = responce.replace(/e`/g, "é"); // Apply accented e shortcut
            responce = responce.replace(/i`/g, "í"); // Apply accented i shortcut
            responce = responce.replace(/n`/g, "ñ"); // Apply n with tilde shortcut
            responce = responce.replace(/n~/g, "ñ"); // Apply n with tilde shortcut
            responce = responce.replace(/o`/g, "ó"); // Apply accented o shortcut
            responce = responce.replace(/u`/g, "ú"); // Apply accented u shortcut
            responce = responce.replace(/u~/g, "ü"); // Apply u with diaeresis shortcut
            var responces = responce.split(",");    // Split string by commas
            for (var i = 0; i < responces.length; i++) {
                responces[i] = responces[i].split(" ").filter(function(x){return x !== "";}).join(" "); // Trim whitespace
            }

            // Parse answer
            let answers = this.prompt[3].toLowerCase().split(","); // Split string by commas
            for (var i = 0; i < answers.length; i++) {
                answers[i] = answers[i].trim(); // Trim whitespace
            }

            // Check responce
            var correct = true;
            for (var answer of answers) {
                if (!responces.includes(answer)) {
                    correct = false;
                }
            }

            // Give user feedback
            if (!correct) {
                // Show and hide elements
                document.getElementById("quizzerFeedback").scrollIntoView(false);
                document.getElementById("quizzerInput").focus();
                this.congratsActive = false;
                this.responceActive = false;
            }
            else {
                // Responce was correct
                this.Reset();
            }
        },

        // Processes an incorrect responce and then resets the quizzer
        Continue: function() {
            // Check is Quizzer is active
            if (!this.active) {
                return;
            }
            
            // Repeat prompt
            switch (this.repeatPrompts)
            {
                case "Never":
                    // Don't repeat
                    break;
                case "Immediately":
                    // Repeat imitiately
                    this.index--;
                    break;
                case "5 prompts later":
                    // Repeat 5 prompts later
                    var temp = this.prompt;
                    this.prompts.splice(this.index, 1);
                    this.prompts.splice(this.index + 5, 0, temp);
                    this.index--;
                    break;
                case "At the end":
                    // Repeat at end of Terms
                    var temp = this.prompt;
                    this.prompts.splice(this.index, 1);
                    this.prompts.push(temp);
                    this.index--;
                    break;
            }

            // Reset quizzer
            this.Reset();
        },
        
        // Called when the user hits enter or presses the enter button
        Enter: function() {
            // Check is Quizzer is active
            if (!this.active) {
                return;
            }
            
            if (this.responceActive) {
                this.Submit();
            }
            else {
                this.Continue();
            }
        },
        
        getLang: function(label) {
            if (label.toLowerCase().includes("spanish")) {
                return "es";
            }
            else {
                return "en";
            }
        },
    },

    computed: {
        prompt: function() {
            if (this.index < this.prompts.length) {
                return this.prompts[this.index];
            }
            else {
                return ["", "", "", ""];
            }
        }
    },
    
    template: `
        <div>
        <p id="quizzerProgress">{{ index }} / {{ prompts.length }}</p>
        
        <section>
            <label id="quizzerPromptType" for="quizzerPrompt" :lang="getLang(prompt[0])">{{ prompt[0] }}</label>
            <span id="quizzerPrompt" @click="Read(prompt[1], prompt[0]);">{{ prompt[1] }}</span>
        </section>
        
        <section>
            <label id="quizzerInputType" for="quizzerInput">{{ prompt[2] }}</label>
            <input id="quizzerInput" type="text" v-model="responce" :readonly="!responceActive || inputType == 'Voice'"
                @keyup.ctrl.enter.exact="Reset();" @keyup.enter.exact="Enter();" :lang="getLang(prompt[2])"
                autocomplete="off" spellcheck="false" autocorrect="off" placeholder="Type the answer">
        </section>
        
        <div id="quizzerButtons">
            <button v-if="responceActive" :disabled="inputType == 'Voice'" @click="Submit();">Submit</button>
            <button v-else @click="Continue();">Continue</button>
            <button @click="Reset();">Skip</button>
        </div>
        
        <div id="quizzerFeedback" v-show="!responceActive" class="bad">
            The correct answer is 
            <span id="quizzerFeedbackTerm" @click="Read(prompt[3], prompt[2]);">{{ prompt[3].toLowerCase() }}</span>.
        </div>
        <div id="quizzerCongrats" class="good" v-show="congratsActive">Congratulations! You made it back to the beginning!</div>
    </div>
    `,
});



// Reads a peice of text
function Read(text, label)
{
    var msg = new SpeechSynthesisUtterance(text);
    if (label.toLowerCase().includes("english")) {
        msg.lang = 'en';
    }
    else if (label.toLowerCase().includes("spanish")){
        msg.lang = 'es';
    }
    window.speechSynthesis.speak(msg);
}



// Shuffles a list of items
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
