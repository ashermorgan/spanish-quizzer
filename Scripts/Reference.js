// Declare global variables
var Sets;       // List of parsed sets



// Load the document
function Load() {
    // Apply dark mode
    if (localStorage.getItem("darkMode") == "true") {
        document.body.classList.toggle("dark");
    }

    // Set table height
    setTableHeight();

    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });

    // Load CSVs
    Sets = [];
    Papa.parse("../Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Verbs"] = results.data;
        }
    });
    Papa.parse("../Vocab/Adjectives.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adjectives"] = results.data;
        }
    });
    Papa.parse("../Vocab/Adverbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Adverbs"] = results.data;
        }
    });
    Papa.parse("../Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Prepositions"] = results.data;
        }
    });
    Papa.parse("../Vocab/Transitions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Transitions"] = results.data;
        }
    });
    Papa.parse("../Vocab/Colors.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Colors"] = results.data;
        }
    });
    Papa.parse("../Vocab/Days.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Days"] = results.data;
        }
    });
    Papa.parse("../Vocab/Months.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Months"] = results.data;
        }
    });
    Papa.parse("../Vocab/Questions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Questions"] = results.data;
        }
    });
    Papa.parse("../Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Weather"] = results.data;
        }
    });
    Papa.parse("../Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Family"] = results.data;
        }
    });
    Papa.parse("../Vocab/Clothes.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Clothes"] = results.data;
        }
    });
    Papa.parse("../Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Nature"] = results.data;
        }
    });
    Papa.parse("../Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["House"] = results.data;
        }
    });
    Papa.parse("../Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Vacation"] = results.data;
        }
    });
    Papa.parse("../Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Childhood"] = results.data;
        }
    });
    Papa.parse("../Vocab/Professions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Professions"] = results.data;
        }
    });
    Papa.parse("../Vocab/Health.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets["Health"] = results.data;
        }
    });
}



// Set table height
function setTableHeight() {
    var tableY = document.getElementById("referenceTable").offsetTop;
    document.getElementById("referenceTable").style.height = `${window.innerHeight - tableY - 50}px`;
}



// Change the vocab set
function referenceSetChanged() {
    // Clear table
    if (document.getElementById("referenceSet").value == "Choose a vocab set") {
        document.getElementById("referenceTableInner").innerHTML = "";
        return;
    }

    // Get headers
    var head = '<tr>';
    for (column of Sets[document.getElementById("referenceSet").value][0]) {
        head += `<th>${column}</th>`;
    }
    head += "</tr>";
    
    // Get body
    var body = "";
    rows = Sets[document.getElementById("referenceSet").value].slice(1);
    for (var row = 0; row < rows.length; row++) {
        body += '<tr>';
        columns = rows[row];
        for (var column = 0; column < columns.length; column++) {
            body += `<td onclick="Read(${row + 1}, ${column})">${columns[column]}</td>`;
        }
        body += "</tr>";
    }

    // Add html
    document.getElementById("referenceTableInner").innerHTML = head + body;
}



// Reads a vocab word
function Read(row, column)
{
    var msg = new SpeechSynthesisUtterance(Sets[document.getElementById("referenceSet").value][row][column]);
    if (Sets[document.getElementById("referenceSet").value][0][column].toLowerCase().includes("english")) {
        msg.lang = 'en';
    }
    else if (Sets[document.getElementById("referenceSet").value][0][column].toLowerCase().includes("spanish")){
        msg.lang = 'es';
    }
    window.speechSynthesis.speak(msg);
}



// Filter the table
function referenceFilterChanged() {
    // Declare variables
    var match, txtValue
    var filter = document.getElementById("referenceFilter").value.toLowerCase();
    var rows = document.getElementById("referenceTableInner").getElementsByTagName("tr");

    // Loop through rows
    for (row of rows)
    {
        // Loop through columns
        match = false;
        row.style.display = "none";
        for (column of row.children)
        {
            // If a match hasn't already been found
            if (!match) {
                // Get text
                txtValue = column.textContent || column.innerText;

                // Look for match
                if (txtValue.toLowerCase().indexOf(filter) != -1) {
                    row.style.display = "";
                    match = true;
                }
            }
        }
    }

    // Make first row visible
    rows[0].style.display = "";
}