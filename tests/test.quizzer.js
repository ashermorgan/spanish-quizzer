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

        it("Settings should be correct", function() {
            expect(Quizzer.settings.promptType).to.equal("Text");
            expect(Quizzer.settings.inputType).to.equal("Text");
            expect(Quizzer.settings.onMissedPrompt).to.equal("Correct me");
            expect(Quizzer.settings.repeatPrompts).to.equal("Never");
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
    });
    
    describe("Reset method", function() {
        it("Shouldn't do anything if active is false", function() {
            // Initialize quizzer
            Quizzer.prompts = [0, 1];
            Quizzer.index = 0;
            
            // Run Reset
            Quizzer.Reset();

            // Assert nothing changed
            expect(Quizzer.prompts).to.have.members([0, 1]);
            expect(Quizzer.index).to.equal(0);
            expect(Quizzer.responce).to.equal("");
            expect(Quizzer.responceActive).to.equal(true);
        });
        
        it("Should reset responce", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.responce = "test";
            expect(Quizzer.responce).to.equal("test");

            // Run reset
            Quizzer.Reset();

            // Assert reset called
            expect(Quizzer.responce).to.equal("");
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
        
        it("Should focus input", function() {
            // Initialize variables
            Quizzer.active = true;

            // Override focus method
            let focusCalled = true;
            Quizzer.$refs = {
                input: {
                    focus: function() {
                        focusCalled = true;
                    }        
                }
            };

            // Run reset
            Quizzer.Reset();

            // Assert focus called
            expect(focusCalled).to.equal(true);
        });
        
        it("Should emit 'new-prompts' event", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = ["prompt 1", "prompt 2"];
            Quizzer.index = 0;

            // Override $emit method
            let event = "";
            Quizzer.$emit = function(name) {
                event = name;
            };

            // Run reset
            Quizzer.Reset();

            // Assert event emited
            expect(event).to.equal("new-prompt");
        });

        it("Should emit 'finished-prompts' event if on last term", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = ["prompt 1", "prompt 2"];
            Quizzer.index = 1;

            // Override $emit method
            let event = "";
            Quizzer.$emit = function(name) {
                event = name;
            };

            // Run reset
            Quizzer.Reset();

            // Assert event emited
            expect(event).to.equal("finished-prompts");
        });
    });

    describe("Submit method", function() {
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

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert Reset called
            expect(resetCalled).to.equal(true);
        });
    
        it("Should call Continue if onMissedPrompt is set to 'Ignore it'", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.settings.onMissedPrompt = "Ignore it";
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.responce = "A5";

            // Override Continue method
            let continueCalled = false;
            Quizzer.Continue = function() {
                continueCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert Continue called
            expect(continueCalled).to.equal(true);
        });
    
        it("Should not call Reset if onMissedPrompt is set to 'Tell me'", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.onMissedPrompt = "Tell me";
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A5";

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert Reset not called
            expect(resetCalled).to.equal(false);
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
    
        it("Should focus input if responce is incorrect", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A5";

            // Override focus method
            let focusCalled = true;
            Quizzer.$refs = {
                input: {
                    focus: function() {
                        focusCalled = true;
                    }        
                }
            };

            // Call submit
            Quizzer.Submit();

            // Assert focus called
            expect(focusCalled).to.equal(true);
        });

        it("Should accept multiple responces", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A1, A2, A3, A4";

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(resetCalled).to.equal(true);
        });

        it("Should accept multiple answers", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A1, A2, A3, A4"]]
            Quizzer.responce = "A1, A2, A3, A4";

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(resetCalled).to.equal(true);
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

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(resetCalled).to.equal(true);
        });

        it("Should accept responces with extra spaces", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "  a4  ";

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(resetCalled).to.equal(true);
        });
    
        it("Should convert accented characters", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "Á4"]]
            Quizzer.responce = "a`4";

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Call Submit
            Quizzer.Submit();

            // Assert responce accepted
            expect(resetCalled).to.equal(true);
        });
    });

    describe("Continue method", function() {
        it("Shouldn't do anything if active is false", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;

            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };
            
            // Run Continue
            Quizzer.Continue();

            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.index).to.equal(0);

            // Assert Reset not called
            expect(resetCalled).to.equal(false);
        });

        it("Shouldn't change prompts if repeatPrompts is Never", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.settings.repeatPrompts = "Never";

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
            Quizzer.settings.repeatPrompts = "test";

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
            Quizzer.settings.repeatPrompts = "Immediately";

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
            Quizzer.settings.repeatPrompts = "5 prompts later";

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
            Quizzer.settings.repeatPrompts = "At the end";

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
            Quizzer.settings.repeatPrompts = "At the end";
            
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
            Quizzer.responceActive = true;
            
            // Override Submit and Continue methods
            let submitCalled = false;
            Quizzer.Submit = function() {
                submitCalled = true;
            };
            let continueCalled = false;
            Quizzer.Continue = function() {
                continueCalled = true;
            };

            // Run Enter
            Quizzer.Enter();

            // Assert Submit called
            expect(submitCalled).to.equal(true);
            expect(continueCalled).to.equal(false);
        });

        it("Should call Continue if responceActive is false", function() {
            // Initialize variables
            Quizzer.active = true;
            Quizzer.responceActive = false;
            
            // Override Submit and Continue methods
            let submitCalled = false;
            Quizzer.Submit = function() {
                submitCalled = true;
            };
            let continueCalled = false;
            Quizzer.Continue = function() {
                continueCalled = true;
            };

            // Run Enter
            Quizzer.Enter();

            // Assert Submit called
            expect(submitCalled).to.equal(false);
            expect(continueCalled).to.equal(true);
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
            // Override Reset method
            let resetCalled = false;
            Quizzer.Reset = function() {
                resetCalled = true;
            };

            // Set active to true
            Quizzer.active = true;
            await Quizzer.$nextTick();

            // Assert reset called
            expect(resetCalled).to.equal(true);
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
