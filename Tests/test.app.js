describe("App", function() {
    beforeEach(function() {
        // Initialize Vue
        loadVue();
    });

    describe("Created lifecycle hook", function() {
        it("State should be 'home'", function() {
            expect(app.state).to.equal("home");
        });
        
        it("VerFilters should be empty", function() {
            expect(app.verbFilters.length).to.equal(0);
        });

        it("VocabFilters should be empty", function() {
            expect(app.vocabFilters.length).to.equal(0);
        });

        it("ErrorMsg should be empty", function() {
            expect(app.errorMsg).to.equal("");
        });

        it("Prompts should be empty", function() {
            expect(app.vocabFilters.length).to.equal(0);
        });

        it("PromptIndex should be 0", function() {
            expect(app.promptIndex).to.equal(0);
        });
    });

    describe("Back method", function() {
        it("Should go to home by default", function() {
            // Set state and test Back method
            app.state = "home";
            app.Back();
            expect(app.state).to.equal("home");
            
            // Set state and test Back method again
            app.state = "";
            app.Back();
            expect(app.state).to.equal("home");
            
            // Set state and test Back method again
            app.state = "test";
            app.Back();
            expect(app.state).to.equal("home");
        });

        it("Should go to home when on settings", function() {
            // Set state and test Back method
            app.state = "verbSettings";
            app.Back();
            expect(app.state).to.equal("home");
            
            // Set state and test Back method again
            app.state = "vocabSettings";
            app.Back();
            expect(app.state).to.equal("home");
        });
        
        it("Should go to verb settings when on verb quizzer", function() {
            // Set state and test Back method
            app.state = "verbQuizzer";
            app.Back();
            expect(app.state).to.equal("verbSettings");
        });
        
        it("Should go to vocab settings when on vocab quizzer", function() {
            // Set state and test Back method
            app.state = "vocabQuizzer";
            app.Back();
            expect(app.state).to.equal("vocabSettings");
        });
    });

    describe("AddVerbFilter method", function() {
        it("Should add a verb filter", function() {
            // Assert filters is empty
            expect(app.verbFilters.length).to.equal(0);

            // Add filter
            app.AddVerbFilter();

            // Assert filter added
            expect(app.verbFilters.length).to.equal(1);
            expect(app.verbFilters[0]["tense"]).to.equal("All Tenses");
            expect(app.verbFilters[0]["type"]).to.equal("All Types");
        });
    });

    describe("RemoveVerbFilter method", function() {
        it("Should remove the specified filter", function() {
            // Initialize filters
            app.verbFilters = [
                {"tense":"Present Tense", "type":"All Types"},
                {"tense":"Preterite Tense", "type":"All Types"},
                {"tense":"Imperfect Tense", "type":"All Types"}
            ]

            // Remove filter
            app.RemoveVerbFilter(1);

            // Assert filter removed
            expect(app.verbFilters.length).to.equal(2);
            expect(app.verbFilters[0]["tense"]).to.equal("Present Tense");
            expect(app.verbFilters[0]["type"]).to.equal("All Types");
            expect(app.verbFilters[1]["tense"]).to.equal("Imperfect Tense");
            expect(app.verbFilters[1]["type"]).to.equal("All Types");
        });
    });

    describe("AddVocabFilter method", function() {
        it("Should add a vocab filter", function() {
            // Assert filters is empty
            expect(app.vocabFilters.length).to.equal(0);

            // Add filter
            app.AddVocabFilter();

            // Assert filter added
            expect(app.vocabFilters.length).to.equal(1);
            expect(app.vocabFilters[0]["set"]).to.equal("Verbs");
            expect(app.vocabFilters[0]["type"]).to.equal("All Definitions");
        });
    });

    describe("RemoveVocabFilter method", function() {
        it("Should remove the specified filter", function() {
            // Initialize filters
            app.vocabFilters = [
                {"set":"Verbs", "type":"All Definitions"},
                {"set":"Adjectives", "type":"All Definitions"},
                {"set":"Adverbs", "type":"All Definitions"},
            ]

            // Remove filter
            app.RemoveVocabFilter(1);

            // Assert filter removed
            expect(app.vocabFilters.length).to.equal(2);
            expect(app.vocabFilters[0]["set"]).to.equal("Verbs");
            expect(app.vocabFilters[0]["type"]).to.equal("All Definitions");
            expect(app.vocabFilters[1]["set"]).to.equal("Adverbs");
            expect(app.vocabFilters[1]["type"]).to.equal("All Definitions");
        });
    });

    describe("GetTenseTypes method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            app.verbFilters = [
                {"tense":"All Types", "type":"All Types"}
            ]

            // Get filters
            let filters = app.getTenseTypes(0);

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
            app.verbFilters = [
                {"tense":"Present Tense", "type":"All Types"}
            ]

            // Get filters
            let filters = app.getTenseTypes(0);

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
            app.verbFilters = [
                {"tense":"Present Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = app.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection changed
            expect(app.verbFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            app.verbFilters = [
                {"tense":"Preterite Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = app.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection not changed
            expect(app.verbFilters[0]["type"]).to.equal("Orthographic");
        });
    });

    describe("GetSetFilters method", function() {
        it("Should be correct for Verbs", function() {
            // Initialize filters
            app.vocabFilters = [
                {"set":"Verbs", "type":"All Definitions"}
            ]

            // Get filters
            let actual = app.getSetFilters(0);

            // Assert filters are correct
            let expected = ["All Definitions", "Spanish Infinitives", "English Infinitives", "Reverse Conjugations"];
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i]).to.equal(expected[i]);
            }
        });
        
        it("Should be correct for sets with 1 type", function() {
            // Initialize filters
            app.vocabFilters = [
                {"set":"Colors", "type":"All Definitions"}
            ]

            // Get filters
            let actual = app.getSetFilters(0);

            // Assert filters are correct
            let expected = ["All Definitions", "English to Spanish", "Spanish to English"];
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i]).to.equal(expected[i]);
            }
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            app.vocabFilters = [
                {"set":"Colors", "type":"Verbs"}
            ]

            // Get filters
            app.getSetFilters(0);

            // Assert selection changed
            expect(app.vocabFilters[0]["type"]).to.equal("All Definitions");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            app.vocabFilters = [
                {"set":"Professions", "type":"Verbs"}
            ]

            // Get filters
            app.getSetFilters(0);

            // Assert selection not changed
            expect(app.vocabFilters[0]["type"]).to.equal("Verbs");
        });
    });
    
    describe("GetLang method", function () {
        it("Should return English by default", function() {
            expect(app.getLang("")).to.equal("en");
            expect(app.getLang("test")).to.equal("en");
        });
        
        it("Should return English for English labels", function() {
            expect(app.getLang("test english test")).to.equal("en");
            expect(app.getLang("ENGLISH")).to.equal("en");
        })
        
        it("Should return Spanish for Spanish labels", function() {
            expect(app.getLang("test spanish test")).to.equal("es");
            expect(app.getLang("SPANISH")).to.equal("es");
        })
    });

    describe("PromptType watch", function() {
        it("Should update setting in localStorage", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("promptType");

            // Set promptType
            app.promptType = "test";

            // Assert localStorage setting updated
            expect(localStorage.getItem("promptType")).to.equal("test");

            // Restore original setting to localStorage
            localStorage.setItem("promptType", originalValue);
        });
    });

    describe("InputType watch", function() {
        it("Should update setting in localStorage", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("inputType");

            // Set inputType
            app.inputType = "test";

            // Assert localStorage setting updated
            expect(localStorage.getItem("inputType")).to.equal("test");

            // Restore original setting to localStorage
            localStorage.setItem("inputType", originalValue);
        });
    });

    describe("RepeatPrompts watch", function() {
        it("Should update setting in localStorage", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("repeatPrompts");

            // Set repeatPrompts
            app.repeatPrompts = "test";

            // Assert localStorage setting updated
            expect(localStorage.getItem("repeatPrompts")).to.equal("test");

            // Restore original setting to localStorage
            localStorage.setItem("repeatPrompts", originalValue);
        });
    });
});
