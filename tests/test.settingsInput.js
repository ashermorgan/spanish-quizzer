describe("SettingsInput", function() {
    let SettingsInput;
    beforeEach(function() {
        // Create settingsInput component
        SettingsInput = new settingsInput();
    });

    describe("Value watch", function() {
        it("Should emit input event", async function() {
            // Override $emit method
            let event = "";
            let event_args;
            SettingsInput.$emit = function(name, value) {
                event = name;
                event_args = value;
            };

            // Override setSettings method
            let old_setSettings = setSettings;
            setSettings = function() {};

            // Edit setting
            SettingsInput.value.promptType = "test-prompt-type";
            await SettingsInput.$nextTick();

            // Assert event emited
            expect(event).to.equal("input");
            expect(event_args.promptType).to.equal("test-prompt-type");

            // Restore setSettings method
            setSettings = old_setSettings;
        });

        it("Should call setSettings", async function() {
            // Override $emit method
            let event = "";
            let event_args;
            SettingsInput.$emit = function(name, value) {
                event = name;
                event_args = value;
            };

            // Override setSettings method
            let old_setSettings = setSettings;
            let args = null;
            setSettings = function(value) {
                args = value;
            };

            // Edit setting
            SettingsInput.value.inputType = "test-input-type";
            await SettingsInput.$nextTick();
            // Assert setSettings called
            expect(args.inputType).to.equal("test-input-type");

            // Restore setSettings method
            setSettings = old_setSettings;
        });
    });
});
