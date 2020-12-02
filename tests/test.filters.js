describe("Filters", function() {
    describe("GetVocabFilters method", function() {
        it("Should correctly filter vocab for All Definitions", function() {
            // Initialize expected
            let expected = [
                {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
            ];

            // Filter vocab
            let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Eng. ↔ Esp."}]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter vocab for multiple filters", function() {
            // Initialize expected
            let expected = [
                {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
                {set:"Months", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Verb"},
            ];

            // Filter vocab
            let actual = GetVocabFilters([
                {set:"Colors", type:"All Types", direction:"Eng. ↔ Esp."},
                {set:"Months", type:"Verbs", direction:"Esp. → Eng."},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("Direction filters", function() {
            it("Should correctly filter vocab for English to Spanish", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Eng. → Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Spanish to English", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:".*"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"All Types", direction:"Esp. → Eng."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });
        });

        describe("Word Type filters", function() {
            it("Should correctly filter vocab for Nouns", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Noun"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Nouns", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Adjectives", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Adjective"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Adjective"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Adjectives", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter vocab for Verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Colors", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"},
                    {set:"Colors", outputIndex:1, inputIndex:0, filterIndex:2, filterValue:"Verb"},
                ];

                // Filter vocab
                let actual = GetVocabFilters([{set:"Colors", type:"Verbs", direction:"Eng. ↔ Esp."}]);

                // Assert filtered vocab is correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should throw error for unknown word type", function() {
                expect(() => GetVocabFilters([{set:"Colors", type:"test",   direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:"",       direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:1,        direction:"Eng. ↔ Esp."}])).to.throw()
                expect(() => GetVocabFilters([{set:"Colors", type:null,     direction:"Eng. ↔ Esp."}])).to.throw()
            });
        });
    });

    describe("GetVerbFilters method", function() {
        it("Should correctly filter verbs for All Conjugations", function() {
            // Initialize expected
            let expected = [
                {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
            ];

            // Filter verbs
            let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

            // Assert filtered verbs are correct
            expect(actual).to.have.deep.members(expected);
        });

        it("Should correctly filter verbs for multiple filters", function() {
            // Initialize expected
            let expected = [
                {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},

                {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},

                {set:"Verbs", outputIndex:03, inputIndex:1, filterIndex:02, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:08, inputIndex:1, filterIndex:04, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:14, inputIndex:1, filterIndex:10, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:20, inputIndex:1, filterIndex:16, filterValue:"Stem.?Changing"},
                {set:"Verbs", outputIndex:26, inputIndex:1, filterIndex:22, filterValue:"Stem.?Changing"},
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
                    {set:"Verbs", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Present Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:5, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:6, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:7, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:8, filterIndex:4, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:9, filterIndex:4, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Present Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Preterite Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Preterite Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Imperfect Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"Imperfect Tense", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter verbs for Simple Future Tense", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
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
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Regular"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Regular"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Regular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter reflexive verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Reflexive"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Reflexive"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Reflexive", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter stem changing verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Stem.?Changing"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Stem.?Changing"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Stem Changing", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter orthographic verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Orthographic"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"Orthographic", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter irregular verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"all subjects", type:"irregular", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nonregular verbs", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:"Irregular|Stem.?Changing|Orthographic"},
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
                    {set:"Verbs", outputIndex:0, inputIndex:02, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:04, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:10, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:16, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:22, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"type", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter yo subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:05, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:11, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:17, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:23, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"yo", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter tú subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:06, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:12, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:18, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:24, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"tú", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter él subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:07, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:13, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:19, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:25, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"él", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter nosotros subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:08, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:14, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:20, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:26, filterIndex:22, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"all tenses", subject:"nosotros", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter ellos subjects", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:0, inputIndex:03, filterIndex:02, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:09, filterIndex:04, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:15, filterIndex:10, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:21, filterIndex:16, filterValue:".*"},
                    {set:"Verbs", outputIndex:0, inputIndex:27, filterIndex:22, filterValue:".*"},
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
                    {set:"Verbs", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Eng. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Spanish to Conjugations", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:1, inputIndex:3, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Esp. => Conj."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to English", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:3, inputIndex:0, filterIndex:2, filterValue:".*"},
                ];

                // Filter verbs
                let actual = GetVerbFilters([{tense:"present participles", subject:"all subjects", type:"all types", direction:"Conj. => Eng."}]);

                // Assert filtered verbs are correct
                expect(actual).to.have.deep.members(expected);
            });

            it("Should correctly filter Conjugations to Spanish", function() {
                // Initialize expected
                let expected = [
                    {set:"Verbs", outputIndex:3, inputIndex:1, filterIndex:2, filterValue:".*"},
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
        let vocab = {
            "set1": [
                ["Upper",   "Lower",    "Type1",        "Type2"],
                ["A",       "a",        "Noun",         "Vowel"],
                ["B",       "b",        "Adjective",    "Consonant"],
                ["C",       "c",        "Verb",         "Consonant"],
            ],
            "set2": [
                ["Upper",   "Lower",    "Type1",        "Type2"],
                ["Z",       "z",        "Noun",         "Consonant"],
                ["Y",       "y",        "Adjective",    "Vowel,Consonant"],
                ["X",       "x",        "Verb",         "Consonant"],
            ],
        };

        it("Should correctly filter different vocab sets", function() {
            // Initialize expected
            let expected = [
                ["Upper", "A", "Lower", "a"],
                ["Upper", "B", "Lower", "b"],
                ["Upper", "C", "Lower", "c"],
                ["Upper", "X", "Lower", "x"],
                ["Upper", "Y", "Lower", "y"],
                ["Upper", "Z", "Lower", "z"],
            ];

            // Call ApplyFilters
            let actual = ApplyFilters(vocab, [
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set2", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

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
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set1", outputIndex:3, inputIndex:1, filterIndex:2, filterValue:".*"},
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
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:".*"},
                {set:"set1", outputIndex:0, inputIndex:3, filterIndex:2, filterValue:".*"},
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
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"},
                {set:"set1", outputIndex:0, inputIndex:1, filterIndex:3, filterValue:"Vowel"},
            ]);

            // Assert filtered vocab is correct
            expect(actual).to.have.deep.members(expected);
        });

        describe("multiplePrompts setting", function() {
            // Initialize vocab2
            let vocab2 = {
                "set1": [
                    ["Upper",       "Lower",    "Type1"],
                    ["A1, A2 , A3", "a",        "Noun"],
                    ["B1, B2",      "b",        "Adjective"],
                    ["C",           "c",        "Verb"],
                ],
            };

            it("Shouldn't effect single prompts", function() {
                // Initialize expected
                let expected = [
                    ["Upper", "C",      "Lower", "c"],
                ];

                // Call ApplyFilters
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Verb"}], "Show separately");

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
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show together");

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
                let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show separately");

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
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

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
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

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
                    let actual = ApplyFilters(vocab2, [{set:"set1", outputIndex:0, inputIndex:1, filterIndex:2, filterValue:"Noun|Adjective"}], "Show one");

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
