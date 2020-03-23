// Declare global variables
var Sets;   // List of parsed sets
var Terms;  // List of filtered terms
var Term;   // Index of current term



// Load the document
function Load() {
    // Add event Listener
    var input = document.getElementById("quizzerInput");
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
    document.getElementById("settings").hidden = false;
    document.getElementById("quizzer").hidden = true;
    document.getElementById("settingsError").textContent = "";

    // Load CSVs
    Sets = [];
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[0] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Adjectives.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[1] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Adverbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[2] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[3] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Colors.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[4] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Days.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[5] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Months.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[6] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[7] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[8] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[9] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[10] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[11] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[12] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[13] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[14] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[15] = results.data;
        }
    });
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



// Start the quizzer
function Start() {
    // Filter and load Sets into Terms
    Terms = [];
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode0").value).Apply(Sets[0]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode1").value).Apply(Sets[1]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode2").value).Apply(Sets[2]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode3").value).Apply(Sets[3]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode4").value).Apply(Sets[4]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode5").value).Apply(Sets[5]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode6").value).Apply(Sets[6]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode7").value).Apply(Sets[7]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode8").value).Apply(Sets[8]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode9").value).Apply(Sets[9]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode10").value).Apply(Sets[10]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode11").value).Apply(Sets[11]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode12").value).Apply(Sets[12]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode13").value).Apply(Sets[13]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode14").value).Apply(Sets[14]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode15").value).Apply(Sets[15]));

    // Shuffle terms
    ShuffleTerms();

    // Validate Terms
    if (Terms.length == 0) {
        document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
        document.getElementById("settingsError").scrollIntoView(false);
        return;
    }

    // Show and hide elements
    document.getElementById("settings").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Give the user a prompt
    Term = -1;
    Reset();
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("quizzerInput").readOnly = false;
    document.getElementById("quizzerSubmit").disabled = false;
    document.getElementById("quizzerFeedback").hidden = true;
    document.getElementById("quizzerContinue").hidden = true;
    
    // Get prompt
    Term++;
    if (Term == Terms.length) {
        ShuffleTerms();
        Term = 0;
    }
    document.getElementById("quizzerProgress").textContent = `${Term + 1} / ${Terms.length}`;

    // Set prompt
    document.getElementById("quizzerPromptType").textContent = `${Terms[Term][0]}: `;
    document.getElementById("quizzerPrompt").textContent = Terms[Term][1];
    document.getElementById("quizzerInputType").textContent = `${Terms[Term][2]}: `;

    // Reset responce
    document.getElementById("quizzerInput").value = "";
} 



// Check the user's responce
function Check() {
    // Parse responce
    var responce = document.getElementById("quizzerInput").value.toLowerCase(); // Make responce lowercase
    responce = responce.replace("a`", "á"); // Apply accented a shortcut
    responce = responce.replace("e`", "é"); // Apply accented e shortcut
    responce = responce.replace("i`", "í"); // Apply accented i shortcut
    responce = responce.replace("n`", "ñ"); // Apply n with tilde shortcut
    responce = responce.replace("n~", "ñ"); // Apply n with tilde shortcut
    responce = responce.replace("o`", "ó"); // Apply accented o shortcut
    responce = responce.replace("u`", "ú"); // Apply accented u shortcut
    responce = responce.replace("u~", "ü"); // Apply u with diaeresis shortcut
    var responces = responce.split(",");    // Split string by commas
    for (var i = 0; i < responces.length; i++) {
        responces[i] = responces[i].trim(); // Trim whitespace
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
        document.getElementById("quizzerSubmit").disabled = true;
        document.getElementById("quizzerFeedback").hidden = false;
        document.getElementById("quizzerFeedback").scrollIntoView(false);
        document.getElementById("quizzerContinue").hidden = false;
        document.getElementById("quizzerInput").focus();
    }
    else {
        // Responce was correct
        Reset();
    }
}