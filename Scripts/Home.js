// Load the document
function Load() {
    // Load dark mode
    if (localStorage.getItem("darkMode") == "true") {
        document.body.classList.toggle("dark");
    }

    // Add event Listeners
    document.addEventListener("click", function (e) {
        document.getElementById('share').hidden = true;
    });
}
