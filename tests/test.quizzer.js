describe("Quizzer", function() {
    let Quizzer;
    let originalSettings;
    beforeEach(function() {
        // Create quizzer component
        Quizzer = new quizzer();

        // Override quizzer settings
        originalSettings = Quizzer.settings;
        Quizzer.settings = {
            promptType: "Text",
            inputType: "Text",
            onMissedPrompt: "Correct me",
            repeatPrompts: "Never",
            multipleAnswers: "Require all",
        };
    });

    describe("Initial state", function() {
        it("StartingPrompts should be empty", function() {
            expect(Quizzer.startingPrompts.length).to.equal(0);
        });

        it("StartingIndex should be 0", function() {
            expect(Quizzer.startingIndex).to.equal(0);
        });

        it("Settings should be correct", function() {
            expect(originalSettings).to.deep.equal(getSettings());
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
        it("Should reset responce", function() {
            // Initialize variables
            Quizzer.prompts = ["prompt 1", "prompt 2"];
            Quizzer.index = 0;
            Quizzer.responce = "test";
            expect(Quizzer.responce).to.equal("test");

            // Run reset
            Quizzer.Reset();

            // Assert reset called
            expect(Quizzer.responce).to.equal("");
        });

        it("Should set responceActive to true", function() {
            // Initialize variables
            Quizzer.prompts = ["prompt 1", "prompt 2"];
            Quizzer.index = 0;
            Quizzer.responceActive = false;

            // Run reset
            Quizzer.Reset();

            // Assert responceActive is true
            expect(Quizzer.responceActive).to.equal(true);
        });

        it("Should focus input", function() {
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
    });

    describe("Submit method", function() {
        it("Should call Reset if responce is correct", function() {
            // Initialize variables
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
            Quizzer.settings.onMissedPrompt = "Tell me";
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
            Quizzer.prompts = [["A1", "A2", "A3", "A4"]]
            Quizzer.responce = "A5";

            // Call Submit
            Quizzer.Submit();

            // Assert responceActive set to false
            expect(Quizzer.responceActive).to.equal(false);
        });

        it("Should focus input if responce is incorrect", function() {
            // Initialize variables
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

        it("Should require all answers if multipleAnswers is set to 'Require all'", function() {
            // Initialize variables
            Quizzer.settings.multipleAnswers = "Require all";
            Quizzer.prompts = [["A1", "A2", "A3", "A1, A2, A3, A4"]]
            Quizzer.responce = "A1, A2, A3";

            // Call Submit
            Quizzer.Submit();

            // Assert answer not accepted
            expect(Quizzer.responceActive).to.equal(false);
        });

        it("Shouldn't require all answers if multipleAnswers is set to 'Require any'", function() {
            // Initialize variables
            Quizzer.settings.multipleAnswers = "Require any";
            Quizzer.prompts = [["A1", "A2", "A3", "A1, A2, A3, A4"]]
            Quizzer.responce = "A1, A2, A3";

            // Call Submit
            Quizzer.Submit();

            // Assert answer accepted
            expect(Quizzer.responceActive).to.equal(true);
        });

        it("Should accept mixed-case responces", function() {
            // Initialize variables
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
        it("Shouldn't change prompts if repeatPrompts is Never", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.settings.repeatPrompts = "Never";

            // Run Continue
            Quizzer.Continue();

            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts.length).to.equal(2);
            expect(Quizzer.index).to.equal(1);
        });

        it("Shouldn't change prompts if repeatPrompts isn't recognized", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.settings.repeatPrompts = "test";

            // Run Continue
            Quizzer.Continue();

            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts.length).to.equal(2);
            expect(Quizzer.index).to.equal(1);
        });

        it("Should only change index if repeatPrompts is Immediately", function() {
            // Initialize variables
            Quizzer.prompts = [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]];
            Quizzer.index = 0;
            Quizzer.settings.repeatPrompts = "Immediately";

            // Run Continue
            Quizzer.Continue();

            // Assert prompts not changed
            expect(Quizzer.prompts[0]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[1]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts.length).to.equal(2);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should only update prompts if repeatPrompts is 5 prompts later", function() {
            // Initialize variables
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
            expect(Quizzer.prompts.length).to.equal(7);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should only update prompts if repeatPrompts is 5 & 10 prompts later", function() {
            // Initialize variables
            Quizzer.prompts = [
                ["A1", "A2", "A3", "A4"],
                ["B1", "B2", "B3", "B4"],
                ["C1", "C2", "C3", "C4"],
                ["D1", "D2", "D3", "D4"],
                ["E1", "E2", "E3", "E4"],
                ["F1", "F2", "F3", "F4"],
                ["G1", "G2", "G3", "G4"],
                ["H1", "H2", "H3", "H4"],
                ["I1", "I2", "I3", "I4"],
                ["J1", "J2", "J3", "J4"],
                ["K1", "K2", "K3", "K4"],
                ["L1", "L2", "L3", "L4"],
            ];
            Quizzer.index = 0;
            Quizzer.settings.repeatPrompts = "5 & 10 prompts later";

            // Run Continue
            Quizzer.Continue();

            // Assert prompts not changed
            expect(Quizzer.prompts[00]).to.have.members(["B1", "B2", "B3", "B4"]);
            expect(Quizzer.prompts[01]).to.have.members(["C1", "C2", "C3", "C4"]);
            expect(Quizzer.prompts[02]).to.have.members(["D1", "D2", "D3", "D4"]);
            expect(Quizzer.prompts[03]).to.have.members(["E1", "E2", "E3", "E4"]);
            expect(Quizzer.prompts[04]).to.have.members(["F1", "F2", "F3", "F4"]);
            expect(Quizzer.prompts[05]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[06]).to.have.members(["G1", "G2", "G3", "G4"]);
            expect(Quizzer.prompts[07]).to.have.members(["H1", "H2", "H3", "H4"]);
            expect(Quizzer.prompts[08]).to.have.members(["I1", "I2", "I3", "I4"]);
            expect(Quizzer.prompts[09]).to.have.members(["J1", "J2", "J3", "J4"]);
            expect(Quizzer.prompts[10]).to.have.members(["K1", "K2", "K3", "K4"]);
            expect(Quizzer.prompts[11]).to.have.members(["A1", "A2", "A3", "A4"]);
            expect(Quizzer.prompts[12]).to.have.members(["L1", "L2", "L3", "L4"]);
            expect(Quizzer.prompts.length).to.equal(13);
            expect(Quizzer.index).to.equal(0);
        });

        it("Should only update prompts if repeatPrompts is At the end", function() {
            // Initialize variables
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
            expect(Quizzer.prompts.length).to.equal(7);
            expect(Quizzer.index).to.equal(0);
        });
    });

    describe("Enter method", function() {
        it("Should call Submit if responceActive is true", function() {
            // Initialize variables
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

    describe("Diff property", function() {
        it("Should be plain if diffs are disabled", function() {
            // Initialize variables
            Quizzer.settings.showDiff = "Never";
            Quizzer.prompts = [["A", "B", "C", "D"]];
            Quizzer.responce = "E";

            // Assert diff is correct
            expect(Quizzer.diff).to.deep.equal({
                input: [  // Should be in original case
                    {changed:false, value:"E"}
                ],
                answer: [  // Should be lower case
                    {changed:false, value:"d"}
                ],
            });
        });

        it("Should be plain if diffs aren't enabled for multiple answers", function() {
            // Initialize variables
            Quizzer.settings.showDiff = "For single answers";
            Quizzer.prompts = [["A", "B", "C", "D1, D2"]];
            Quizzer.responce = "E";

            // Assert diff is correct
            expect(Quizzer.diff).to.deep.equal({
                input: [  // Should be in original case
                    {changed:false, value:"E"}
                ],
                answer: [  // Should be lower case
                    {changed:false, value:"d1, d2"}
                ],
            });
        });

        it("Should be plain if onMissedPrompt equals 'Tell me'", function() {
            // Initialize variables
            Quizzer.settings.showDiff = "Always";
            Quizzer.settings.onMissedPrompt = "Tell me";
            Quizzer.prompts = [["A", "B", "C", "D"]];
            Quizzer.responce = "E";

            // Assert diff is correct
            expect(Quizzer.diff).to.deep.equal({
                input: [  // Should be in original case
                    {changed:false, value:"E"}
                ],
                answer: [  // Should be lower case
                    {changed:false, value:"d"}
                ],
            });
        });

        it("Should be correct if diffs are enabled", function() {
            // Initialize variables
            Quizzer.settings.showDiff = "Always";
            Quizzer.prompts = [["A", "B", "C", "La manzana"]];
            Quizzer.responce = "La monanaa";  // 1 letter replaced (a->o), 1 letter removed (z), 1 letter added (a)

            // Assert diff is correct
            expect(Quizzer.diff).to.deep.equal({
                input: [  // Should be in original case
                    {changed:false, value:"La m"},
                    {changed:true, value:"o"},
                    {changed:false, value:"n"},
                    {changed:false, value:"ana"},
                    {changed:true, value:"a"},
                ],
                answer: [  // Should be lower case
                    {changed:false, value:"la m"},
                    {changed:true, value:"a"},
                    {changed:false, value:"n"},
                    {changed:true, value:"z"},
                    {changed:false, value:"ana"},
                ],
            });
        });

        it("Should have correct casing", function() {
            // Initialize variables
            Quizzer.settings.showDiff = "Always";
            Quizzer.prompts = [["A", "B", "C", "La MaNzAnA"]];
            Quizzer.responce = "lA mOnAnAa";  // 1 letter replaced (a->o), 1 letter removed (z), 1 letter added (a)

            // Assert diff is correct
            expect(Quizzer.diff).to.deep.equal({
                input: [  // Should be in original case
                    {changed:false, value:"lA m"},
                    {changed:true, value:"O"},
                    {changed:false, value:"n"},
                    {changed:false, value:"AnA"},
                    {changed:true, value:"a"},
                ],
                answer: [  // Should be lower case
                    {changed:false, value:"la m"},
                    {changed:true, value:"a"},
                    {changed:false, value:"n"},
                    {changed:true, value:"z"},
                    {changed:false, value:"ana"},
                ],
            });
        });
    });

    describe("GetLang method", function() {
        it("Should return Spanish by default", function() {
            expect(Quizzer.getLang("")).to.equal("es");
            expect(Quizzer.getLang("test")).to.equal("es");
        });

        it("Should return English for labels containing 'english'", function() {
            expect(Quizzer.getLang("test english test")).to.equal("en");
            expect(Quizzer.getLang("ENGLISH")).to.equal("en");
        });

        it("Should return English for labels containing 'type'", function() {
            expect(Quizzer.getLang("test type test")).to.equal("en");
            expect(Quizzer.getLang("ENGLISH")).to.equal("en");
        });

        it("Should return English for labels containing 'category'", function() {
            expect(Quizzer.getLang("test category test")).to.equal("en");
            expect(Quizzer.getLang("ENGLISH")).to.equal("en");
        });

        it("Should return Spanish for labels containing 'spanish'", function() {
            expect(Quizzer.getLang("test spanish test")).to.equal("es");
            expect(Quizzer.getLang("SPANISH")).to.equal("es");
        });
    });
});
