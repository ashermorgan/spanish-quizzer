// Declare global variables
var Sets = [];  // List of parsed sets

var Terms = []; // List of acceptable terms
var Inputs;     // List of acceptable input indexes
var Outputs;    // List of acceptable outputs indexes

var Term;       // Current term from Terms
var Input;      // Current input type from InputTypes
var Output;     // Current output type from OutputTypes



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

    // Load CSV
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/feature-multipleSets/Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets.push(results.data);
        }
    });
}



// Start the quizzer
function Start()
{
    // Load Sets into Terms
    for (var i = 0; i < Sets[0].length; i++)
    {
        Terms.push(Sets[0][i]);
    }

    // Show and hide elements
    document.getElementById("welcome").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Set mode
    switch(document.getElementById("mode").value) {
        case "All":
            Inputs = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];
            Outputs = [0];
            break;

        case "Definition":
            Inputs = [1];
            Outputs = [0];
            break;

        case "Participle":
            Inputs = [2];
            Outputs = [0];
            break;

        case "Present":
            Inputs = [4,5,6,7,8];
            Outputs = [0];
            break;

        case "Preterite":
            Inputs = [10,11,12,13,14];
            Outputs = [0];
            break;

        case "Imperfect":
            Inputs = [16,17,18,19,20];
            Outputs = [0];
            break;

        case "Reverse":
            Inputs = [0];
            Outputs = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];;
            break;

        default:
            Inputs = [1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20];
            Outputs = [0];
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
    Term = Math.floor(Math.random() * (Terms.length - 1) + 1);
    Input = Inputs[Math.floor(Math.random() * Inputs.length)];
    Output = Outputs[Math.floor(Math.random() * Outputs.length)];

    // Set prompt
    document.getElementById("promptType").textContent = Terms[0][Output] + ": ";
    document.getElementById("prompt").textContent = Terms[Term][Output];
    document.getElementById("inputType").textContent = Terms[0][Input] + ": ";

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
    if (!responces.includes(Terms[Term][Input].toLowerCase())) {
        // Responce was incorrect
        document.getElementById("errorText").textContent = "The correct answer is " + Terms[Term][Input] + ".";
        
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