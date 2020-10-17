describe("Global.js", function() {
    describe("GetLang method", function () {
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
});
