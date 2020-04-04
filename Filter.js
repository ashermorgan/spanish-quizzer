// Filters a vocabulary set given the filter name
function ApplyFilter(vocabSet, name) {
    // Declare variables
    var io;     // Format: [[<output index>, <input index>]]
    var value;  // Format: [[<index>, [<values>], exclude?]]

    // Get filter
    switch (name) {
        case "All Definitions":
            io = [[0,1], [1,0]];
            value = [];
            break;

        case "English to Spanish":
            io = [[0,1]];
            value = [];
            break;

        case "Spanish to English":
            io = [[1,0]];
            value = [];
            break;
        
        case "All Conjugations":
            io = [[0,2], [0,4], [0,5], [0,6], [0,7], [0,8], [0,10], [0,11], [0,12], [0,13], [0,14], [0,16], [0,17], [0,18], [0,19], [0,20]];
            value = [];
            break;
        
        case "Reverse Conjugations":
            io = [[2,0], [4,0], [5,0], [6,0], [7,0], [8,0], [10,0], [11,0], [12,0], [13,0], [14,0], [16,0], [17,0], [18,0], [19,0], [20,0]];
            value = [];
            break;

        case "Present Participles":
            io = [[0,2]];
            value = [];
            break;

        case "Present Tense":
            io = [[0,4], [0,5], [0,6], [0,7], [0,8]];
            value = [];
            break;

        case "Preterite Tense":
            io = [[0,10], [0,11], [0,12], [0,13], [0,14]]
            value = [];
            break;

        case "Imperfect Tense":
            io = [[0,16], [0,17], [0,18], [0,19], [0,20]];
            value = [];
            break;

        case "Nouns":
            io = [[0,1], [1,0]];
            value = [[2, ["Noun"], false]];
            break;

        case "Verbs":
            io = [[0,1], [1,0]];
            value = [[2, ["Verb"], false]];
            break;

        case "Adjectives":
            io = [[0,1], [1,0]];
            value = [[2, ["Adjective"], false]];
            break;

        default:
            io = [];
            value = [];
            break;
    }

    // Filter terms by value
    var vSet = vocabSet.slice(1);  // Format: same as vocabSet but without headers
    for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            if (value[i][2]) {
                // Exclude values
                if (value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
            else {
                // Include values
                if (!value[i][1].includes(vSet[j][value[i][0]])) {
                    vSet.splice(j, 1);  // Remove item
                    j--;    // Adjust for the removal of an item
                }
            }
        }
    }

    // Filter terms by input/output
    var ioSet = []; // Format: [<output type>, <output>, <input type>, <input>]
    for (var i = 0; i < io.length; i++) {
        for (var j = 0; j < vSet.length; j++) {
            ioSet.push([vocabSet[0][io[i][0]], vSet[j][io[i][0]], vocabSet[0][io[i][1]], vSet[j][io[i][1]]]);
        }
    }

    // Return filtered set
    return ioSet;
}