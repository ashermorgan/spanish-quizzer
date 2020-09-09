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

        it("Prompts should be empty", function() {
            expect(app.vocabFilters.length).to.equal(0);
        });

        it("PromptIndex should be 0", function() {
            expect(app.promptIndex).to.equal(0);
        });

        it("Responce should be empty", function() {
            expect(app.responce).to.equal("");
        });

        it("ResponceActive should be true", function() {
            expect(app.responceActive).to.equal(true);
        });
    });
});