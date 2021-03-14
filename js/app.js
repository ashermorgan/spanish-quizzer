// Declare global variables
let app;



// page-header component
const pageHeader = Vue.component("pageHeader", {
    props: {
        /**
         * The 1st header icon
         */
        icon1: {
            type: String
        },

        /**
         * The 2nd header icon
         */
        icon2: {
            type: String
        },

        /**
         * The label for the 1st header icon
         */
        label1: {
            type: String
        },

        /**
         * The label for the 2nd header icon
         */
        label2: {
            type: String
        },

        /**
         * The header text
         */
        title: {
            type: String,
            default: "Spanish-Quizzer",
        }
    },
    computed: {
        /**
         * The path to the 1st header icon
         */
        path1: function() {
            if (this.icon1) return `images/${this.icon1}.svg`;
            else return null;
        },

        /**
         * The path to the 2nd header icon
         */
        path2: function() {
            if (this.icon2) return `images/${this.icon2}.svg`;
            else return null;
        }
    },
    methods: {
        /**
         * Navigate to the home page
         */
        goHome: function() {
            if (this.$route.name !== 'home') this.$router.push('home');
        }
    },
    template: `
        <header>
            <button v-if="path1" :title="label1" class="icon"><img :src="path1" alt="" @click="$emit('click1')"/></button>
            <span @click="goHome">{{ title }}</span>
            <button v-if="path2" :title="label2" class="icon"><img :src="path2" alt="" @click="$emit('click2')"/></button>
        </header>
    `
});



// App pages
const homePage = Vue.component("homePage", {
    data: function() {
        return {isResumable: false};
    },
    methods: {
        /**
         * Handle a keyup event (implements keyboard shortcuts).
         * @param {object} e - The event args.
         */
        keyup: function(e) {
            if (this._inactive) return;
            if (e.key === "c") this.$router.push("verbs");
            if (e.key === "v") this.$router.push("vocab");
            if (e.key === "t") this.$router.push("reference");
            if (e.key === "r") this.$router.push("quizzer");
        },
    },
    activated: function() {
        // Update isResumable property
        try {
            // Get last session
            let { prompts, index } = JSON.parse(localStorage.getItem("last-session"));

            // Validate prompts and promptIndex
            if (prompts && !isNaN(index) && index >= 0 && index < prompts.length) {
                this.isResumable = true;
            }
        } catch {}
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
            <page-header icon2="settings" label2="Settings" @click2="$router.push({name:'settings', params:{referer:$route.name}})"></page-header>
            <main>
                <h1>What do you want to study?</h1>
                <div>
                    <router-link tag="button" to="/verbs">Study Conjugations</router-link>
                    <router-link tag="button" to="/vocab">Study Vocab</router-link>
                    <router-link tag="button" to="/reference">Reference Tables</router-link>
                </div>
                <router-link v-if="isResumable" to="/quizzer">Resume previous session</router-link>
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
                {
                    path: "/",
                    redirect: "/home"
                },
                {
                    path: "/home",
                    name: "home",
                    component: homePage
                },
                {
                    path: "/verbs",
                    name: "verbs",
                    meta: { title: "Verb Filters" },
                    component: filtersPage,
                    props: { category: "verbs" }
                },
                {
                    path: "/vocab",
                    name: "vocab",
                    meta: { title: "Vocab Filters" },
                    component: filtersPage,
                    props: { category: "vocab" }
                },
                {
                    path: "/settings",
                    name: "settings",
                    meta: { title: "Settings" },
                    component: settingsPage,
                    props: true
                },
                {
                    path: "/quizzer",
                    name: "quizzer",
                    meta: { title: "Quizzer" },
                    component: quizzerPage,
                    props: true
                },
                {
                    path: "/reference",
                    name: "reference",
                    meta: { title: "Reference Tables" },
                    component: referencePage
                },
                {
                    path: "/data",
                    beforeEnter: function() { window.location.href = "data"; }
                },
                {
                    path: "/tests",
                    beforeEnter: function() { window.location.href = "tests"; }
                },
                {
                    path: "*",
                    redirect: "/home"
                },
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
                    case "settings":
                        this.$router.push(this.$route.params.referer || "home");
                        break;
                    case "quizzer":
                        this.$router.push(this.$route.params.referer || "home");
                        break;
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

        watch: {
            $route: function(to, from) {
                if (to.meta.title) document.title = to.meta.title + " - Spanish-Quizzer";
                else document.title = "Spanish-Quizzer";
            }
        },

        created: function() {
            // Add keyup handler
            window.addEventListener("keyup", this.keyup);

            // Set page title
            if (this.$route.meta.title) document.title = this.$route.meta.title + " - Spanish-Quizzer";
            else document.title = "Spanish-Quizzer";
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
