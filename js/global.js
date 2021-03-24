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
}



/**
 * Load settings from localStorage.
 * @returns {Object} The settings.
 */
function getSettings() {
    // Initialize settings
    let settings = {
        darkTheme: false,
        conjugationColors: true,

        promptType: "Text",
        inputType: "Text",
        multiplePrompts: "Show together",
        removeDuplicates: false,

        onMissedPrompt: "Correct me",
        repeatPrompts: "Never",
        multipleAnswers: "Require all",
        showDiff: "For single answers",

        defaultFilters: {
            verbs: {tense:"All Tenses", type:"All Types", subject:"All Subjects", direction:"Eng. → Conj."},
            vocab: {category:"All Categories", type:"All Types", direction:"Eng. ↔ Esp."},
        },
    };

    // Detect prefered theme
    try {
        settings.darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    catch { }

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
    if ([true, false].includes(parsedSettings.conjugationColors)) {
        settings.conjugationColors = parsedSettings.conjugationColors;
    }

    if (["Text", "Audio", "Both"].includes(parsedSettings.promptType)) {
        settings.promptType = parsedSettings.promptType;
    }
    if (["Text", "Voice", "Either"].includes(parsedSettings.inputType)) {
        settings.inputType = parsedSettings.inputType;
    }
    if (["Show together", "Show separately", "Show one"].includes(parsedSettings.multiplePrompts)) {
        settings.multiplePrompts = parsedSettings.multiplePrompts;
    }
    if ([true, false].includes(parsedSettings.removeDuplicates)) {
        settings.removeDuplicates = parsedSettings.removeDuplicates;
    }

    if (["Correct me", "Tell me", "Ignore it"].includes(parsedSettings.onMissedPrompt)) {
        settings.onMissedPrompt = parsedSettings.onMissedPrompt;
    }
    if (["Never", "Immediately", "5 prompts later", "5 & 10 prompts later", "At the end"].includes(parsedSettings.repeatPrompts)) {
        settings.repeatPrompts = parsedSettings.repeatPrompts;
    }
    if (["Require all", "Require any"].includes(parsedSettings.multipleAnswers)) {
        settings.multipleAnswers = parsedSettings.multipleAnswers;
    }
    if (["Never", "For single answers", "Always"].includes(parsedSettings.showDiff)) {
        settings.showDiff = parsedSettings.showDiff;
    }

    if (parsedSettings.defaultFilters) {
        if (parsedSettings.defaultFilters.verbs) settings.defaultFilters.verbs = parsedSettings.defaultFilters.verbs;
        if (parsedSettings.defaultFilters.vocab) settings.defaultFilters.vocab = parsedSettings.defaultFilters.vocab;
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
