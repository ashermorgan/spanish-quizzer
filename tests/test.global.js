describe("Global.js", function() {
    describe("GetSettings method", function() {
        it("Settings should be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            let expected = {
                darkTheme: true,
                conjugationColors: true,

                promptType: "Audio",
                inputType: "Voice",
                multiplePrompts: "Show one",
                removeDuplicates: true,

                onMissedPrompt: "Tell me",
                repeatPrompts: "5 prompts later",
                multipleAnswers: "Require any",
            };
            localStorage.setItem("settings", JSON.stringify(expected));

            // Call getSettings
            let settings = getSettings();

            // Assert settings loaded
            expect(settings).to.deep.equal(expected);

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid individual settings should not be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "{\"promptType\":\"Audio\",\"inputType\":\"test\",\"onMissedPrompt\":null}")

            // Call getSettings
            let settings = getSettings();

            // Assert default settings loaded
            expect(settings.promptType).to.equal("Audio"); // promptType wasn't invalid, so it should still be loaded
            expect(settings.inputType).to.equal("Text");
            expect(settings.onMissedPrompt).to.equal("Correct me");
            expect(settings.repeatPrompts).to.equal("Never");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid JSON settings should not be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "asdf")

            // Call getSettings
            let settings = getSettings();

            // Assert default settings loaded
            expect(settings).to.deep.equal({
                darkTheme: false,
                conjugationColors: true,

                promptType: "Text",
                inputType: "Text",
                multiplePrompts: "Show together",
                removeDuplicates: false,

                onMissedPrompt: "Correct me",
                repeatPrompts: "Never",
                multipleAnswers: "Require all",
            });

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });

    describe("SetSettings method", function() {
        it("Should update setting in localStorage", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set settings
            let settings = {
                darkTheme : "A",
                conjugationColors: "B",

                promptType : "C",
                inputType : "D",
                multiplePrompts : "E",
                removeDuplicates : "F",

                onMissedPrompt : "G",
                repeatPrompts : "H",
                multipleAnswers : "I",
            }

            // Call setSettings
            setSettings(settings);

            // Assert localStorage setting updated
            expect(localStorage.getItem("settings")).to.equal(JSON.stringify(settings));

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });
});
