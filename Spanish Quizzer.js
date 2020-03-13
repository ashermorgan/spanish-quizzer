// Declare global variables
var Verbs;
var InputTypes = [1];
var CurrentVerb;
var CurrentForm;



// Load the document
function Load() {
    // Add event Listener
    var responceText = document.getElementById("responceText");
    responceText.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) { 
            // Key was enter
            if (responceText.readOnly) {
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
            Verbs = results.data;
        }
    });
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("responceText").readOnly = false;
    document.getElementById("submitButton").disabled = false;
    document.getElementById("errorText").hidden = true;
    document.getElementById("continueButton").hidden = true;
    
    // Get verb
    CurrentVerb = Math.floor(Math.random() * (Verbs.length - 1) + 1);
    CurrentForm = InputTypes[Math.floor(Math.random() * InputTypes.length)];

    // Set verb
    document.getElementById("vocabText").textContent = Verbs[CurrentVerb][0];
    document.getElementById("formText").textContent = Verbs[0][CurrentForm];

    // Reset responce
    document.getElementById("responceText").value = "";
} 



// Check the user's responce
function Check() {
    // Prepare responce
    var responce = document.getElementById("responceText").value.toLowerCase();
    responce = responce.replace("a`", "á");
    responce = responce.replace("e`", "é");
    responce = responce.replace("i`", "í");
    responce = responce.replace("n`", "ñ");
    responce = responce.replace("o`", "ó");

    // Check responce
    if (responce != Verbs[CurrentVerb][CurrentForm].toLowerCase()) {
        // Responce was incorrect
        document.getElementById("errorText").textContent = "The correct answer is " + Verbs[CurrentVerb][CurrentForm] + ".";
        
        // Show and hide elements
        document.getElementById("responceText").readOnly = true;
        document.getElementById("submitButton").disabled = true;
        document.getElementById("errorText").hidden = false;
        document.getElementById("continueButton").hidden = false;
        document.getElementById("responceText").focus();
    }
    else {
        // Responce was correct
        Reset();
    }
}