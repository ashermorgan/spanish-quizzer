describe("Settings", function() {
    describe("ApplyVocabFilter method", function() {
        // Initialize vocab
        let vocab = [
            ["Upper", "Lower", "Type"],
            ["A", "a", "Noun"],
            ["B", "b", "Adjective"],
            ["C", "c", "Verb"]
        ];
        
        it("Should correctly filter vocab for All Definitions", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Lower", "a", "Upper", "A"],
                ["Lower", "b", "Upper", "B"],
                ["Lower", "c", "Upper", "C"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "All Definitions");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });

        it("Should correctly filter vocab for English to Spanish", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "English to Spanish");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });

        it("Should correctly filter vocab for Spanish to English", function() {
            // Initialize expected
            let expected = [
                ["Lower", "a", "Upper", "A"],
                ["Lower", "b", "Upper", "B"],
                ["Lower", "c", "Upper", "C"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Spanish to English");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });
    
        it("Should correctly filter vocab for Nouns", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Lower", "a", "Upper", "A"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Nouns");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });
    
        it("Should correctly filter vocab for Adjectives", function() {
            // Initialize expected
            let expected = [
                ["Upper", "B", "Lower", "b"],
                ["Lower", "b", "Upper", "B"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Adjectives");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });
    
        it("Should correctly filter vocab for Verbs", function() {
            // Initialize expected
            let expected = [
                ["Upper", "C", "Lower", "c"],
                ["Lower", "c", "Upper", "C"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Verbs");

            // Assert filtered vocab is correct
            expect(actual.length).to.equal(expected.length);
            for (let i = 0; i < expected.length; i++) {
                expect(actual[i].length).to.equal(4);
                for (let j = 0; j < expected[i].length; j++) {
                    expect(actual[i][j]).to.equal(expected[i][j]);
                }
            }
        });
    
        it("Should return empty list by default", function() {
            // Assert result is empty by default
            expect(ApplyVocabFilter(vocab, "test").length).to.equal(0);
            expect(ApplyVocabFilter(vocab, "").length).to.equal(0);
            expect(ApplyVocabFilter(vocab, 1).length).to.equal(0);
            expect(ApplyVocabFilter(vocab, null).length).to.equal(0);
        });
    });

    describe("ApplyVerbFilter method", function() {
        // Initialize verbs
        // Headers are capitalized to tell them apart from the other rows
        let verbs = [
            ["KEY", "SPANISH INF", "TYPE",      "1A", "TYPE",       "2A", "2B", "2C", "2D", "2E", "TYPE",           "3A", "3B", "3C", "3D", "3E", "TYPE",           "4A", "4B", "4C", "4D", "4E"],
            ["key", "spanish inf", "Regular",   "1a", "Irregular",  "2a", "2b", "2c", "2d", "2e", "Orthographic",   "3a", "3b", "3c", "3d", "3e", "Reflexive,Stem Changing",  "4a", "4b", "4c", "4d", "4e"],
        ];

        it("Should correctly filter verbs for All Conjugatinos", function() {
            // Initialize expected            
            let expected = [
                ["KEY", "key", "1A", "1a"],
                ["KEY", "key", "2A", "2a"],
                ["KEY", "key", "2B", "2b"],
                ["KEY", "key", "2C", "2c"],
                ["KEY", "key", "2D", "2d"],
                ["KEY", "key", "2E", "2e"],
                ["KEY", "key", "3A", "3a"],
                ["KEY", "key", "3B", "3b"],
                ["KEY", "key", "3C", "3c"],
                ["KEY", "key", "3D", "3d"],
                ["KEY", "key", "3E", "3e"],
                ["KEY", "key", "4A", "4a"],
                ["KEY", "key", "4B", "4b"],
                ["KEY", "key", "4C", "4c"],
                ["KEY", "key", "4D", "4d"],
                ["KEY", "key", "4E", "4e"],
            ];

            // Filter verbs
            let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });
        
        it("Should correctly filter verbs for multiple filters", function() {
            // Initialize expected
            let expected = [
                ["KEY", "key", "2A", "2a"],
                ["KEY", "key", "2B", "2b"],
                ["KEY", "key", "2C", "2c"],
                ["KEY", "key", "2D", "2d"],
                ["KEY", "key", "2E", "2e"],
                ["KEY", "key", "3A", "3a"],
                ["KEY", "key", "3B", "3b"],
                ["KEY", "key", "3C", "3c"],
                ["KEY", "key", "3D", "3d"],
                ["KEY", "key", "3E", "3e"],
                ["KEY", "key", "4A", "4a"],
                ["KEY", "key", "4B", "4b"],
                ["KEY", "key", "4C", "4c"],
                ["KEY", "key", "4D", "4d"],
                ["KEY", "key", "4E", "4e"],
                
                ["KEY", "key", "2A", "2a"],
                ["KEY", "key", "2B", "2b"],
                ["KEY", "key", "2C", "2c"],
                ["KEY", "key", "2D", "2d"],
                ["KEY", "key", "2E", "2e"],
                
                ["4D", "4d", "SPANISH INF", "spanish inf"],
            ];

            // Filter verbs
            let actual = ApplyVerbFilter(verbs, [
                { tense:"all tenses", subject:"all subjects", type:"Nonregular", direction:"Eng. => Conj." },
                { tense:"present tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj." },
                { "tense":"all tenses", subject:"nosotros", type:"stem changing", direction:"Conj. => Esp." }
            ]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Tense filters", function() {
            it("Should correctly filter verbs for Present Participles", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"Present Participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter verbs for Present Tense", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "2A", "2a"],
                    ["KEY", "key", "2B", "2b"],
                    ["KEY", "key", "2C", "2c"],
                    ["KEY", "key", "2D", "2d"],
                    ["KEY", "key", "2E", "2e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"Present Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter verbs for Preterite Tense", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "3A", "3a"],
                    ["KEY", "key", "3B", "3b"],
                    ["KEY", "key", "3C", "3c"],
                    ["KEY", "key", "3D", "3d"],
                    ["KEY", "key", "3E", "3e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"Preterite Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter verbs for Imperfect Tense", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "4A", "4a"],
                    ["KEY", "key", "4B", "4b"],
                    ["KEY", "key", "4C", "4c"],
                    ["KEY", "key", "4D", "4d"],
                    ["KEY", "key", "4E", "4e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"Imperfect Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Regularity filters", function() {
            it("Should correctly filter regular verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"Regular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter reflexive verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "4A", "4a"],
                    ["KEY", "key", "4B", "4b"],
                    ["KEY", "key", "4C", "4c"],
                    ["KEY", "key", "4D", "4d"],
                    ["KEY", "key", "4E", "4e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"Reflexive", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter stem changing verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "4A", "4a"],
                    ["KEY", "key", "4B", "4b"],
                    ["KEY", "key", "4C", "4c"],
                    ["KEY", "key", "4D", "4d"],
                    ["KEY", "key", "4E", "4e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"Stem Changing", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter orthographic verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "3A", "3a"],
                    ["KEY", "key", "3B", "3b"],
                    ["KEY", "key", "3C", "3c"],
                    ["KEY", "key", "3D", "3d"],
                    ["KEY", "key", "3E", "3e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"Orthographic", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter irregular verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "2A", "2a"],
                    ["KEY", "key", "2B", "2b"],
                    ["KEY", "key", "2C", "2c"],
                    ["KEY", "key", "2D", "2d"],
                    ["KEY", "key", "2E", "2e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"irregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
            
            it("Should correctly filter nonregular verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "2A", "2a"],
                    ["KEY", "key", "2B", "2b"],
                    ["KEY", "key", "2C", "2c"],
                    ["KEY", "key", "2D", "2d"],
                    ["KEY", "key", "2E", "2e"],
                    ["KEY", "key", "3A", "3a"],
                    ["KEY", "key", "3B", "3b"],
                    ["KEY", "key", "3C", "3c"],
                    ["KEY", "key", "3D", "3d"],
                    ["KEY", "key", "3E", "3e"],
                    ["KEY", "key", "4A", "4a"],
                    ["KEY", "key", "4B", "4b"],
                    ["KEY", "key", "4C", "4c"],
                    ["KEY", "key", "4D", "4d"],
                    ["KEY", "key", "4E", "4e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"all subjects", type:"Nonregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });
        
        describe("Subject filters", function() {
            it("Should correctly filter yo subjects", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "2A", "2a"],
                    ["KEY", "key", "3A", "3a"],
                    ["KEY", "key", "4A", "4a"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"yo", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter tú subjects", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "2B", "2b"],
                    ["KEY", "key", "3B", "3b"],
                    ["KEY", "key", "4B", "4b"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"tú", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter él subjects", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "2C", "2c"],
                    ["KEY", "key", "3C", "3c"],
                    ["KEY", "key", "4C", "4c"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"él", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nosotros subjects", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "2D", "2d"],
                    ["KEY", "key", "3D", "3d"],
                    ["KEY", "key", "4D", "4d"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"nosotros", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter ellos subjects", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "2E", "2e"],
                    ["KEY", "key", "3E", "3e"],
                    ["KEY", "key", "4E", "4e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"all tenses", subject:"ellos", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });
    
        describe("Direction filters", function() {
            it("Should correctly filter English to Conjugations", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"present participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Spanish to Conjugations", function() {
                // Initialize expected
                let expected = [
                    ["SPANISH INF", "spanish inf", "1A", "1a"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"present participles", subject:"all subjects", type:"all types", direction:"Esp. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to English", function() {
                // Initialize expected
                let expected = [
                    ["1A", "1a", "KEY", "key"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Eng."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to Spanish", function() {
                // Initialize expected
                let expected = [
                    ["1A", "1a", "SPANISH INF", "spanish inf"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Esp."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });
    });

    describe("StartSession method", function() {
        beforeEach(function() {
            // Initialize Vue
            loadVue();
        });
    
        it("Should throw \"Bad Arguments\" when prompts is null", function() {
            // Initialize prompts and promptIndex
            app.prompts = null;
            app.promptIndex = 0;

            // Assert raises error
            expect(StartSession).to.throw("Bad arguments.");
        });
    
        it("Should throw \"Bad Arguments\" when promptIndex is negative", function() {
            // Initialize prompts and promptIndex
            app.prompts = ["a", "b", "c"];
            app.promptIndex = -1;

            // Assert raises error
            expect(StartSession).to.throw("Bad arguments.");
        });
    
        it("Should throw \"Bad Arguments\" when promptIndex is invalid", function() {
            // Initialize prompts and promptIndex
            app.prompts = ["a", "b", "c"];
            app.promptIndex = 3;

            // Assert raises error
            expect(StartSession).to.throw("Bad arguments.");
        });
        
        it("Should throw \"Terms is empty\" when prompts is empty", function() {
            // Initialize prompts and promptIndex
            app.prompts = [];
            app.promptIndex = 0;

            // Assert raises error
            expect(StartSession).to.throw("Terms is empty.");
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
