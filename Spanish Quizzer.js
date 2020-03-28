// Declare global variables
var Sets;       // List of parsed sets
var Terms;      // List of filtered terms
var Term;       // Index of current term
var setId = 0;  // Next valid set id number



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
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Questions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[7] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[8] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[9] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[10] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[11] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[12] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[13] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[14] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[15] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[16] = results.data;
        }
    });
}



// Add a filtered set
function AddSet() {
    // Create row
    var clone = document.getElementById("settingsSetTemplate").content.cloneNode(true);

    // Set row ids
    clone.children[0].setAttribute("id", `settingsSet-${setId}`);
    clone.getElementById("settingsSetName").setAttribute("id", `settingsSetName-${setId}`);
    clone.getElementById("settingsSetFilter").setAttribute("id", `settingsSetFilter-${setId}`);
    
    // Add remove button onclick attribute
    clone.getElementById("settingsSetRemove").setAttribute("onclick", `var element = document.getElementById('settingsSet-${setId}'); element.parentNode.removeChild(element);`);
    
    // Add row
    document.getElementById("settingsSets").tBodies[0].appendChild(clone);
    
    // Increment setId
    setId++; // increment fileId to get a unique ID for the new element
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
    for (var i = 0; i < setId; i++)
    {
        if (document.getElementById(`settingsSet-${i}`))
        {
            // Get filter information
            var set = document.getElementById(`settingsSetName-${i}`).value;
            var filter = document.getElementById(`settingsSetFilter-${i}`).value;
    
            // Add filtered set
            Terms.push(...Filter.GetFilter(filter).Apply(Sets[set]));
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