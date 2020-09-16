// Declare global variables
let Prefix;         // Dictionary of quizzer settings



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



// Starts the quizzer
function StartQuizzer(prefix) {
    // Set variables and settings
    app.promptIndex--;
    Prefix = prefix;

    // Validate Terms
    if (!app.prompts || isNaN(app.promptIndex) || app.promptIndex < -1 || app.promptIndex > app.prompts.length) {
        throw "Bad arguments.";
    }
    else if (app.prompts.length == 0) {
        throw "Terms is empty.";
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

    // Save terms to local storage
    localStorage.setItem(Prefix + "prompts", JSON.stringify(app.prompts));
    
    // Give iOS devices ringer warning for prompt audio
    if (app.promptType != "Text") {
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            alert("Please make sure your ringer is on in order to hear audio prompts.");
        }
    }

    // Give the user a prompt
    Reset();
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("quizzerCongrats").hidden = true;
    document.getElementById("quizzerInput").focus();
    app.responceActive = true;
    
    // Get new prompt
    app.promptIndex++;
    if (app.promptIndex == app.prompts.length) {
        // The user just finished
        app.prompts = Shuffle(app.prompts);
        app.promptIndex = 0;
        document.getElementById("quizzerCongrats").hidden = false;
    }

    // Save progress to local storage
    localStorage.setItem(Prefix + "prompt", app.promptIndex);

    // Reset responce
    app.responce = "";

    // Read prompt
    if (app.promptType != "Text") {
        Read(app.prompt[1], app.prompt[0]);
    }

    // Get voice input
    if (app.inputType != "Text") {
        // Create recognition object
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        
        // Set language
        if (app.prompt[2].toLowerCase().includes("english")) {
            recognition.lang = 'en-US';
        }
        else if (app.prompt[2].toLowerCase().includes("spanish")) {
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
            app.responce = responce;
            Submit()
        };
    }
}



// Processes a user's submitted responce
function Submit() {
    // Parse responce
    var responce = app.responce.toLowerCase(); // Make responce lowercase
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
    let answers = app.prompt[3].toLowerCase().split(","); // Split string by commas
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
        document.getElementById("quizzerCongrats").hidden = true;
        document.getElementById("quizzerFeedback").scrollIntoView(false);
        document.getElementById("quizzerInput").focus();
        app.responceActive = false;
    }
    else {
        // Responce was correct
        Reset();
    }
}



// Processes an incorrect responce and then resets the quizzer
function Continue() {
    // Repeat prompt
    switch (app.repeatPrompts)
    {
        case "Never":
            // Don't repeat
            break;
        case "Immediately":
            // Repeat imitiately
            app.promptIndex--;
            break;
        case "5 prompts later":
            // Repeat 5 prompts later
            var temp = app.prompt;
            app.prompts.splice(app.promptIndex, 1);
            app.prompts.splice(app.promptIndex + 5, 0, temp);
            app.promptIndex--;
            break;
        case "At the end":
            // Repeat at end of Terms
            var temp = app.prompt;
            app.prompts.splice(app.promptIndex, 1);
            app.prompts.push(temp);
            app.promptIndex--;
            break;
    }
    
    // Save terms to local storage
    localStorage.setItem(Prefix + "terms", JSON.stringify(app.prompts));

    // Reset quizzer
    Reset();
}



// Called when the user hits enter or presses the enter button
function Enter() {
    if (app.responceActive) {
        Submit();
    }
    else {
        Continue();
    }
}
