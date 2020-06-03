// Declare global variables
var Terms;      // List of filtered terms
var Term;       // Index of current term



// Start the quizzer
function Start() {
    // Filter and load Sets into Terms
    Terms = [];
    for (var i = 0; i < setId; i++)
    {
        if (document.getElementById(`settingsSet-${i}`))
        {
            // Get filter information
            var set = document.getElementById(`settingsSetName-${i}`).value;
            var filter = document.getElementById(`settingsSetFilter-${i}`).value;
    
            // Add filtered set
            Terms.push(...ApplyFilter(Sets[set], filter));
        }
    }

    // Shuffle terms
    ShuffleTerms();

    // Validate Terms
    if (Terms.length == 0) {
        document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
        document.getElementById("settingsError").scrollIntoView(false);
        return;
    }

    // Save terms to local storage
    localStorage.setItem("terms", JSON.stringify(Terms));

    // Configure prompt audio
    if (document.getElementById("settingsPromptType").value != "Text") {
        document.getElementById("quizzerPrompt").classList.add("audio");
        
        // Give iOS devices ringer warning
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            alert("Please make sure your ringer is on in order to hear audio prompts.");
        }
    }
    else {
        document.getElementById("quizzerPrompt").classList.remove("audio");
    }

    // Show and hide elements
    document.getElementById("settings").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Give the user a prompt
    Term = -1;
    Reset();
}



// Resume the previous session
function Resume() {
    // Validate selected sets
    for (var i = 0; i < setId; i++)
    {
        if (document.getElementById(`settingsSet-${i}`))
        {
            if (confirm("This will remove the vocab sets you have already selected. Are you sure?")) {
                break;
            }
            else {
                return;
            }
        }
    }

    // Load terms and progress
    Terms = JSON.parse(localStorage.getItem("terms"));
    Term = parseInt(localStorage.getItem("term")) - 1;
    
    // Validate Terms
    if (!Terms || Terms.length == 0 || !Term || Term < -1 || Term > Terms.length) {
        document.getElementById("settingsError").textContent = "An error occured while resuming the previous session.";
        document.getElementById("settingsError").scrollIntoView(false);
        return;
    }

    // Configure prompt audio
    if (document.getElementById("settingsPromptType").value != "Text") {
        document.getElementById("quizzerPrompt").classList.add("audio");
        
        // Give iOS devices ringer warning
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            alert("Please make sure your ringer is on in order to hear audio prompts.");
        }
    }
    else {
        document.getElementById("quizzerPrompt").classList.remove("audio");
    }

    // Show and hide elements
    document.getElementById("settings").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Give the user a prompt
    Reset();
}



