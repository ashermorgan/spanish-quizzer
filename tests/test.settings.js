describe("Settings", function() {
    let Settings;
    beforeEach(function() {
        // Create settings component
        Settings = new settings();
    });

    describe("Created lifecycle hook", function() {
        it("Category should be 'verbs'", function() {
            expect(Settings.category).to.equal("verbs");
        });
        
        it("VerFilters should be empty", function() {
            expect(Settings.verbFilters.length).to.equal(0);
        });

        it("VocabFilters should be empty", function() {
            expect(Settings.vocabFilters.length).to.equal(0);
        });
    
        it("Settings should be loaded", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "{\"promptType\":\"Audio\",\"inputType\":\"Voice\",\"onMissedPrompt\":\"Tell me\",\"repeatPrompts\":\"5 prompts later\"}")
            
            // (re)Create settings component
            Settings = new settings();

            // Assert settings loaded
            expect(Settings.settings.promptType).to.equal("Audio");
            expect(Settings.settings.inputType).to.equal("Voice");
            expect(Settings.settings.onMissedPrompt).to.equal("Tell me");
            expect(Settings.settings.repeatPrompts).to.equal("5 prompts later");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid individual settings should not be loaded", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set localStorage settings
            localStorage.setItem("settings", "{\"promptType\":\"Audio\",\"inputType\":\"test\",\"onMissedPrompt\":null}")
            
            // (re)Create settings component
            Settings = new settings();

            // Assert default settings loaded
            expect(Settings.settings.promptType).to.equal("Audio"); // promptType wasn't invalid, so it should still be loaded
            expect(Settings.settings.inputType).to.equal("Text");
            expect(Settings.settings.onMissedPrompt).to.equal("Correct me");
            expect(Settings.settings.repeatPrompts).to.equal("Never");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });

        it("Invalid JSON settings should not be loaded", function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");
    
            // Set localStorage settings
            localStorage.setItem("settings", "asdf")
            
            // (re)Create settings component
            Settings = new settings();
    
            // Assert default settings loaded
            expect(Settings.settings.promptType).to.equal("Text");
            expect(Settings.settings.inputType).to.equal("Text");
            expect(Settings.settings.onMissedPrompt).to.equal("Correct me");
            expect(Settings.settings.repeatPrompts).to.equal("Never");
    
            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });

    describe("AddFilter method", function() {
        it("Should add a verb filter if category is 'verbs'", function() {
            // Initialize variables
            Settings.category = "verbs";
            expect(Settings.verbFilters.length).to.equal(0);
            expect(Settings.vocabFilters.length).to.equal(0);

            // Add filter
            Settings.AddFilter();

            // Assert filter added
            expect(Settings.verbFilters.length).to.equal(1);
            expect(Settings.verbFilters[0]["tense"]).to.equal("All Tenses");
            expect(Settings.verbFilters[0]["type"]).to.equal("All Types");
            expect(Settings.verbFilters[0]["subject"]).to.equal("All Subjects");
            expect(Settings.verbFilters[0]["direction"]).to.equal("Eng. → Conj.");
            expect(Settings.vocabFilters.length).to.equal(0);
        });

        it("Should add a vocab filter if category is 'vocab'", function() {
            // Initialize variables
            Settings.category = "vocab";
            expect(Settings.verbFilters.length).to.equal(0);
            expect(Settings.vocabFilters.length).to.equal(0);

            // Add filter
            Settings.AddFilter();

            // Assert filter added
            expect(Settings.vocabFilters.length).to.equal(1);
            expect(Settings.vocabFilters[0]["set"]).to.equal("Verbs");
            expect(Settings.vocabFilters[0]["type"]).to.equal("All Types");
            expect(Settings.vocabFilters[0]["direction"]).to.equal("Eng. ↔ Esp.");
            expect(Settings.verbFilters.length).to.equal(0);
        });
    });

    describe("RemoveFilter method", function() {
        it("Should remove the specified verb filter", function() {
            // Initialize filters
            Settings.category = "verbs";
            Settings.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            Settings.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            Settings.RemoveFilter(1);

            // Assert filter removed
            expect(Settings.verbFilters.length).to.equal(2);
            expect(Settings.verbFilters[0]).to.equal("verb1");
            expect(Settings.verbFilters[1]).to.equal("verb3");
            expect(Settings.vocabFilters.length).to.equal(3);
        });

        it("Should remove the specified vocab filter", function() {
            // Initialize filters
            Settings.category = "vocab";
            Settings.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            Settings.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            Settings.RemoveFilter(1);

            // Assert filter removed
            expect(Settings.verbFilters.length).to.equal(3);
            expect(Settings.vocabFilters.length).to.equal(2);
            expect(Settings.vocabFilters[0]).to.equal("vocab1");
            expect(Settings.vocabFilters[1]).to.equal("vocab3");
        });
    });

    describe("GetTenseTypes method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"All Types", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

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
            Settings.verbFilters = [
                {"tense":"Present Tense", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

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
            Settings.verbFilters = [
                {"tense":"Present Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection changed
            expect(Settings.verbFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Preterite Tense", "type":"Orthographic"}
            ]

            // Get filters
            let filters = Settings.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection not changed
            expect(Settings.verbFilters[0]["type"]).to.equal("Orthographic");
        });
    });

    describe("GetTenseSubjects method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"All Types", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(true);
            expect(filters["Tú"]).to.equal(true);
            expect(filters["Él"]).to.equal(true);
            expect(filters["Nosotros"]).to.equal(true);
            expect(filters["Ellos"]).to.equal(true);
        });

        it("Should be correct for Present Participles", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Participles", "subject":"All Subjects", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Present Participles", "subject":"Yo", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);

            // Assert selection changed
            expect(Settings.verbFilters[0]["subject"]).to.equal("All Subjects");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.verbFilters = [
                {"tense":"Preterite Tense", "subject":"Yo", "type":"All Types"}
            ]

            // Get filters
            let filters = Settings.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(true);
            expect(filters["Tú"]).to.equal(true);
            expect(filters["Él"]).to.equal(true);
            expect(filters["Nosotros"]).to.equal(true);
            expect(filters["Ellos"]).to.equal(true);

            // Assert selection not changed
            expect(Settings.verbFilters[0]["subject"]).to.equal("Yo");
        });
    });

    describe("GetSetFilters method", function() {
        it("Should be correct for Verbs", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Verbs", "type":"All Definitions"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });
        
        it("Should be correct for sets with 1 type", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Colors", "type":"All Definitions"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Colors", "type":"Verbs"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert selection changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
            expect(Settings.vocabFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            Settings.vocabFilters = [
                {"set":"Professions", "type":"Verbs"}
            ]

            // Get filters
            let filters = Settings.getSetFilters(0);

            // Assert selection not changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(true);
            expect(filters["Verbs"]).to.equal(true);
            expect(Settings.vocabFilters[0]["type"]).to.equal("Verbs");
        });
    });

    describe("Settings watch", function() {
        it("Should update setting in localStorage", async function() {
            // Save original setting from localStorage
            let originalValue = localStorage.getItem("settings");

            // Set settings
            Settings.settings.promptType = "A";
            Settings.settings.inputType = "B";
            Settings.settings.onMissedPrompt = "C";
            Settings.settings.repeatPrompts = "D";
            await Settings.$nextTick();

            // Assert localStorage setting updated
            expect(localStorage.getItem("settings")).to.equal("{\"promptType\":\"A\",\"inputType\":\"B\",\"onMissedPrompt\":\"C\",\"repeatPrompts\":\"D\"}");

            // Restore original setting to localStorage
            localStorage.setItem("settings", originalValue);
        });
    });

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
            let actual = ApplyVocabFilter(vocab, "All Types", "Eng. ↔ Esp.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter vocab for English to Spanish", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "All Types", "Eng. → Esp.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter vocab for Spanish to English", function() {
            // Initialize expected
            let expected = [
                ["Lower", "a", "Upper", "A"],
                ["Lower", "b", "Upper", "B"],
                ["Lower", "c", "Upper", "C"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "All Types", "Esp. → Eng.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });
    
        it("Should correctly filter vocab for Nouns", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Lower", "a", "Upper", "A"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Nouns", "Eng. ↔ Esp.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });
    
        it("Should correctly filter vocab for Adjectives", function() {
            // Initialize expected
            let expected = [
                ["Upper", "B", "Lower", "b"],
                ["Lower", "b", "Upper", "B"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Adjectives", "Eng. ↔ Esp.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });
    
        it("Should correctly filter vocab for Verbs", function() {
            // Initialize expected
            let expected = [
                ["Upper", "C", "Lower", "c"],
                ["Lower", "c", "Upper", "C"],
            ];

            // Filter vocab
            let actual = ApplyVocabFilter(vocab, "Verbs", "Eng. ↔ Esp.");

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });
    
        it("Should throw error by default", function() {
            // Assert throws error by default
            expect(() => ApplyVocabFilter(vocab, "test", "Eng. ↔ Esp.")).to.throw()
            expect(() => ApplyVocabFilter(vocab, "", "Eng. ↔ Esp.")).to.throw()
            expect(() => ApplyVocabFilter(vocab, 1, "Eng. ↔ Esp.")).to.throw()
            expect(() => ApplyVocabFilter(vocab, null, "Eng. ↔ Esp.")).to.throw()
            
            expect(() => ApplyVocabFilter(vocab, "Verbs", "test")).to.throw()
            expect(() => ApplyVocabFilter(vocab, "Verbs", "")).to.throw()
            expect(() => ApplyVocabFilter(vocab, "Verbs", "1")).to.throw()
            expect(() => ApplyVocabFilter(vocab, "Verbs", null)).to.throw()
        });
    });

    describe("ApplyVerbFilter method", function() {
        // Initialize verbs
        // Headers are capitalized to tell them apart from the other rows
        let verbs = [
            [
                "KEY", "SPANISH INF",
                "TYPE", "1A",
                "TYPE", "2A", "2B", "2C", "2D", "2E",
                "TYPE", "3A", "3B", "3C", "3D", "3E",
                "TYPE", "4A", "4B", "4C", "4D", "4E",
                "TYPE", "5A", "5B", "5C", "5D", "5E",
            ],
            [
                "key", "spanish inf",
                "Regular", "1a",
                "Irregular", "2a", "2b", "2c", "2d", "2e",
                "Orthographic", "3a", "3b", "3c", "3d", "3e",
                "Reflexive,Stem Changing", "4a", "4b", "4c", "4d", "4e",
                "Regular", "5a", "5b", "5c", "5d", "5e",
            ],
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
                ["KEY", "key", "5A", "5a"],
                ["KEY", "key", "5B", "5b"],
                ["KEY", "key", "5C", "5c"],
                ["KEY", "key", "5D", "5d"],
                ["KEY", "key", "5E", "5e"],
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
   
            it("Should correctly filter verbs for Simple Future Tense", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "5A", "5a"],
                    ["KEY", "key", "5B", "5b"],
                    ["KEY", "key", "5C", "5c"],
                    ["KEY", "key", "5D", "5d"],
                    ["KEY", "key", "5E", "5e"],
                ];

                // Filter verbs
                let actual = ApplyVerbFilter(verbs, [{tense:"Simple Future Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Regularity filters", function() {
            it("Should correctly filter regular verbs", function() {
                // Initialize expected
                let expected = [
                    ["KEY", "key", "1A", "1a"],
                    ["KEY", "key", "5A", "5a"],
                    ["KEY", "key", "5B", "5b"],
                    ["KEY", "key", "5C", "5c"],
                    ["KEY", "key", "5D", "5d"],
                    ["KEY", "key", "5E", "5e"],
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
                    ["KEY", "key", "5A", "5a"],
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
                    ["KEY", "key", "5B", "5b"],
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
                    ["KEY", "key", "5C", "5c"],
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
                    ["KEY", "key", "5D", "5d"],
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
                    ["KEY", "key", "5E", "5e"],
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
