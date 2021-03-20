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
});
