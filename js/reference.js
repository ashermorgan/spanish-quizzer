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
            query: "",
            conjugationColors: true,
            sortIndex: 0,
            sortAccending: true,
        }
    },
    watch: {
        category: function() {
            // Reset sortIndex and sortAccending
            this.sortIndex = 0;
            this.sortAccending = true;
        }
    },
    computed: {
        /**
         * The color classes for verb conjugation cells
         */
        conjugationColorClasses: function() {
            let result = [];
            for (let row in this.tableData.verbs) {
                result.push([]);
                for (let column = 0; column < this.tableData.verbs[row].length; column++) {
                    // Check if cell is a type cell
                    if (!this.tableData.verbs[0][column].includes("Type")) {
                        if (column > 0) {
                            // Cell isn't a type cell, use color class of previous cell
                            result[row].push(result[row][column-1]);
                        }
                        else {
                            // Cell is in the first column
                            result[row].push("normal");
                        }
                    }

                    // Get color class
                    else if (this.tableData.verbs[row][column].includes("Irregular")) {
                        result[row].push("irregular");
                    }
                    else if (this.tableData.verbs[row][column].includes("Regular")) {
                        result[row].push("regular");
                    }
                    else if (this.tableData.verbs[row][column].includes("Stem Changing") || this.tableData.verbs[row][column].includes("Orthographic")) {
                        result[row].push("nonregular");
                    }
                    else {
                        result[row].push("normal");
                    }
                }
            }
            return result;
        },
        /**
         * The data used by the table
         */
        tableData: function() {
            return {...{"Choose a category":[]}, ...this.data};
        },
    },
    methods: {
        /**
         * Search for a string in the table
         * @param {Object} args - The event args (optional)
         */
        search: function(args) {
            if (args) args.target.blur();
            this.$refs.search.blur();
            this.query = this.$refs.search.value;
        },

        /**
         * Sort the table by values in a column
         * @param {Number} index The index of the column to sort by
         * @param {Boolean} accending Whether to sort accending or descending
         */
        sortColumn: function(index, accending) {
            // Get sort direction
            let direction;
            if (accending !== undefined) {
                direction = accending;
            }
            else if (this.sortIndex === index) {
                direction = !this.sortAccending;
            }
            else {
                direction = true;
            }

            // Remove headers
            let headers = this.data[this.category][0];
            this.data[this.category] = this.data[this.category].slice(1);

            // Sort data
            if (this.sortIndex === index && this.sortAccending === direction) {
                // Data is sorted by correct column AND in correct direction
            }
            else if (this.sortIndex === index && this.sortAccending !== direction) {
                // Data is sorted by correct column but in wrong direction
                this.data[this.category].reverse();
            }
            else {
                // Data is sorted by incorrect column AND in incorrect direction
                this.data[this.category].sort((a, b) => {
                    if (a[index] === b[index]) return 0;
                    else if (a[index] < b[index]) return -1;
                    else return 1;
                });
                if (!direction) this.data[this.category].reverse();
            }

            // Reinsert headers
            this.data[this.category].unshift(headers);

            // Set sortStatus
            this.sortIndex = index;
            this.sortAccending = direction;
        },

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
            if (label.toLowerCase().includes("english") || label.toLowerCase().includes("type") || label.toLowerCase().includes("category")) {
                return "en";
            }
            else {
                return "es";
            }
        },

        /**
         * Read a peice of text.
         * @param {String} text - The text to read.
         * @param {String} label - The language of the text.
         */
        Read: function(text, label)
        {
            var msg = new SpeechSynthesisUtterance(text);
            msg.lang = this.getLang(label);
            window.speechSynthesis.speak(msg);
        },

        /**
         * Handle a keyup event (implements keyboard shortcuts).
         * @param {object} e - The event args.
         */
        keyup: function(e) {
            if (this._inactive) return;
            if (e.keyCode === 13 && this.$refs.search === document.activeElement) this.search();
            if (this.$refs.search === document.activeElement) return;
            if (e.key === "h" || e.key == "/") {
                try {
                    this.$refs.search.focus();
                } catch {}
            }
            if (e.key === "c") this.category = "verbs"
            if (e.key === "v") this.category = "vocab";
            if (e.key === ",") this.$router.push({name:"settings", params:{referer:this.$route.name}});
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
    activated: function() {
        // Update conjugationColors setting
        this.conjugationColors = getSettings().conjugationColors;
    },
    template: `
    <div>
        <div class="referenceTableControls">
            <select aria-label="Vocab Set" v-model="category">
                <option>Choose a category</option>
                <option value="verbs">Conjugations</option>
                <option value="vocab">Vocab</option>
            </select>
            <div>
                <input type="text" ref="search" aria-label="Search" placeholder="Search" autocomplete="off" autocorrect="off">
                <button @click="search">Search</button>
            </div>
        </div>

        <div class="referenceTable" ref="referenceTable">
            <table>
                <tr v-for="(row, rowIndex) in data[category]" v-show="rowIndex === 0 || row.join(',').toLowerCase().includes(query.toLowerCase())">
                    <th v-if="rowIndex === 0" v-for="(column, columnIndex) in row" @click="sortColumn(columnIndex)">
                        <div>
                            <span>{{ column }}</span>
                            <button class="icon">
                                <img v-if="sortIndex === columnIndex && sortAccending" src="images/chevron-up.svg">
                            </button>
                            <button class="icon">
                                <img v-if="sortIndex === columnIndex && !sortAccending" src="images/chevron-down.svg">
                            </button>
                        </div>
                    </th>
                    <td v-if="rowIndex !== 0" v-for="(column, columnIndex) in row" @click="Read(column, data[category][0][columnIndex])"
                        :lang="getLang(data[category][0][columnIndex])" :class="(conjugationColors && category === 'verbs') ? conjugationColorClasses[rowIndex][columnIndex] : 'normal'">{{ column }}</td>
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
            <page-header icon1="arrow-left" label1="Back" @click1="$emit('back');"
                icon2="settings" label2="Settings" @click2="$router.push({name:'settings', params:{referer:$route.name}})"></page-header>
            <main>
                <reference-tables :data="this.$root.$data.data"></reference-tables>
            </main>
        </div>
    `,
});