// Filters a vocabulary set given the filter name
function ApplyFilter(vocabSet, name) {
    // Declare variables
    var io;     // Format: [[<output index>, <input index>]]
    var value;  // Format: [[<index>, [<values>], exclude?]]

    // Get filter
    switch (name) {
        case "All Definitions":
            io = [[0,1], [1,0]];
            value = [];
            break;

        case "English to Spanish":
            io = [[0,1]];
            value = [];
            break;

        case "Spanish to English":
            io = [[1,0]];
            value = [];
            break;
        
        case "All Conjugations":
            io = [[0,3], [0,5], [0,6], [0,7], [0,8], [0,9], [0,11], [0,12], [0,13], [0,14], [0,15], [0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [];
            break;
        
        case "Reverse Conjugations":
            io = [[3,0], [5,0], [6,0], [7,0], [8,0], [9,0], [11,0], [12,0], [13,0], [14,0], [15,0], [17,0], [18,0], [19,0], [20,0], [21,0]];
            value = [];
            break;

        case "Present Participles":
            io = [[0,3]];
            value = [];
            break;

        case "Present Tense":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [];
            break;

        case "Preterite Tense":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]]
            value = [];
            break;

        case "Imperfect Tense":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [];
            break;

        case "Present Participle non-Regular":
            io = [[0,3]];
            value = [[2, ["Regular"], true]];
            break;

        case "Present non-Regular":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [[4, ["Regular"], true]];
            break;

        case "Preterite non-Regular":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]];
            value = [[10, ["Regular"], true]];
            break;

        case "Imperfect non-Regular":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [[16, ["Regular"], true]];
            break;

        case "Present Participle Regular":
            io = [[0,3]];
            value = [[2, ["Regular"], false]];
            break;

        case "Present Regular":
            io = [[0,5], [0,6], [0,7], [0,8], [0,9]];
            value = [[4, ["Regular"], false]];
            break;

        case "Preterite Regular":
            io = [[0,11], [0,12], [0,13], [0,14], [0,15]];
            value = [[10, ["Regular"], false]];
            break;

        case "Imperfect Regular":
            io = [[0,17], [0,18], [0,19], [0,20], [0,21]];
            value = [[16, ["Regular"], false]];
            break;

        case "Nouns":
            io = [[0,1], [1,0]];
            value = [[2, ["Noun"], false]];
            break;

        case "Verbs":
            io = [[0,1], [1,0]];
            value = [[2, ["Verb"], false]];
            break;

        case "Adjectives":
            io = [[0,1], [1,0]];
            value = [[2, ["Adjective"], false]];
            break;

        default:
            io = [];
            value = [];
            break;
    }

    // Filter terms by value
    var vSet = vocabSet.slice(1);  // Format: same as vocabSet but without headers
    for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            if (value[i][2]) {
                // Exclude values
                if (value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
            else {
                // Include values
                if (!value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
        }
    }

    // Filter terms by input/output
    var ioSet = []; // Format: [<output type>, <output>, <input type>, <input>]
    for (var i = 0; i < io.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            ioSet.push([vocabSet[0][io[i][0]], vSet[j][io[i][0]], vocabSet[0][io[i][1]], vSet[j][io[i][1]]]);
        }
    }

    // Return filtered set
    return ioSet;
}



// Shuffle the list of terms
function ShuffleTerms() {
    var currentIndex = Terms.length, temporaryValue, randomIndex;
    
    // While there are more elements to shuffle
    while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        // Swap the two elements
        temporaryValue = Terms[currentIndex];
        Terms[currentIndex] = Terms[randomIndex];
        Terms[randomIndex] = temporaryValue;
    }
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("quizzerInput").readOnly = false;
    document.getElementById("quizzerEnter").textContent = "Submit";
    document.getElementById("quizzerFeedback").hidden = true;
    document.getElementById("quizzerCongrats").hidden = true;
    
    // Get prompt
    Term++;
    if (Term == Terms.length) {
        // The user just finished
        ShuffleTerms();
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

    // Get answer
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    if (Terms[Term][2].toLowerCase().includes("english")) {
        recognition.lang = 'en-US';
    }
    else if (Terms[Term][2].toLowerCase().includes("spanish")) {
        recognition.lang = 'es-mx';
    }
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.start();
    recognition.onresult = function(event) {
        document.getElementById("quizzerInput").value = event.results[0][0].transcript;
        Check()
    };
}



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



// Read the prompt if audio is enabled
function quizzerPromptClicked() {
    if (document.getElementById("settingsPromptType").value != "Text") {
        Read(Terms[Term][1], Terms[Term][0]);
    }
}



// Check the user's responce
function Check() {
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
        document.getElementById("quizzerFeedback").textContent = `The correct answer is ${Terms[Term][3].toLowerCase()}.`;
        
        // Show and hide elements
        document.getElementById("quizzerInput").readOnly = true;
        document.getElementById("quizzerEnter").textContent = "Continue";
        document.getElementById("quizzerFeedback").hidden = false;
        document.getElementById("quizzerCongrats").hidden = true;
        document.getElementById("quizzerFeedback").scrollIntoView(false);
        document.getElementById("quizzerInput").focus();

        // Repeat prompt
        switch (document.getElementById("settingsRepeatPrompts").value)
        {
            case "Never": // Don't repeat
                break;
            case "Immediately": // Repeat imitiately
                Term--;
                break;
            case "5 prompts later":
                var temp = Terms[Term];
                Terms.splice(Term, 1);
                Terms.splice(Term + 5, 0, temp);
                Term--;
                break;
        }
    }
    else {
        // Responce was correct
        Reset();
    }
}