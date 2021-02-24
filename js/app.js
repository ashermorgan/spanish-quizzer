// Declare global variables
let app;



// page-header component
const pageHeader = Vue.component("pageHeader", {
    props: {
        image: {
            type: String
        },
        title: {
            type: String,
            default: "Spanish-Quizzer",
        }
    },
    template: `
        <header @click="$emit('back');">
            <img v-if="image" :src="image"/>
            {{ title }}
        </header>
    `
});



// App pages
const homePage = Vue.component("homePage", {
    methods: {
        /**
         * Handle a keyup event (implements keyboard shortcuts).
         * @param {object} e - The event args.
         */
        keyup: function(e) {
            if (this._inactive) return;
            if (e.key === "c") this.$router.push("verbs");
            if (e.key === "v") this.$router.push("vocab");
            if (e.key === "r") this.$router.push("reference");
        },
    },
    created: function() {
        // Add keyup handler
        window.addEventListener("keyup", this.keyup);
    },
    destroyed: function() {
        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },
    template: `
        <div class="home">
            <page-header></page-header>
            <main>
                <h1>What do you want to study?</h1>
                <div>
                    <router-link tag="button" to="/verbs">Study Conjugations</router-link>
                    <router-link tag="button" to="/vocab">Study Vocab</router-link>
                    <router-link tag="button" to="/reference">Reference Tables</router-link>
                </div>
            </main>
        </div>
    `,
});



/**
 * Initialize the Vue app
 */
function loadVue() {
    app = new Vue({
        el: "#app", // Mount to app div

        router: new VueRouter({
            routes: [
                { path: "/", redirect: "/home" },
                { path: "/home",      name: "home",      component: homePage },
                { path: "/verbs",     name: "verbs",     component: filtersPage, props: {category: "verbs"}},
                { path: "/vocab",     name: "vocab",     component: filtersPage, props: {category: "vocab"}},
                { path: "/quizzer",   name: "quizzer",   component: quizzerPage,  props:true },
                { path: "/reference", name: "reference", component: referencePage },
                { path: "*", redirect: "/home" },
            ],
        }),

        methods: {
            /**
             * Go back to the previous page.
             */
            Back: function() {
                switch (this.$route.name) {
                    case "home":
                        break;
                    case "verbs":
                    case "vocab":
                    case "reference":
                        this.$router.push("home");
                        break;
                    case "quizzer":
                        this.$router.push(this.$route.params.referer || "home");
                }
            },

            /**
             * Handle a keyup event (implements keyboard shortcuts).
             * @param {object} e - The event args.
             */
            keyup: function(e) {
                if (e.key === "Escape") this.Back();
            },
        },

        data: {
            data: {}
        },

        created: function() {
            // Add keyup handler
            window.addEventListener("keyup", this.keyup);
        },

        destroyed: function() {
            // Remove keyup handler
            window.removeEventListener("keyup", this.keyup);
        },
    });
}



/**
 * Load the document.
 */
async function Load() {
    // Set theme
    SetTheme(null);

    // Initialize the Vue app
    loadVue();

    // Load Spanish-Quizzer data
    app.data = await loadData();
}
