// reference-tables component
const referenceTables = Vue.component("referenceTables", {
    props: {
        data: {
            type: Object,
            default: {},
        }
    },
    data: function() {
        return {
            category: "Choose a category",
            tableData: {...{"Choose a category":[]}, ...this.data},
            query: "",
        }
    },
    methods: {
        /**
         * Set the table height.
         */
        setTableHeight: function() {
            this.$refs.referenceTable.style.height = `${window.innerHeight - this.$refs.referenceTable.offsetTop - 10}px`;
        },

        /**
         * Get the language code that matches a label.
         * @param {String} label - The label.
         * @returns {String} - The language code ("en", "es", etc.)
         */
        getLang: function(label) {
            if (label.toLowerCase().includes("spanish")) {
                return "es";
            }
            else {
                return "en";
            }
        },

        /**
         * Handle a keyup event (implements keyboard shortcuts).
         * @param {object} e - The event args.
         */
        keyup: function(e) {
            if (this._inactive) return;
            if (e.key === "h" || e.key == "/") {
                try {
                    this.$refs.search.focus();
                } catch {}
            }
            if (e.key === "c") this.category = "verbs"
            if (e.key === "v") this.category = "vocab";
        },
    },
    mounted: function() {
        // Set table height
        this.setTableHeight();

        // Add onresize handler
        window.addEventListener("resize", this.setTableHeight);

        // Add keyup handler
        window.addEventListener("keyup", this.keyup);
    },
    destroyed: function() {
        // Remove onresize handler
        window.removeEventListener("resize", this.setTableHeight);

        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },
    template: `
    <div>
        <div class="referenceTableControls">
            <select aria-label="Vocab Set" v-model="category">
                <option>Choose a category</option>
                <option value="verbs">Conjugations</option>
                <option value="vocab">Vocab</option>
            </select>
            <input type="text" aria-label="Search" v-model="query" placeholder="Search"
                autocomplete="off" autocorrect="off" ref="search">
        </div>

        <div class="referenceTable" ref="referenceTable">
            <table>
                <tr v-for="(row, rowIndex) in data[category]" v-show="rowIndex === 0 || row.join(',').toLowerCase().includes(query.toLowerCase())">
                    <th v-if="rowIndex === 0" v-for="column in row">{{ column }}</th>
                    <td v-if="rowIndex !== 0" v-for="(column, columnIndex) in row" @click="Read(column, data[category][0][columnIndex])" :lang="getLang(data[category][0][columnIndex])">{{ column }}</td>
                </tr>
            </table>
        </div>
    </div>
    `
});



// reference-page component
const referencePage = Vue.component("referencePage", {
    template: `
        <div class="referencePage">
            <page-header @back="$emit('back');" image="images/arrow-left.svg"></page-header>
            <main>
                <reference-tables :data="this.$root.$data.data"></reference-tables>
            </main>
        </div>
    `,
});
