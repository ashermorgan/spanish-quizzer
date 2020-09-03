// Declare global variables
var Sets;       // List of parsed sets
let app;



// Load the document
function Load() {
    // Initialize Vue
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            darkTheme: false
        },

        watch: {
            darkTheme: function() {
                // Get theme from localStorage if null
                if (this.darkTheme === null) {
                    this.darkTheme = JSON.parse(localStorage.getItem("darkTheme"));
                }

                // Detect preferred color scheme if null
                if (this.darkTheme === null) {
                    this.darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                }

                // Apply theme
                if (this.darkTheme) {
                    document.body.classList.add("dark");
                }
                else {
                    document.body.classList.remove("dark");
                }

                // Save theme
                localStorage.setItem("darkTheme", this.darkTheme);
            }
        }
    });

    // Load settings
    app.darkTheme = null;   // Force theme to update

    // Set table height
    setTableHeight();

    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });

    // Load CSVs
    Sets = [];
    let setNames = ["Verbs", "Adjectives", "Adverbs", "Prepositions", "Transitions",
                    "Colors", "Days", "Months", "Questions", "Weather", "Family", "Clothes",
                    "Nature", "House", "Vacation", "Childhood", "Professions", "Health"];
    for (let setName of setNames) {
        Papa.parse(`Vocab/${setName}.csv`, {
            download: true,
            complete: function(results) {
                // Set verbs
                Sets[setName] = results.data;
            }
        });
    }
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