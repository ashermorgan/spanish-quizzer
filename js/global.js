/**
 * Set the app theme.
 * @param {Boolean} darkTheme - Whether to use the dark theme. If null, a theme will be automatically chosen.
 */
function SetTheme(darkTheme = null) {
    // Get theme if null
    if (darkTheme === null) {
        darkTheme = getSettings().darkTheme;
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



/**
 * Load settings from localStorage.
 * @returns {Object} The settings.
 */
function getSettings() {
    // Initialize settings
    let settings = {
        darkTheme: false,
        promptType: "Text",
        inputType: "Text",
        onMissedPrompt: "Correct me",
        repeatPrompts: "Never",
        multiplePrompts: "Show together",
        multipleAnswers: "Require all",
        removeDuplicates: false,
    };

    // Parse settings
    let parsedSettings;
    try {
        parsedSettings = JSON.parse(localStorage.getItem("settings"));
    }
    catch { return settings; }
    if (!parsedSettings) { return settings; }

    // Load settings
    if ([true, false].includes(parsedSettings.darkTheme)) {
        settings.darkTheme = parsedSettings.darkTheme;
    }
    else {
        try {
            settings.darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
        catch { }
    }
    if (["Text", "Audio", "Both"].includes(parsedSettings.promptType)) {
        settings.promptType = parsedSettings.promptType;
    }
    if (["Text", "Voice", "Either"].includes(parsedSettings.inputType)) {
        settings.inputType = parsedSettings.inputType;
    }
    if (["Correct me", "Tell me", "Ignore it"].includes(parsedSettings.onMissedPrompt)) {
        settings.onMissedPrompt = parsedSettings.onMissedPrompt;
    }
    if (["Never", "Immediately", "5 prompts later", "5 & 10 prompts later", "At the end"].includes(parsedSettings.repeatPrompts)) {
        settings.repeatPrompts = parsedSettings.repeatPrompts;
    }
    if (["Show together", "Show separately", "Show one"].includes(parsedSettings.multiplePrompts)) {
        settings.multiplePrompts = parsedSettings.multiplePrompts;
    }
    if (["Require all", "Require any"].includes(parsedSettings.multipleAnswers)) {
        settings.multipleAnswers = parsedSettings.multipleAnswers;
    }
    if ([true, false].includes(parsedSettings.removeDuplicates)) {
        settings.removeDuplicates = parsedSettings.removeDuplicates;
    }

    // Return parsed settings
    return settings;
}



/**
 * Save settings to localStorage.
 * @param {Object} value The settings.
 */
function setSettings(value) {
    // Update settings in localStorage
    localStorage.setItem("settings", JSON.stringify(value));

    // Apply theme
    SetTheme(value.darkTheme);
}



/**
 * Loads Spanish-Quizzer data.
 */
function loadData() {
    return new Promise(function(resolve, reject) {
        // Initialize variables
        let setNames = ["verbs", "vocab"];
        let progress = 0;
        let sets = {};

        // Load data
        for (let setName of setNames) {
            Papa.parse(`data/${setName}.csv`, {
                download: true,
                complete: function(results) {
                    sets[setName] = results.data;
                    progress++;

                    if (progress === setNames.length) {
                        resolve(sets);
                    }
                }
            });
        }
    });
}
