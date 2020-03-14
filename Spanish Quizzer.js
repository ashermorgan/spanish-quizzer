// Declare global variables
var Terms;
var InputTypes;
var OutputTypes;
var CurrentTerm;
var CurrentInputType;
var CurrentOutputType;



// Load the document
function Load() {
    // Add event Listener
    var input = document.getElementById("input");
    input.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) { 
            // Key was enter
            if (input.readOnly) {
                Reset();
            }
            else {
                Check();
            } 
        }
    });

    // Load csv
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Terms = results.data;
        }
    });
}



// Start the quizzer
function Start()
{
    // Show and hide elements
    document.getElementById("welcome").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Set mode
    switch(document.getElementById("mode").value) {
        case "All":
            InputTypes = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];
            OutputTypes = [0];
            break;

        case "Definition":
            InputTypes = [1];
            OutputTypes = [0];
            break;

        case "Participle":
            InputTypes = [2];
            OutputTypes = [0];
            break;

        case "Present":
            InputTypes = [4,5,6,7,8];
            OutputTypes = [0];
            break;

        case "Preterite":
            InputTypes = [10,11,12,13,14];
            OutputTypes = [0];
            break;

        case "Imperfect":
            InputTypes = [16,17,18,19,20];
            OutputTypes = [0];
            break;

        case "Reverse":
            InputTypes = [0];
            OutputTypes = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];;
            break;

        default:
            InputTypes = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];
            OutputTypes = [0];
            break;
    }

    // Give the user a prompt
    Reset();
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("input").readOnly = false;
    document.getElementById("submitButton").disabled = false;
    document.getElementById("errorText").hidden = true;
    document.getElementById("continueButton").hidden = true;
    
    // Get prompt
    CurrentTerm = Math.floor(Math.random() * (Terms.length - 1) + 1);
    CurrentInputType = InputTypes[Math.floor(Math.random() * InputTypes.length)];
    CurrentOutputType = OutputTypes[Math.floor(Math.random() * OutputTypes.length)];

    // Set prompt
    document.getElementById("promptType").textContent = Terms[0][CurrentOutputType] + ": ";
    document.getElementById("prompt").textContent = Terms[CurrentTerm][CurrentOutputType];
    document.getElementById("inputType").textContent = Terms[0][CurrentInputType] + ": ";

    // Reset responce
    document.getElementById("input").value = "";
} 



// Check the user's responce
function Check() {
    // Prepare responce
    var responce = document.getElementById("input").value.toLowerCase(); // Make responce lowercase
    responce = responce.replace("a`", "á"); // Apply accented a shortcut
    responce = responce.replace("e`", "é"); // Apply accented e shortcut
    responce = responce.replace("i`", "í"); // Apply accented i shortcut
    responce = responce.replace("n`", "ñ"); // Apply n with tilde shortcut
    responce = responce.replace("o`", "ó"); // Apply accented o shortcut
    var responces = responce.split(",");    // Split string by commas
    responces.push(responce);   // Keep origional responce
    for (var i = 0; i < responces.length; i++) {
        responces[i] = responces[i].trim(); // Trim whitespace
    }

    // Check responce
    if (!responces.includes(Terms[CurrentTerm][CurrentInputType].toLowerCase())) {
        // Responce was incorrect
        document.getElementById("errorText").textContent = "The correct answer is " + Terms[CurrentTerm][CurrentInputType] + ".";
        
        // Show and hide elements
        document.getElementById("input").readOnly = true;
        document.getElementById("submitButton").disabled = true;
        document.getElementById("errorText").hidden = false;
        document.getElementById("continueButton").hidden = false;
        document.getElementById("input").focus();
    }
    else {
        // Responce was correct
        Reset();
    }
}