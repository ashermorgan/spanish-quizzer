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
const referencePage = Vue.component("referencePage", {
    template: `
        <div>
            <page-header @back="$emit('back');" image="images/arrow-left.svg"></page-header>
            <main>
                <reference-tables :data="this.$root.$data.data"></reference-tables>
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
            ],
        }),

        methods: {
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
            }
        },

        data: {
            data: {}
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
