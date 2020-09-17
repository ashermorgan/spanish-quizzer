// Declare global variables
let app;



/**
 * Load the document.
 */
function Load() {
    // Initialize Vue
    app = new Vue({
        el: "#app", // Mount to app div

        data: {
            darkTheme: false
        },

        watch: {
            /**
             * Update the app theme.
             */
            darkTheme: function() {
                // Get theme from localStorage if null
                if (this.darkTheme === null) {
                    this.darkTheme = JSON.parse(localStorage.getItem("darkTheme"));
                }

                // Detect preferred color scheme if null
                if (this.darkTheme === null) {
                    this.darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                }

                // Apply theme
                if (this.darkTheme) {
                    document.body.classList.add("dark");
                }
                else {
                    document.body.classList.remove("dark");
                }

                // Save theme
                localStorage.setItem("darkTheme", this.darkTheme);
            }
        }
    });

    // Load settings
    app.darkTheme = null;   // Force theme to update

    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });
}
