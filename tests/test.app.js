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

        it("Settings should be correctly loaded", function() {
            expect(app.settings).to.deep.equal(getSettings());
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
});
