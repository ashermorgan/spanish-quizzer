// Declare global variables
var Sets;       // List of parsed sets
var Terms;      // List of filtered terms
var Term;       // Index of current term
var setId = 0;  // Next valid set id number



// Load the document
function Load() {
    // Load settings
    if (localStorage.getItem("darkMode") == "true") {
        document.body.classList.toggle("dark");
        document.getElementById("settingsDarkMode").checked = true;
    }
    if (localStorage.getItem("PromptType")) {
        document.getElementById("settingsPromptType").value = localStorage.getItem("PromptType");
    }
    if (localStorage.getItem("repeatPrompt")) {
        document.getElementById("settingsRepeatPrompts").value = localStorage.getItem("repeatPrompt");
    }

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

    // Load CSVs
    Sets = [];
    Papa.parse("Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Verbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Adjectives.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adjectives"] = results.data;
        }
    });
    Papa.parse("Vocab/Adverbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adverbs"] = results.data;
        }
    });
    Papa.parse("Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Prepositions"] = results.data;
        }
    });
    Papa.parse("Vocab/Colors.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Colors"] = results.data;
        }
    });
    Papa.parse("Vocab/Days.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Days"] = results.data;
        }
    });
    Papa.parse("Vocab/Months.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Months"] = results.data;
        }
    });
    Papa.parse("Vocab/Questions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Questions"] = results.data;
        }
    });
    Papa.parse("Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Weather"] = results.data;
        }
    });
    Papa.parse("Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Family"] = results.data;
        }
    });
    Papa.parse("Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Clothes"] = results.data;
        }
    });
    Papa.parse("Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Nature"] = results.data;
        }
    });
    Papa.parse("Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["House"] = results.data;
        }
    });
    Papa.parse("Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Vacation"] = results.data;
        }
    });
    Papa.parse("Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Childhood"] = results.data;
        }
    });
    Papa.parse("Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Professions"] = results.data;
        }
    });
    Papa.parse("Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Health"] = results.data;
        }
    });

    // Show and hide elements
    Reload();
}



// Reload the document
function Reload() {
    document.getElementById("settings").hidden = false;
    document.getElementById("settingsError").textContent = "";
    document.getElementById("quizzer").hidden = true;
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
    document.getElementById("settingsSetsInner").appendChild(clone);
    
    // Increment setId
    setId++; // increment fileId to get a unique ID for the new element
}



// Update the filter option
function settingsSetChanged(setName) {
    // Get filter options
    items = [];
    switch(setName.value)
    {
        case "Verbs":
            items = ["All Definitions", "All Conjugations", "Reverse Conjugations",
                    "Present Participles", "Present Tense", "Preterite Tense", "Imperfect Tense"];
            break;
        
        case "Adjectives":
        case "Adverbs":
        case "Prepositions":
        case "Colors":
        case "Days":
        case "Months":
        case "Questions":
            items = ["All Definitions", "English to Spanish", "Spanish to English"];
            break;

        case "Weather":
        case "Professions":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Verbs"];
            break;

        case "Family":
        case "Clothes":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Adjectives"];
            break;
        
        case "Nature":
        case "House":
        case "Vacation":
        case "Childhood":
        case "Health":
            items = ["All Definitions", "English to Spanish", "Spanish to English", 
                    "Nouns", "Verbs", "Adjectives"];
            break;
    }

    // Create html
    var html = ""
    for (var item of items) {
        html += "<option>" + item + "</option>"
    }

    // Set html
    filterId = setName.id.replace("settingsSetName", "settingsSetFilter");
    document.getElementById(filterId).innerHTML = html;
}



// Update local storage
function UpdateLocalStorage() {
    localStorage.clear();
    localStorage.setItem("darkMode", document.getElementById("settingsDarkMode").checked);
    localStorage.setItem("PromptType", document.getElementById("settingsPromptType").value);
    localStorage.setItem("repeatPrompt", document.getElementById("settingsRepeatPrompts").value);
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

    // Configure prompt audio
    if (document.getElementById("settingsPromptType").value != "Text") {
        document.getElementById("quizzerPrompt").classList.add("audio");
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