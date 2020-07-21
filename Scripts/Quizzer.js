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
function StartQuizzer(terms, term) {
    // Set terms
    Terms = terms;
    Term = term - 1;

    // Validate Terms
    if (!Terms || isNaN(Term) || Term < -1 || Term > Terms.length) {
        throw "Bad arguments.";
    }
    else if (Terms.length == 0) {
        throw "Terms is empty.";
    }
    
    // Validate browser for voice input
    if (document.getElementById("settingsInputType").value != "Text") {
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
    localStorage.setItem("terms", JSON.stringify(Terms));
    
    // Give iOS devices ringer warning for prompt audio
    if (document.getElementById("settingsPromptType").value != "Text") {
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
    document.getElementById("quizzerInput").readOnly = false;
    document.getElementById("quizzerEnter").textContent = "Submit";
    document.getElementById("quizzerEnter").disabled = false;
    document.getElementById("quizzerFeedback").hidden = true;
    document.getElementById("quizzerCongrats").hidden = true;
    
    // Get prompt
    Term++;
    if (Term == Terms.length) {
        // The user just finished
        Terms = Shuffle(Terms);
        Term = 0;
        
        // Congradulate user
        document.getElementById("quizzerCongrats").textContent = "Congratulations! You made it back to the beginning!";
        document.getElementById("quizzerCongrats").hidden = false;
    }

    // Save progress to local storage
    localStorage.setItem("term", Term);

    // Update progress
    document.getElementById("quizzerProgress").textContent = `${Term} / ${Terms.length}`;

    // Set prompt
    document.getElementById("quizzerPromptType").textContent = `${Terms[Term][0]}: `;
    if (document.getElementById("settingsPromptType").value != "Audio") {
        document.getElementById("quizzerPrompt").textContent = Terms[Term][1];
    }
    else {
        document.getElementById("quizzerPrompt").textContent = "Click to hear again";
    }
    document.getElementById("quizzerInputType").textContent = `${Terms[Term][2]}: `;

    // Reset responce
    document.getElementById("quizzerInput").value = "";

    // Read prompt
    if (document.getElementById("settingsPromptType").value != "Text") {
        Read(Terms[Term][1], Terms[Term][0]);
    }

    // Disable textbox and submit button
    if (document.getElementById("settingsInputType").value == "Voice") {
        document.getElementById("quizzerInput").readOnly = true;
        document.getElementById("quizzerEnter").disabled = true;
    }

    // Get voice input
    if (document.getElementById("settingsInputType").value != "Text") {
        // Create recognition object
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        
        // Set language
        if (Terms[Term][2].toLowerCase().includes("english")) {
            recognition.lang = 'en-US';
        }
        else if (Terms[Term][2].toLowerCase().includes("spanish")) {
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
            document.getElementById("quizzerInput").value = responce;
            Submit()
        };
    }
}



// Processes a user's submitted responce
function Submit() {
    // Parse responce
    var responce = document.getElementById("quizzerInput").value.toLowerCase(); // Make responce lowercase
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
    answers = Terms[Term][3].toLowerCase().split(","); // Split string by commas
    for (var i = 0; i < answers.length; i++) {
        answers[i] = answers[i].trim(); // Trim whitespace
    }

    // Check responce
    var correct = true;
    for(var answer of answers) {
        if (!responces.includes(answer)) {
            correct = false;
        }
    }

    // Give user feedback
    if (!correct) {
        // Responce was incorrect
        document.getElementById("quizzerFeedbackTerm").textContent = Terms[Term][3].toLowerCase();
        
        // Show and hide elements
        document.getElementById("quizzerInput").readOnly = true;
        document.getElementById("quizzerEnter").textContent = "Continue";
        document.getElementById("quizzerEnter").disabled = false;
        document.getElementById("quizzerFeedback").hidden = false;
        document.getElementById("quizzerCongrats").hidden = true;
        document.getElementById("quizzerFeedback").scrollIntoView(false);
        document.getElementById("quizzerInput").focus();
    }
    else {
        // Responce was correct
        Reset();
    }
}



// Processes an incorrect responce and then resets the quizzer
function Continue() {
    // Repeat prompt
    switch (document.getElementById("settingsRepeatPrompts").value)
    {
        case "Never":
            // Don't repeat
            break;
        case "Immediately":
            // Repeat imitiately
            Term--;
            break;
        case "5 prompts later":
            // Repeat 5 prompts later
            var temp = Terms[Term];
            Terms.splice(Term, 1);
            Terms.splice(Term + 5, 0, temp);
            Term--;
            break;
        case "At the end":
            // Repeat at end of Terms
            var temp = Terms[Term];
            Terms.splice(Term, 1);
            Terms.push(temp);
            Term--;
            break;
    }
    
    // Save terms to local storage
    localStorage.setItem("terms", JSON.stringify(Terms));

    // Reset quizzer
    Reset();
}
