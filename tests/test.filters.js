describe("Filters", function() {
    describe("GetVocabFilters method", function() {
        it("Should correctly filter vocab for All Definitions", function() {
            // Initialize expected
            let expected = [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
                {outputIndex:1, inputIndex:0, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
            ];

            // Filter vocab
            let actual = GetVocabFilters([{category:"Colors", type:"All Types", direction:"Eng. ↔ Esp."}]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter vocab for multiple filters", function() {
            // Initialize expected
            let expected = [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
                {outputIndex:1, inputIndex:0, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
                {outputIndex:1, inputIndex:0, filters:[{index:2, value:"Verb"}, {index:3, value:"Months"}]},
            ];

            // Filter vocab
            let actual = GetVocabFilters([
                {category:"Colors", type:"All Types", direction:"Eng. ↔ Esp."},
                {category:"Months", type:"Verbs", direction:"Esp. → Eng."},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Direction filters", function() {
            it("Should correctly filter vocab for English to Spanish", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:1, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{category:"Colors", type:"All Types", direction:"Eng. → Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Spanish to English", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:1, inputIndex:0, filters:[{index:2, value:".*"}, {index:3, value:"Colors"}]},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{category:"Colors", type:"All Types", direction:"Esp. → Eng."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Word Type filters", function() {
            it("Should correctly filter vocab for Nouns", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun"}, {index:3, value:"Colors"}]},
                    {outputIndex:1, inputIndex:0, filters:[{index:2, value:"Noun"}, {index:3, value:"Colors"}]},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{category:"Colors", type:"Nouns", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Adjectives", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:1, filters:[{index:2, value:"Adjective"}, {index:3, value:"Colors"}]},
                    {outputIndex:1, inputIndex:0, filters:[{index:2, value:"Adjective"}, {index:3, value:"Colors"}]},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{category:"Colors", type:"Adjectives", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:1, filters:[{index:2, value:"Verb"}, {index:3, value:"Colors"}]},
                    {outputIndex:1, inputIndex:0, filters:[{index:2, value:"Verb"}, {index:3, value:"Colors"}]},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{category:"Colors", type:"Verbs", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should throw error for unknown word type", function() {
                expect(() => GetVocabFilters([{category:"Colors", type:"test",   direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{category:"Colors", type:"",       direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{category:"Colors", type:1,        direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{category:"Colors", type:null,     direction:"Eng. ↔ Esp."}])).to.throw()
            });
        });
    });

    describe("GetVerbFilters method", function() {
        it("Should correctly filter verbs for All Conjugations", function() {
            // Initialize expected
            let expected = [
                {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                {outputIndex:0, inputIndex:07, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:08, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:09, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:10, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:11, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:13, filters:[{index:12, value:".*"}]},
                {outputIndex:0, inputIndex:14, filters:[{index:12, value:".*"}]},
                {outputIndex:0, inputIndex:15, filters:[{index:12, value:".*"}]},
                {outputIndex:0, inputIndex:16, filters:[{index:12, value:".*"}]},
                {outputIndex:0, inputIndex:17, filters:[{index:12, value:".*"}]},
                {outputIndex:0, inputIndex:19, filters:[{index:18, value:".*"}]},
                {outputIndex:0, inputIndex:20, filters:[{index:18, value:".*"}]},
                {outputIndex:0, inputIndex:21, filters:[{index:18, value:".*"}]},
                {outputIndex:0, inputIndex:22, filters:[{index:18, value:".*"}]},
                {outputIndex:0, inputIndex:23, filters:[{index:18, value:".*"}]},
                {outputIndex:0, inputIndex:25, filters:[{index:24, value:".*"}]},
                {outputIndex:0, inputIndex:26, filters:[{index:24, value:".*"}]},
                {outputIndex:0, inputIndex:27, filters:[{index:24, value:".*"}]},
                {outputIndex:0, inputIndex:28, filters:[{index:24, value:".*"}]},
                {outputIndex:0, inputIndex:29, filters:[{index:24, value:".*"}]},
            ];

            // Filter verbs
            let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter verbs for multiple filters", function() {
            // Initialize expected
            let expected = [
                {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},

                {outputIndex:0, inputIndex:07, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:08, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:09, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:10, filters:[{index:06, value:".*"}]},
                {outputIndex:0, inputIndex:11, filters:[{index:06, value:".*"}]},

                {outputIndex:03, inputIndex:1, filters:[{index:02, value:"Stem.?Changing"}]},
                {outputIndex:05, inputIndex:1, filters:[{index:04, value:"Stem.?Changing"}]},
                {outputIndex:10, inputIndex:1, filters:[{index:06, value:"Stem.?Changing"}]},
                {outputIndex:16, inputIndex:1, filters:[{index:12, value:"Stem.?Changing"}]},
                {outputIndex:22, inputIndex:1, filters:[{index:18, value:"Stem.?Changing"}]},
                {outputIndex:28, inputIndex:1, filters:[{index:24, value:"Stem.?Changing"}]},
            ];

            // Filter verbs
            let actual = GetVerbFilters([
                { tense:"all tenses",       subject:"all subjects", type:"Nonregular",      direction:"Eng. => Conj." },
                { tense:"present tense",    subject:"all subjects", type:"all types",       direction:"Eng. => Conj." },
                { tense:"all tenses",       subject:"nosotros",     type:"stem changing",   direction:"Conj. => Esp." }
            ]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Tense filters", function() {
            it("Should correctly filter verbs for Present Participles", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:3, filters:[{index:2, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Past Participles", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:5, filters:[{index:4, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Past Participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Present Tense", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:07, filters:[{index:6, value:".*"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:6, value:".*"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:6, value:".*"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:6, value:".*"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:6, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Preterite Tense", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Preterite Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Imperfect Tense", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Imperfect Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Simple Future Tense", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:".*"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:".*"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:".*"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:".*"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Simple Future Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Regularity filters", function() {
            it("Should correctly filter regular verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Regular"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Regular"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Regular"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Regular"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Regular"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Regular"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Regular"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Regular"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Regular"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Regular"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Regular"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Regular"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Regular"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Regular"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Regular"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Regular"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Regular"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Regular"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Regular"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Regular"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Regular"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Regular"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Regular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter reflexive verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Reflexive"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Reflexive"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Reflexive", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter stem changing verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Stem.?Changing"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Stem.?Changing"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Stem Changing", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter orthographic verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Orthographic"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Orthographic"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Orthographic", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter irregular verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Irregular"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Irregular"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"irregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nonregular verbs", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:"Irregular|Stem.?Changing|Orthographic"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Nonregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Subject filters", function() {
            it("Should correctly filter type subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:02, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:04, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:06, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:12, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:18, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:24, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"type", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter yo subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:07, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:13, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:19, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:25, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"yo", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter tú subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:08, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:14, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:20, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:26, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"tú", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter él subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:09, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:15, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:21, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:27, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"él", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nosotros subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:10, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:16, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:22, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:28, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"nosotros", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter ellos subjects", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:03, filters:[{index:02, value:".*"}]},
                    {outputIndex:0, inputIndex:05, filters:[{index:04, value:".*"}]},
                    {outputIndex:0, inputIndex:11, filters:[{index:06, value:".*"}]},
                    {outputIndex:0, inputIndex:17, filters:[{index:12, value:".*"}]},
                    {outputIndex:0, inputIndex:23, filters:[{index:18, value:".*"}]},
                    {outputIndex:0, inputIndex:29, filters:[{index:24, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"ellos", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Direction filters", function() {
            it("Should correctly filter English to Conjugations", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:0, inputIndex:3, filters:[{index:2, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Spanish to Conjugations", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:1, inputIndex:3, filters:[{index:2, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Esp. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to English", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:3, inputIndex:0, filters:[{index:2, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Eng."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to Spanish", function() {
                // Initialize expected
                let expected = [
                    {outputIndex:3, inputIndex:1, filters:[{index:2, value:".*"}]},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Esp."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });
        });
    });

    describe("ApplyFilters method", function() {
        // Initialize vocab
        let vocab = [
            ["Upper",   "Lower",    "Type1",        "Type2"],
            ["A",       "a",        "Noun",         "Vowel"],
            ["B",       "b",        "Adjective",    "Consonant"],
            ["C",       "c",        "Verb",         "Consonant"],
        ];

        it("Should correctly filter different outputIndexes", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Type2", "Vowel", "Lower", "a"],
                ["Type2", "Consonant", "Lower", "b"],
                ["Type2", "Consonant", "Lower", "c"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:".*"}]},
                {outputIndex:3, inputIndex:1, filters:[{index:2, value:".*"}]},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter different inputIndexes", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Upper", "A", "Type2", "Vowel"],
                ["Upper", "B", "Type2", "Consonant"],
                ["Upper", "C", "Type2", "Consonant"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:".*"}]},
                {outputIndex:0, inputIndex:3, filters:[{index:2, value:".*"}]},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter different filterIndexes and filtervalues", function() {
            // Initialize expected
            let expected = [
                ["Upper", "C", "Lower", "c"],
                ["Upper", "A", "Lower", "a"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:"Verb"}]},
                {outputIndex:0, inputIndex:1, filters:[{index:3, value:"Vowel"}]},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter multiple filters", function() {
            // Initialize expected
            let expected = [
                ["Upper", "C", "Lower", "c"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Verb"}, {index:3, value:"Consonant"}]},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("multiplePrompts setting", function() {
            // Initialize vocab2
            let vocab2 = [
                ["Upper",       "Lower",    "Type1"],
                ["A1, A2 , A3", "a",        "Noun"],
                ["B1, B2",      "b",        "Adjective"],
                ["C",           "c",        "Verb"],
            ];

            it("Shouldn't effect single prompts", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "C",      "Lower", "c"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Verb"}]}], "Show separately");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should't effect prompts if equal to 'Show together'", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1, A2 , A3", "Lower", "a"],
                    ["Upper", "B1, B2",     "Lower", "b"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Adjective"}]}], "Show together");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should split up prompts if equal to 'Show separately'", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1", "Lower", "a"],
                    ["Upper", "A2", "Lower", "a"],
                    ["Upper", "A3", "Lower", "a"],
                    ["Upper", "B1", "Lower", "b"],
                    ["Upper", "B2", "Lower", "b"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Adjective"}]}], "Show separately");

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 0)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A1",      "Lower", "a"],
                    ["Upper", "B1",      "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 0;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Adjective"}]}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 0.5)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A2",    "Lower", "a"],
                    ["Upper", "B1",    "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 0.5;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Adjective"}]}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
            });

            it("Should correctly filter prompts if equal to 'Show one' (Math.random returns 1)", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "A3",    "Lower", "a"],
                    ["Upper", "B2",    "Lower", "b"],
                ];

                // Copy original Math.random method
                let random = Math.random;

                try {
                    // Override Math.random method
                    Math.random = function() {
                        return 1;
                    }

                    // Call ApplyFilters
                    let actual = ApplyFilters(vocab2, [{outputIndex:0, inputIndex:1, filters:[{index:2, value:"Noun|Adjective"}]}], "Show one");

                    // Assert filtered vocab is correct
                    expect(actual).to.have.deep.members(expected);
                }
                finally {
                    // Restore Math.random method
                    Math.random = random;
                }
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
