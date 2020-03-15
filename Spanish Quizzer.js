// Declare global variables
var Sets = [];  // List of parsed sets
var Terms = []; // List of filtered terms
var Term;       // Index of current term



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
    // Filter and load Sets into Terms
    Terms.push(...Filter.GetFilter(document.getElementById("mode").value).Apply(Sets[0]));

    // Show and hide elements
    document.getElementById("welcome").hidden = true;
    document.getElementById("quizzer").hidden = false;

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

    // Set prompt
    document.getElementById("promptType").textContent = Terms[Term][0] + ": ";
    document.getElementById("prompt").textContent = Terms[Term][1];
    document.getElementById("inputType").textContent = Terms[Term][2] + ": ";

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
    if (!responces.includes(Terms[Term][3].toLowerCase())) {
        // Responce was incorrect
        document.getElementById("errorText").textContent = "The correct answer is " + Terms[Term][3] + ".";
        
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