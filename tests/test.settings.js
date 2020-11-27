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

    describe("GetVocabFilters method", function() {
        it("Should correctly filter vocab for All Definitions", function() {
            // Initialize expected
            let expected = [
                {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
            ];

            // Filter vocab
            let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Eng. ↔ Esp."}]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter vocab for multiple filters", function() {
            // Initialize expected
            let expected = [
                {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
                {set:"Months", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Verb"},
            ];

            // Filter vocab
            let actual = GetVocabFilters([
                {set:"Colors", type:"All Types", direction:"Eng. ↔ Esp."},
                {set:"Months", type:"Verbs", direction:"Esp. → Eng."},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Direction filters", function() {
            it("Should correctly filter vocab for English to Spanish", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Eng. → Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Spanish to English", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Esp. → Eng."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Word Type filters", function() {
            it("Should correctly filter vocab for Nouns", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Noun"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Nouns", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Adjectives", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Adjective"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Adjective"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Adjectives", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Verb"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Verbs", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should throw error for unknown word type", function() {
                expect(() => GetVocabFilters([{set:"Colors", type:"test",   direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:"",       direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:1,        direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:null,     direction:"Eng. ↔ Esp."}])).to.throw()
            });
        });
    });

    describe("GetVerbFilters method", function() {
        it("Should correctly filter verbs for All Conjugations", function() {
            // Initialize expected
            let expected = [
                {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
            ];

            // Filter verbs
            let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter verbs for multiple filters", function() {
            // Initialize expected
            let expected = [
                {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},

                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},

                {set:"Verbs", outputIndex:03, inputIndex:1, filterIndex:02, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:08, inputIndex:1, filterIndex:04, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:14, inputIndex:1, filterIndex:10, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:20, inputIndex:1, filterIndex:16, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:26, inputIndex:1, filterIndex:22, filterValue:"Stem.?Changing"},
            ];

            // Filter verbs
            let actual = GetVerbFilters([
                { tense:"all tenses",       subject:"all subjects", type:"Nonregular",      direction:"Eng. => Conj." },
                { tense:"present tense",    subject:"all subjects", type:"all types",       direction:"Eng. => Conj." },
                { tense:"all tenses",       subject:"nosotros",     type:"stem changing",   direction:"Conj. => Esp." }
            ]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Tense filters", function() {
            it("Should correctly filter verbs for Present Participles", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Present Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:5, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:6, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:7, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:8, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:9, filterIndex:4, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Preterite Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Preterite Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Imperfect Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Imperfect Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Simple Future Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Simple Future Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Regularity filters", function() {
            it("Should correctly filter regular verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Regular"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Regular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter reflexive verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Reflexive"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Reflexive", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter stem changing verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Stem.?Changing"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Stem Changing", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter orthographic verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Orthographic"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Orthographic", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter irregular verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"irregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nonregular verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Nonregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Subject filters", function() {
            it("Should correctly filter type subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:02, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:04, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:10, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:16, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:22, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"type", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter yo subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"yo", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter tú subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"tú", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter él subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"él", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nosotros subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"nosotros", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter ellos subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"ellos", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Direction filters", function() {
            it("Should correctly filter English to Conjugations", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Spanish to Conjugations", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:1, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Esp. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to English", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:3, inputIndex:0, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Eng."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to Spanish", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:3, inputIndex:1, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Esp."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });
    });

    describe("ApplyFilters method", function() {
        // Initialize vocab
        let vocab = {
            "set1": [
                ["Upper",   "Lower",    "Type1",        "Type2"],
                ["A",       "a",        "Noun",         "Vowel"],
                ["B",       "b",        "Adjective",    "Consonant"],
                ["C",       "c",        "Verb",         "Consonant"],
            ],
            "set2": [
                ["Upper",   "Lower",    "Type1",        "Type2"],
                ["Z",       "z",        "Noun",         "Consonant"],
                ["Y",       "y",        "Adjective",    "Vowel,Consonant"],
                ["X",       "x",        "Verb",         "Consonant"],
            ],
        };

        it("Should correctly filter different vocab sets", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Upper", "X", "Lower", "x"],
                ["Upper", "Y", "Lower", "y"],
                ["Upper", "Z", "Lower", "z"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set2", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter different outputIndexes", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Type2", "Vowel", "Lower", "a"],
                ["Type2", "Consonant", "Lower", "b"],
                ["Type2", "Consonant", "Lower", "c"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set1", outputIndex:3, inputIndex:1, filterIndex:2, filterValue:".*"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter different inputIndexes", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Upper", "A", "Type2", "Vowel"],
                ["Upper", "B", "Type2", "Consonant"],
                ["Upper", "C", "Type2", "Consonant"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set1", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter different filterIndexes and filtervalues", function() {
            // Initialize expected
            let expected = [
                ["Upper", "C", "Lower", "c"],
                ["Upper", "A", "Lower", "a"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"},
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:3, filterValue:"Vowel"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("multiplePrompts setting", function() {
            // Initialize vocab2
            let vocab2 = {
                "set1": [
                    ["Upper",       "Lower",    "Type1"],
                    ["A1, A2 , A3", "a",        "Noun"],
                    ["B1, B2",      "b",        "Adjective"],
                    ["C",           "c",        "Verb"],
                ],
            };

            it("Shouldn't effect single prompts", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "C",      "Lower", "c"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"}], "Show separately");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should't effect prompts if equal to 'Show together'", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1, A2 , A3", "Lower", "a"],
                    ["Upper", "B1, B2",     "Lower", "b"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show together");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should split up prompts if equal to 'Show separately'", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1", "Lower", "a"],
                    ["Upper", "A2", "Lower", "a"],
                    ["Upper", "A3", "Lower", "a"],
                    ["Upper", "B1", "Lower", "b"],
                    ["Upper", "B2", "Lower", "b"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show separately");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 0)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1",      "Lower", "a"],
                    ["Upper", "B1",      "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 0;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 0.5)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A2",    "Lower", "a"],
                    ["Upper", "B1",    "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 0.5;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 1)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A3",    "Lower", "a"],
                    ["Upper", "B2",    "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 1;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
            });
        });
    });

    describe("Shuffle method", function() {
        it("Should not alter list", function() {
            // Initialize list
            let list1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"];  // 15 items

            // Shuffle list
            let list2 = Shuffle(list1);

            // Assert list shuffled
            expect(list2.length).to.equal(list1.length);
            for (let item of list2) {
                expect(list1.includes(item)).to.equal(true);
            }
        });
    });
});
