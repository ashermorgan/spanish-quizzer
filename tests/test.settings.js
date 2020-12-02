describe("Settings", function() {
    let Settings;
    beforeEach(function() {
        // Create settings component
        Settings = new settings();
    });

    describe("Created lifecycle hook", function() {
        it("Category should be 'verbs'", function() {
            expect(Settings.category).to.equal("verbs");
        });

        it("VerFilters should be empty", function() {
            expect(Settings.verbFilters.length).to.equal(0);
        });

        it("VocabFilters should be empty", function() {
            expect(Settings.vocabFilters.length).to.equal(0);
        });

        it("Settings should be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "{\"promptType\":\"Audio\",\"inputType\":\"Voice\",\"onMissedPrompt\":\"Tell me\",\"repeatPrompts\":\"5 prompts later\"}")

            // (re)Create settings component
            Settings = new settings();
            await Settings.$nextTick(); // Allow Settings to update localStorage (so we can override it later)

            // Assert settings loaded
            expect(Settings.settings.promptType).to.equal("Audio");
            expect(Settings.settings.inputType).to.equal("Voice");
            expect(Settings.settings.onMissedPrompt).to.equal("Tell me");
            expect(Settings.settings.repeatPrompts).to.equal("5 prompts later");
            expect(Settings.settings.multiplePrompts).to.equal("Show together");
            expect(Settings.settings.multipleAnswers).to.equal("Require all");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid individual settings should not be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "{\"promptType\":\"Audio\",\"inputType\":\"test\",\"onMissedPrompt\":null}")

            // (re)Create settings component
            Settings = new settings();
            await Settings.$nextTick(); // Allow Settings to update localStorage (so we can override it later)

            // Assert default settings loaded
            expect(Settings.settings.promptType).to.equal("Audio"); // promptType wasn't invalid, so it should still be loaded
            expect(Settings.settings.inputType).to.equal("Text");
            expect(Settings.settings.onMissedPrompt).to.equal("Correct me");
            expect(Settings.settings.repeatPrompts).to.equal("Never");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid JSON settings should not be loaded", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "asdf")

            // (re)Create settings component
            Settings = new settings();
            await Settings.$nextTick(); // Allow Settings to update localStorage (so we can override it later)

            // Assert default settings loaded
            expect(Settings.settings.promptType).to.equal("Text");
            expect(Settings.settings.inputType).to.equal("Text");
            expect(Settings.settings.onMissedPrompt).to.equal("Correct me");
            expect(Settings.settings.repeatPrompts).to.equal("Never");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });

    describe("AddFilter method", function() {
        it("Should add a verb filter if category is 'verbs'", function() {
            // Initialize variables
            Settings.category = "verbs";
            expect(Settings.verbFilters.length).to.equal(0);
            expect(Settings.vocabFilters.length).to.equal(0);

            // Add filter
            Settings.AddFilter();

            // Assert filter added
            expect(Settings.verbFilters).to.have.deep.members([
                {tense:"All Tenses", type:"All Types", subject:"All Subjects", direction:"Eng. → Conj."},
            ]);
            expect(Settings.vocabFilters).to.have.deep.members([]);
        });

        it("Should add a vocab filter if category is 'vocab'", function() {
            // Initialize variables
            Settings.category = "vocab";
            expect(Settings.verbFilters.length).to.equal(0);
            expect(Settings.vocabFilters.length).to.equal(0);

            // Add filter
            Settings.AddFilter();

            // Assert filter added
            expect(Settings.vocabFilters).to.have.deep.members([
                {set:"All Sets", type:"All Types", direction:"Eng. ↔ Esp."},
            ]);
            expect(Settings.verbFilters).to.have.deep.members([]);
        });
    });

    describe("RemoveFilter method", function() {
        it("Should remove the specified verb filter", function() {
            // Initialize filters
            Settings.category = "verbs";
            Settings.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            Settings.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            Settings.RemoveFilter(1);

            // Assert filter removed
            expect(Settings.verbFilters.length).to.equal(2);
            expect(Settings.verbFilters[0]).to.equal("verb1");
            expect(Settings.verbFilters[1]).to.equal("verb3");
            expect(Settings.vocabFilters.length).to.equal(3);
        });

        it("Should remove the specified vocab filter", function() {
            // Initialize filters
            Settings.category = "vocab";
            Settings.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            Settings.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            Settings.RemoveFilter(1);

            // Assert filter removed
            expect(Settings.verbFilters.length).to.equal(3);
            expect(Settings.vocabFilters.length).to.equal(2);
            expect(Settings.vocabFilters[0]).to.equal("vocab1");
            expect(Settings.vocabFilters[1]).to.equal("vocab3");
        });
    });

    describe("GetTenseTypes method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"All Types", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);
        });

        it("Should be correct for Present Tense", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Tense", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection changed
            expect(Settings.verbFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Preterite Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection not changed
            expect(Settings.verbFilters[0]["type"]).to.equal("Orthographic");
        });
    });

    describe("GetTenseSubjects method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"All Types", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(true);
            expect(filters["Tú"]).to.equal(true);
            expect(filters["Él"]).to.equal(true);
            expect(filters["Nosotros"]).to.equal(true);
            expect(filters["Ellos"]).to.equal(true);
        });

        it("Should be correct for Present Participles", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Participles", "subject":"All Subjects", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Participles", "subject":"Yo", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);

            // Assert selection changed
            expect(Settings.verbFilters[0]["subject"]).to.equal("All Subjects");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Participles", "subject":"Type", "type":"All Types"},
                {"tense":"Preterite Tense", "subject":"Yo", "type":"All Types"},
            ]

            // Get filters
            Settings.getTenseSubjects(0);
            Settings.getTenseSubjects(1);

            // Assert selection not changed
            expect(Settings.verbFilters[0].subject).to.equal("Type");
            expect(Settings.verbFilters[1].subject).to.equal("Yo");
        });
    });

    describe("GetSetFilters method", function() {
        it("Should be correct for Verbs", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Verbs", "type":"All Definitions"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should be correct for sets with 1 type", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Colors", "type":"All Definitions"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Colors", "type":"Verbs"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert selection changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
            expect(Settings.vocabFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Professions", "type":"Verbs"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert selection not changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(true);
            expect(filters["Verbs"]).to.equal(true);
            expect(Settings.vocabFilters[0]["type"]).to.equal("Verbs");
        });
    });

    describe("Settings watch", function() {
        it("Should update setting in localStorage", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set settings
            Settings.settings.promptType = "A";
            Settings.settings.inputType = "B";
            Settings.settings.onMissedPrompt = "C";
            Settings.settings.repeatPrompts = "D";
            Settings.settings.multiplePrompts = "E";
            Settings.settings.multipleAnswers = "F";
            await Settings.$nextTick();

            // Assert localStorage setting updated
            expect(localStorage.getItem("settings")).to.equal(`{"promptType":"A","inputType":"B","onMissedPrompt":"C","repeatPrompts":"D","multiplePrompts":"E","multipleAnswers":"F"}`);

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });
});
