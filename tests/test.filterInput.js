describe("FilterInput", function() {
    let FilterInput;
    beforeEach(function() {
        // Create filtersInput component
        FilterInput = new filterInput();
    });

    describe("Created lifecycle hook", function() {
        it("Category should be 'verbs'", function() {
            expect(FilterInput.category).to.equal("verbs");
        });

        it("VerbFilters should be empty", function() {
            expect(FilterInput.verbFilters.length).to.equal(0);
        });

        it("VocabFilters should be empty", function() {
            expect(FilterInput.vocabFilters.length).to.equal(0);
        });
    });

    describe("Value computed property", function() {
        it("Should return verb filters if category is 'verbs'", function() {
            // Initialize variables
            FilterInput.category = "verbs";
            FilterInput.verbFilters = "verb-filters";
            FilterInput.vocabFilters = "vocab-filters";

            // Assert value returns verb filters
            expect(FilterInput.value, "verb-filters");
        });

        it("Should return vocab filters if category is 'vocab'", function() {
            // Initialize variables
            FilterInput.category = "vocab";
            FilterInput.verbFilters = "verb-filters";
            FilterInput.vocabFilters = "vocab-filters";

            // Assert value returns vocab filters
            expect(FilterInput.value, "vocab-filters");
        });
    });

    describe("Value watch", function() {
        it("Should emit input event", async function() {
            // Initialize variables
            FilterInput.category = "verbs";
            FilterInput.verbFilters = ["filter1"];

            // Override $emit method
            let event = "";
            let event_args;
            FilterInput.$emit = function(name, value) {
                event = name;
                event_args = value;
            };

            // Edit verb filters
            FilterInput.verbFilters.push("filter2");
            await FilterInput.$nextTick();

            // Assert event emited
            expect(event).to.equal("input");
            expect(event_args).to.have.deep.members(["filter1", "filter2"]);
        });
    });

    describe("AddFilter method", function() {
        it("Should add a verb filter if category is 'verbs'", function() {
            // Initialize variables
            FilterInput.category = "verbs";
            expect(FilterInput.verbFilters.length).to.equal(0);
            expect(FilterInput.vocabFilters.length).to.equal(0);

            // Add filter
            FilterInput.AddFilter();

            // Assert filter added
            expect(FilterInput.verbFilters).to.have.deep.members([
                {tense:"All Tenses", type:"All Types", subject:"All Subjects", direction:"Eng. → Conj."},
            ]);
            expect(FilterInput.vocabFilters).to.have.deep.members([]);
        });

        it("Should add a vocab filter if category is 'vocab'", function() {
            // Initialize variables
            FilterInput.category = "vocab";
            expect(FilterInput.verbFilters.length).to.equal(0);
            expect(FilterInput.vocabFilters.length).to.equal(0);

            // Add filter
            FilterInput.AddFilter();

            // Assert filter added
            expect(FilterInput.vocabFilters).to.have.deep.members([
                {category:"All Categories", type:"All Types", direction:"Eng. ↔ Esp."},
            ]);
            expect(FilterInput.verbFilters).to.have.deep.members([]);
        });
    });

    describe("RemoveFilter method", function() {
        it("Should remove the specified verb filter", function() {
            // Initialize filters
            FilterInput.category = "verbs";
            FilterInput.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            FilterInput.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            FilterInput.RemoveFilter(1);

            // Assert filter removed
            expect(FilterInput.verbFilters.length).to.equal(2);
            expect(FilterInput.verbFilters[0]).to.equal("verb1");
            expect(FilterInput.verbFilters[1]).to.equal("verb3");
            expect(FilterInput.vocabFilters.length).to.equal(3);
        });

        it("Should remove the specified vocab filter", function() {
            // Initialize filters
            FilterInput.category = "vocab";
            FilterInput.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            FilterInput.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            FilterInput.RemoveFilter(1);

            // Assert filter removed
            expect(FilterInput.verbFilters.length).to.equal(3);
            expect(FilterInput.vocabFilters.length).to.equal(2);
            expect(FilterInput.vocabFilters[0]).to.equal("vocab1");
            expect(FilterInput.vocabFilters[1]).to.equal("vocab3");
        });
    });

    describe("GetTenseTypes method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"All Types", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

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
            FilterInput.verbFilters = [
                {tense:"Present Tense", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

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
            FilterInput.verbFilters = [
                {tense:"Present Tense", type:"Orthographic"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection changed
            expect(FilterInput.verbFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Preterite Tense", type:"Orthographic"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection not changed
            expect(FilterInput.verbFilters[0]["type"]).to.equal("Orthographic");
        });
    });

    describe("GetTenseSubjects method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"All Types", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

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
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"All Subjects", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

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
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"Yo", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);

            // Assert selection changed
            expect(FilterInput.verbFilters[0]["subject"]).to.equal("All Subjects");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"Type", type:"All Types"},
                {tense:"Preterite Tense", subject:"Yo", type:"All Types"},
            ]

            // Get filters
            FilterInput.getTenseSubjects(0);
            FilterInput.getTenseSubjects(1);

            // Assert selection not changed
            expect(FilterInput.verbFilters[0].subject).to.equal("Type");
            expect(FilterInput.verbFilters[1].subject).to.equal("Yo");
        });
    });

    describe("GetCategoryFilters method", function() {
        it("Should be correct for Verbs", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Verbs", type:"All Definitions"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should be correct for sets with 1 type", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Colors", type:"All Definitions"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Colors", type:"Verbs"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert selection changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
            expect(FilterInput.vocabFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Professions", type:"Verbs"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert selection not changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(true);
            expect(filters["Verbs"]).to.equal(true);
            expect(FilterInput.vocabFilters[0]["type"]).to.equal("Verbs");
        });
    });
});
