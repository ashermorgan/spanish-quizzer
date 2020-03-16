// Declare global variables
var Sets;   // List of parsed sets
var Terms;  // List of filtered terms
var Term;   // Index of current term



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

    // Show and hide elements
    document.getElementById("welcome").hidden = false;
    document.getElementById("quizzer").hidden = true;
    document.getElementById("settingsError").textContent = "";

    // Load CSVs
    Sets = [null, null, null, null, null, null, null, null, null];
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[0] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[1] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[2] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[3] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Cloths.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[4] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[5] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[6] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[7] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[8] = results.data;
        }
    });
}



// Start the quizzer
function Start()
{
    // Filter and load Sets into Terms
    Terms = [];
    Terms.push(...Filter.GetFilter(document.getElementById("mode0").value).Apply(Sets[0]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode1").value).Apply(Sets[1]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode2").value).Apply(Sets[2]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode3").value).Apply(Sets[3]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode4").value).Apply(Sets[4]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode5").value).Apply(Sets[5]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode6").value).Apply(Sets[6]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode7").value).Apply(Sets[7]));
    Terms.push(...Filter.GetFilter(document.getElementById("mode8").value).Apply(Sets[8]));

    // Validate Terms
    if (Terms.length == 0) {
        document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
        return;
    }

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