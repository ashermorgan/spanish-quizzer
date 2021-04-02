describe("ReferenceTables", function() {
    let ReferenceTables;
    beforeEach(function() {
        // Create referenceTables component
        ReferenceTables = new referenceTables();
    });

    describe("Initial state", function() {
        it("Category should be 'Choose a category'", function() {
            expect(ReferenceTables.category).to.equal("Choose a category");
        });

        it("Query should be empty", function() {
            expect(ReferenceTables.query).to.equal("");
        });

        it("ConjugationColors should be true", function() {
            expect(ReferenceTables.conjugationColors).to.be.true;
        });

        it("SortIndex should be 0", function() {
            expect(ReferenceTables.sortIndex).to.equal(0);
        });

        it("SortAccending should be true", function() {
            expect(ReferenceTables.sortAccending).to.be.true;
        });
    });

    describe("Category watch", function() {
        it("Should reset sortIndex and sortAccending", async function() {
            // Set sortIndex and sortAccending
            ReferenceTables.sortIndex = 1;
            ReferenceTables.sortAccending = false;

            // Set category
            ReferenceTables.category = "new category";
            await ReferenceTables.$nextTick();

            // Assert sortIndex and sortAccending are reset
            expect(ReferenceTables.sortIndex).to.equal(0);
            expect(ReferenceTables.sortAccending).to.be.true;
        });
    });

    describe("ConjugationColorClasses property", function() {
        it("Should produce correct color", function() {
            // Set reference tables data
            ReferenceTables.data = {verbs:[
                // Test table headers
                ["English", "Infinitive","Present Type","Present Yo","Present Tú","Present Él","Present Nosotros","Present Ellos","Preterite Type","Preterite Yo","Preterite Tú","Preterite Él","Preterite Nosotros","Preterite Ellos"],

                // Test regular conjugations and orthographic conjugations
                ["To read","Leer","Regular","Leo","Lees","Lee","Leemos","Leen","Orthographic","Leí","Leíste","Leyó","Leímos","Leyeron"],

                // Test stem changing conjugations and irregular conjugations
                ["To want","Querer","Stem Changing","Quiero","Quieres","Quiere","Queremos","Quieren","Irregular","Quise","Quisiste","Quiso","Quisimos","Quisieron"],

                // Test irregular and stem changing conjugations
                ["To have","Tener","Irregular, Stem Changing","Tengo","Tienes","Tiene","Tenemos","Tienen","Irregular","Tuve","Tuviste","Tuvo","Tuvimos","Tuvieron"],

                // Test reflexive conjugations
                ["To go to bed","Acostarse","Reflexive, Stem Changing","Me acuesto","Te acuestas","Se acuesta","Nos acostamos","Se acuestan","Reflexive, Regular","Me acosté","Te acostaste","Se acostó","Nos acostamos","Se acostaron"],
            ]};

            // Assert conjugationColorClasses is correct
            expect(ReferenceTables.conjugationColorClasses).to.deep.equal([
                // Test table headers
                ["normal","normal","normal","normal","normal","normal","normal","normal","normal","normal","normal","normal","normal","normal"],

                // Test regular conjugations and orthographic conjugations
                ["normal","normal","regular","regular","regular","regular","regular","regular","nonregular","nonregular","nonregular","nonregular","nonregular","nonregular"],

                // Test stem changing conjugations and irregular conjugations
                ["normal","normal","nonregular","nonregular","nonregular","nonregular","nonregular","nonregular","irregular","irregular","irregular","irregular","irregular","irregular"],

                // Test irregular and stem changing conjugations
                ["normal","normal","irregular","irregular","irregular","irregular","irregular","irregular","irregular","irregular","irregular","irregular","irregular","irregular"],

                // Test reflexive conjugations
                ["normal","normal","nonregular","nonregular","nonregular","nonregular","nonregular","nonregular","regular","regular","regular","regular","regular","regular"],
            ]);
        });
    });

    describe("TableData property", function() {
        it("Should be calculated correctly", function() {
            // Set reference tables data
            let data = {verbs:[
                // Test table headers
                ["English", "Infinitive","Present Type","Present Yo","Present Tú","Present Él","Present Nosotros","Present Ellos","Preterite Type","Preterite Yo","Preterite Tú","Preterite Él","Preterite Nosotros","Preterite Ellos"],

                // Test regular conjugations and orthographic conjugations
                ["To read","Leer","Regular","Leo","Lees","Lee","Leemos","Leen","Orthographic","Leí","Leíste","Leyó","Leímos","Leyeron"],

                // Test stem changing conjugations and irregular conjugations
                ["To want","Querer","Stem Changing","Quiero","Quieres","Quiere","Queremos","Quieren","Irregular","Quise","Quisiste","Quiso","Quisimos","Quisieron"],

                // Test irregular and stem changing conjugations
                ["To have","Tener","Irregular, Stem Changing","Tengo","Tienes","Tiene","Tenemos","Tienen","Irregular","Tuve","Tuviste","Tuvo","Tuvimos","Tuvieron"],

                // Test reflexive conjugations
                ["To go to bed","Acostarse","Reflexive, Stem Changing","Me acuesto","Te acuestas","Se acuesta","Nos acostamos","Se acuestan","Reflexive, Regular","Me acosté","Te acostaste","Se acostó","Nos acostamos","Se acostaron"],
            ]};
            ReferenceTables.data = data;

            // Assert tableData is correct
            expect(ReferenceTables.tableData).to.deep.equal({...{"Choose a category":[]}, ...data});
        });
    });

    describe("SortColumn method", function() {
        it("Should correctly sort table", function() {
            // Set table data and category
            ReferenceTables.data = {"category1":[
                ["English", "Spanish"],
                ["Red", "Rojo"],
                ["Green", "Verde"],
                ["Blue", "Azul"],
            ]};
            ReferenceTables.category = "category1";

            // Sort table
            ReferenceTables.sortColumn(1, false);

            // Assert table data is correct
            expect(ReferenceTables.data).to.deep.equal({"category1":[
                ["English", "Spanish"],
                ["Green", "Verde"],
                ["Red", "Rojo"],
                ["Blue", "Azul"],
            ]});

            // Assert sortIndex and sortAccending are correct
            expect(ReferenceTables.sortIndex).to.equal(1);
            expect(ReferenceTables.sortAccending).to.be.false;
        });

        it("Should correctly choose sort direction if column is already sorted", function() {
            // Set variables
            ReferenceTables.data = {"category1":[
                ["English", "Spanish"],
                ["Blue", "Azul"],
                ["Red", "Rojo"],
                ["Green", "Verde"],
            ]};
            ReferenceTables.category = "category1";
            ReferenceTables.sortIndex = 1;
            ReferenceTables.sortAccending = true;

            // Sort table
            ReferenceTables.sortColumn(1);

            // Assert table data is correct
            expect(ReferenceTables.data).to.deep.equal({"category1":[
                ["English", "Spanish"],
                ["Green", "Verde"],
                ["Red", "Rojo"],
                ["Blue", "Azul"],
            ]});

            // Assert sortIndex and sortAccending are correct
            expect(ReferenceTables.sortIndex).to.equal(1);
            expect(ReferenceTables.sortAccending).to.be.false;
        });

        it("Should correctly choose sort direction if column is not already sorted", function() {
            // Set variables
            ReferenceTables.data = {"category1":[
                ["English", "Spanish"],
                ["Blue", "Azul"],
                ["Green", "Verde"],
                ["Red", "Rojo"],
            ]};
            ReferenceTables.category = "category1";
            ReferenceTables.sortIndex = 0;
            ReferenceTables.sortAccending = true;

            // Sort table
            ReferenceTables.sortColumn(1);

            // Assert table data is correct
            expect(ReferenceTables.data.category1).to.deep.equal([
                ["English", "Spanish"],
                ["Blue", "Azul"],
                ["Red", "Rojo"],
                ["Green", "Verde"],
            ]);

            // Assert sortIndex and sortAccending are correct
            expect(ReferenceTables.sortIndex).to.equal(1);
            expect(ReferenceTables.sortAccending).to.be.true;
        });
    });
});
