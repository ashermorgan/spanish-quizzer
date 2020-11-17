describe("App", function() {
    beforeEach(function() {
        // Initialize Vue
        loadVue();
    });

    describe("Created lifecycle hook", function() {
        it("State should be 'home'", function() {
            expect(app.state).to.equal("home");
        });
        
        it("Category should be 'verbs'", function() {
            expect(app.category).to.equal("verbs");
        });
        
        it("Settings should be correct", function() {
            expect(app.settings.promptType).to.equal("Text");
            expect(app.settings.inputType).to.equal("Text");
            expect(app.settings.onMissedPrompt).to.equal("Correct me");
            expect(app.settings.repeatPrompts).to.equal("Never");
            expect(app.settings.multiplePrompts).to.equal("Show together");
            expect(app.settings.multipleAnswers).to.equal("Require all");
        });

        it("Prompts should be empty", function() {
            expect(app.prompts.length).to.equal(0);
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
            app.state = "settings";
            app.Back();
            expect(app.state).to.equal("home");
        });
        
        it("Should go to settings when on quizzer", function() {
            // Set state and test Back method
            app.state = "quizzer";
            app.Back();
            expect(app.state).to.equal("settings");
        });
    });

    describe("StartSession method", function() {
        it("Should import parameter values", function() {
            // Call StartSession
            app.StartSession([1, 2, 3], 4, {
                promptType: "Text",     // Required to prevent browser validation alerts
                inputType: "Text",      // Required to prevent browser validation alerts
                testSetting: "testValue",
            });

            // Assert parameters imported
            expect(app.prompts).to.have.members([1, 2, 3]);
            expect(app.promptIndex).to.equal(4);
            expect(app.settings.testSetting).to.equal("testValue");
        });

        it("Should set state to 'quizzer'", function() {
            // Initialize settings
            app.state = "settings";

            // Call StartSession
            app.StartSession([1, 2, 3], 4, {
                promptType: "Text",     // Required to prevent browser validation alerts
                inputType: "Text",      // Required to prevent browser validation alerts
                testSetting: "testValue",
            });

            // Assert parameters imported
            expect(app.state).to.equal("quizzer");
        });
    });
});
