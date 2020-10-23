/**
 * Set the app theme.
 * @param {Boolean} darkTheme - Whether to use the dark theme. If null, a theme will be automatically chosen.
 */
function SetTheme(darkTheme = null) {
    // Get theme from localStorage if null
    if (darkTheme === null) {
        try {
            darkTheme = JSON.parse(localStorage.getItem("darkTheme"));
        }
        catch { }
    }

    // Detect preferred color scheme if null
    if (darkTheme === null) {
        try {
            darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
        catch { }
    }

    // Apply theme
    if (darkTheme) {
        document.body.classList.add("dark");
    }
    else {
        document.body.classList.remove("dark");
    }

    // Save theme
    localStorage.setItem("darkTheme", darkTheme);
}



/**
 * Loads the page.
 */
function LoadPage() {
    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });

    // Update theme
    SetTheme(null);
}



/**
 * Get the language code that matches a label.
 * @param {String} label - The label.
 * @returns {String} - The language code ("en", "es", etc.)
 */
function getLang(label) {
    if (label.toLowerCase().includes("spanish")) {
        return "es";
    }
    else {
        return "en";
    }
}



/**
 * Read a peice of text.
 * @param {String} text - The text to read.
 * @param {String} label - The language of the text.
 */
function Read(text, label)
{
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = getLang(label);
    window.speechSynthesis.speak(msg);
}
