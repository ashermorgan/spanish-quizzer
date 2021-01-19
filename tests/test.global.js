describe("Global.js", function() {
    describe("GetLang method", function() {
        it("Should return English by default", function() {
            expect(getLang("")).to.equal("en");
            expect(getLang("test")).to.equal("en");
        });

        it("Should return English for English labels", function() {
            expect(getLang("test english test")).to.equal("en");
            expect(getLang("ENGLISH")).to.equal("en");
        })

        it("Should return Spanish for Spanish labels", function() {
            expect(getLang("test spanish test")).to.equal("es");
            expect(getLang("SPANISH")).to.equal("es");
        })
    });

    describe("GetSettings method", function() {
        it("Settings should be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            let expected = {
                darkTheme: true,
                promptType: "Audio",
                inputType: "Voice",
                onMissedPrompt: "Tell me",
                repeatPrompts: "5 prompts later",
                multiplePrompts: "Show one",
                multipleAnswers: "Require any",
                removeDuplicates: true,
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
            expect(settings.promptType).to.equal("Text");
            expect(settings.inputType).to.equal("Text");
            expect(settings.onMissedPrompt).to.equal("Correct me");
            expect(settings.repeatPrompts).to.equal("Never");
            expect(settings.multiplePrompts).to.equal("Show together");
            expect(settings.multipleAnswers).to.equal("Require all");
            expect(settings.removeDuplicates).to.equal(false);

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
                promptType : "B",
                inputType : "C",
                onMissedPrompt : "D",
                repeatPrompts : "E",
                multiplePrompts : "F",
                multipleAnswers : "G",
                removeDuplicates : "H",
            }

            // Call setSettings
            setSettings(settings);

            // Assert localStorage setting updated
            expect(localStorage.getItem("settings")).to.equal(`{"darkTheme":"A","promptType":"B","inputType":"C","onMissedPrompt":"D","repeatPrompts":"E","multiplePrompts":"F","multipleAnswers":"G","removeDuplicates":"H"}`);

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });
});
