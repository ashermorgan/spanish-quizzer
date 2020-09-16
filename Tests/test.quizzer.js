describe("Quizzer", function() {
    let Quizzer;
    beforeEach(function() {
        // Create quizzer component
        Quizzer = new quizzer();
    });

    describe("Initial state", function() {
        it("Active should be false", function() {
            expect(Quizzer.active).to.equal(false);
        });

        it("StartingPrompts should be empty", function() {
            expect(Quizzer.startingPrompts.length).to.equal(0);
        });

        it("StartingIndex should be 0", function() {
            expect(Quizzer.startingIndex).to.equal(0);
        });

        it("PromptType should be text", function() {
            expect(Quizzer.promptType).to.equal("Text");
        });

        it("InputType should be text", function() {
            expect(Quizzer.inputType).to.equal("Text");
        });

        it("RepeatPrompts should be never", function() {
            expect(Quizzer.repeatPrompts).to.equal("Never");
        });

        it("Prompts should be empty", function() {
            expect(Quizzer.prompts.length).to.equal(0);
        });

        it("Index should be 0", function() {
            expect(Quizzer.index).to.equal(0);
        });
        
        it("Responce should be empty", function() {
            expect(Quizzer.responce).to.equal("");
        });
        
        it("ResponceActive should be true", function() {
            expect(Quizzer.responceActive).to.equal(true);
        });
        
        it("CongratsActive should be true", function() {
            expect(Quizzer.congratsActive).to.equal(false);
        });
    });
    
    describe("Reset method", function() {
        it("Shouldn't do anything if active is false", function() {
            // Run Reset
            Quizzer.Reset();

            // Assert nothing changed
            expect(Quizzer.prompts.length).to.equal(0);
            expect(Quizzer.index).to.equal(0);
            expect(Quizzer.responce).to.equal("");
            expect(Quizzer.responceActive).to.equal(true);
            expect(Quizzer.congratsActive).to.equal(false);
        });
        
        it("Should set responceActive to true", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.responceActive = false;

            // Run reset
            Quizzer.Reset();

            // Assert responceActive is true
            expect(Quizzer.responceActive).to.equal(true);
        });
        
        it("Should set congratsActive to false", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.congratsActive = true;

            // Run reset
            Quizzer.Reset();

            // Assert congratsActive is true
            expect(Quizzer.congratsActive).to.equal(false);
        });
        
        it("Should set congratsActive to true if on last term", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 1;

            // Run reset
            Quizzer.Reset();

            // Assert congratsActive is true
            expect(Quizzer.congratsActive).to.equal(true);
        });

        it("Should reset responce", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.responce = "test";  // Set to empty string when reset is called
            expect(Quizzer.responce).to.equal("test");

            // Run reset
            Quizzer.Reset();

            // Assert reset called
            expect(Quizzer.responce).to.equal("");
        });
    });

    describe("Submit method", function() {
        beforeEach(function() {
            // Initialize Vue to avoid document.getElementById errors
            loadVue();
            app.state = "verbQuizzer";
        });

        it("Shouldn't do anything if active is false", function() {
            // Initialize variables
            Quizzer.responceActive = "test";  // Will be changed whether or not resopnce is correct
            
            // Run Submit
            Quizzer.Submit();

            // Assert nothing changed
            expect(Quizzer.responceActive).to.equal("test");
        });
        
        it("Should call Reset if responce is correct", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A4";

            // Call Submit
            Quizzer.Submit();

            // Assert Reset called
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });
    
        it("Should set responceActive to false if responce is incorrect", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A5";

            // Call Submit
            Quizzer.Submit();

            // Assert responceActive set to false
            expect(Quizzer.responceActive).to.equal(false);
        });
    
        it("Should accept multiple responces", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A1, A2, A3, A4";

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });

        it("Should accept multiple answers", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A1, A2, A3, A4"]]
            Quizzer.responce = "A1, A2, A3, A4";

            // Call Submit
            Quizzer.Submit();

            // Assert answer accepted
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });
        
        it("Should require all answers", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A1, A2, A3, A4"]]
            Quizzer.responce = "A1, A2, A3";

            // Call Submit
            Quizzer.Submit();

            // Assert answer no accepted
            expect(Quizzer.responceActive).to.equal(false);
        });
        
        it("Should accept mixed-case responces", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "a4";

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });

        it("Should accept responces with extra spaces", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "  a4  ";

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });
    
        it("Should convert accented characters", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "Á4"]]
            Quizzer.responce = "a`4";

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(Quizzer.congratsActive).to.equal(true);  // Reset will show congrats
        });
    });

    describe("Continue method", function() {
        it("Shouldn't do anything if active is false", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "At the end";
            Quizzer.responceActive = false;  // Will be changed if Reset is called
            
            // Run Continue
            Quizzer.Continue();

            // Assert nothing changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(0);
            expect(Quizzer.responceActive).to.equal(false);
        });

        it("Shouldn't change prompts if repeatPrompts is Never", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "Never";

            // Run Continue
            Quizzer.Continue();
            
            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(1);
        });

        it("Shouldn't change prompts if repeatPrompts isn't recognized", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "test";

            // Run Continue
            Quizzer.Continue();
            
            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(1);
        });

        it("Should only change index if repeatPrompts is Immediately", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "Immediately";

            // Run Continue
            Quizzer.Continue();
            
            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should only update prompts if repeatPrompts is 5 prompts later", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [
                ["A1", "A2", "A3", "A4"],
                ["B1", "B2", "B3", "B4"],
                ["C1", "C2", "C3", "C4"],
                ["D1", "D2", "D3", "D4"],
                ["E1", "E2", "E3", "E4"],
                ["F1", "F2", "F3", "F4"],
                ["G1", "G2", "G3", "G4"],
            ];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "5 prompts later";

            // Run Continue
            Quizzer.Continue();
            
            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts[1]).to.have.members(["C1", "C2", "C3", "C4"]);
            expect(Quizzer.prompts[2]).to.have.members(["D1", "D2", "D3", "D4"]);
            expect(Quizzer.prompts[3]).to.have.members(["E1", "E2", "E3", "E4"]);
            expect(Quizzer.prompts[4]).to.have.members(["F1", "F2", "F3", "F4"]);
            expect(Quizzer.prompts[5]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[6]).to.have.members(["G1", "G2", "G3", "G4"]);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should only update prompts if repeatPrompts is At the end", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [
                ["A1", "A2", "A3", "A4"],
                ["B1", "B2", "B3", "B4"],
                ["C1", "C2", "C3", "C4"],
                ["D1", "D2", "D3", "D4"],
                ["E1", "E2", "E3", "E4"],
                ["F1", "F2", "F3", "F4"],
                ["G1", "G2", "G3", "G4"],
            ];
            Quizzer.index = 0;
            Quizzer.repeatPrompts = "At the end";

            // Run Continue
            Quizzer.Continue();
            
            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts[1]).to.have.members(["C1", "C2", "C3", "C4"]);
            expect(Quizzer.prompts[2]).to.have.members(["D1", "D2", "D3", "D4"]);
            expect(Quizzer.prompts[3]).to.have.members(["E1", "E2", "E3", "E4"]);
            expect(Quizzer.prompts[4]).to.have.members(["F1", "F2", "F3", "F4"]);
            expect(Quizzer.prompts[5]).to.have.members(["G1", "G2", "G3", "G4"]);
            expect(Quizzer.prompts[6]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.index).to.equal(0);
        });
    });

    describe("Enter method", function() {
        it("Shouldn't do anything if active is false", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];  // Will change if Continue is called
            Quizzer.index = 0;  // Will be changed if Reset is called
            Quizzer.repeatPrompts = "At the end";
            
            // Run Enter
            Quizzer.Enter();

            // Assert nothing changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should call Submit if responceActive is true", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];  // Will change if Continue is called
            Quizzer.index = 0;  // Will be changed if Reset is called
            Quizzer.responce = "A4";
            Quizzer.repeatPrompts = "At the end";
            Quizzer.responceActive = true;

            // Run Enter
            Quizzer.Enter();

            // Assert Submit called
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(1);
        });

        it("Should call Continue if responceActive is false", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];  // Will change if Continue is called
            Quizzer.index = 0;  // Will be changed if Reset is called
            Quizzer.repeatPrompts = "At the end";
            Quizzer.responceActive = false;

            // Run Enter
            Quizzer.Enter();

            // Assert Continue called
            expect(Quizzer.prompts[0]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts[1]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.index).to.equal(0);
        });
    });

    describe("GetLang method", function () {
        it("Should return English by default", function() {
            expect(Quizzer.getLang("")).to.equal("en");
            expect(Quizzer.getLang("test")).to.equal("en");
        });
        
        it("Should return English for English labels", function() {
            expect(Quizzer.getLang("test english test")).to.equal("en");
            expect(Quizzer.getLang("ENGLISH")).to.equal("en");
        });
        
        it("Should return Spanish for Spanish labels", function() {
            expect(Quizzer.getLang("test spanish test")).to.equal("es");
            expect(Quizzer.getLang("SPANISH")).to.equal("es");
        });
    });

    describe("Active watch", function() {
        it("Should update prompts and index", async function() {
            // Initialize variables
            Quizzer.startingPrompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.startingIndex = 1;

            // Assert prompts and index not updated yet
            expect(Quizzer.prompts.length).to.equal(0);
            expect(Quizzer.index).to.equal(0);

            // Set active to true
            Quizzer.active = true;
            await Quizzer.$nextTick();

            // Assert prompts and index updated
            expect(Quizzer.prompts).to.have.deep.members([["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]]);
            expect(Quizzer.index).to.equal(1);
        });

        it("Should call Reset when set to true", async function() {
            // Initialize variables
            Quizzer.responce = "test";  // Set to empty string when reset is called
            expect(Quizzer.responce).to.equal("test");

            // Set active to true
            Quizzer.active = true;
            await Quizzer.$nextTick();

            // Assert reset called
            expect(Quizzer.responce).to.equal("");
        });
    });

    describe("Prompt property", function() {
        it("Should be empty if there aren't any prompt", function() {
            // Assert prompts and index are correct
            expect(Quizzer.index).to.equal(0);
            expect(Quizzer.prompts.length).to.equal(0);
            
            // Assert prompt is empty
            expect(Quizzer.prompt.length).to.equal(4);
            expect(Quizzer.prompt[0]).to.equal("");
            expect(Quizzer.prompt[1]).to.equal("");
            expect(Quizzer.prompt[2]).to.equal("");
            expect(Quizzer.prompt[3]).to.equal("");
        });
        
        it("Should be empty if index is invalid", function() {
            // Initialize index
            Quizzer.index = 2;
            
            // Assert prompts is correct
            expect(Quizzer.prompts.length).to.equal(0);
            
            // Assert prompt is empty
            expect(Quizzer.prompt.length).to.equal(4);
            expect(Quizzer.prompt[0]).to.equal("");
            expect(Quizzer.prompt[1]).to.equal("");
            expect(Quizzer.prompt[2]).to.equal("");
            expect(Quizzer.prompt[3]).to.equal("");
        });
        
        it("Should be the current prompt if index is valid", function() {
            // Initialize prompts and index
            Quizzer.index = 1;
            Quizzer.prompts = [
                ["a1", "b1", "c1", "d1"],
                ["a2", "b2", "c2", "d2"],
                ["a3", "b3", "c3", "d3"],
            ];
            
            // Assert prompt is correct
            expect(Quizzer.prompt.length).to.equal(4);
            expect(Quizzer.prompt[0]).to.equal("a2");
            expect(Quizzer.prompt[1]).to.equal("b2");
            expect(Quizzer.prompt[2]).to.equal("c2");
            expect(Quizzer.prompt[3]).to.equal("d2");
        });
    });
});
