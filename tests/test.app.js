describe("App", function() {
    beforeEach(function() {
        // Initialize Vue
        loadVue();
    });

    describe("Created lifecycle hook", function() {
        it("State should be 'home'", function() {
            expect(app.state).to.equal("home");
        });
        
        it("PromptType should be 'Text'", function() {
            expect(app.promptType).to.equal("Text");
        });

        it("InputType should be 'Text'", function() {
            expect(app.inputType).to.equal("Text");
        });

        it("OnMissedPrompt should be 'Correct me'", function() {
            expect(app.onMissedPrompt).to.equal("Correct me");
        });

        it("RepeatPrompts should be 'Never'", function() {
            expect(app.repeatPrompts).to.equal("Never");
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

    describe("StartSession method", function() {
        it("Should import parameter values", function() {
            // Call StartSession
            app.StartSession([1, 2, 3], 4, "a", "b", "c", "d");

            // Assert parameters imported
            expect(app.prompts).to.have.members([1, 2, 3]);
            expect(app.promptIndex).to.equal(4);
            expect(app.promptType).to.equal("a");
            expect(app.inputType).to.equal("b");
            expect(app.onMissedPrompt).to.equal("c");
            expect(app.repeatPrompts).to.equal("d");
        });

        it("Should set state to 'verbQuizzer' if state is 'verbSettings'", function() {
            // Initialize settings
            app.state = "verbSettings";

            // Call StartSession
            app.StartSession([1, 2, 3], 4, "a", "b", "c", "d");

            // Assert parameters imported
            expect(app.state).to.equal("verbQuizzer");
        });

        it("Should set state to 'vocabQuizzer' if state is 'vocabSettings'", function() {
            // Initialize settings
            app.state = "vocabSettings";

            // Call StartSession
            app.StartSession([1, 2, 3], 4, "a", "b", "c", "d");

            // Assert parameters imported
            expect(app.state).to.equal("vocabQuizzer");
        });
    });
});
