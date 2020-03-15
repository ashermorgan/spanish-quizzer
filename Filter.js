class Filter
{
    // Create a new Filter
    constructor(io, value)
    {
        // Set variables
        this.IO = io;       // Format: [[<output index>, <input index>]]
        this.Value = value; // Format: [[<index>, [<values>], exclude?]]
    }


    // Apply the filter to a vocabulary set
    Apply(vocabSet)
    {
        // Filter terms by value
        var vSet = vocabSet.slice(1);  // Format: same as vocabSet but without headers
        for (var i = 0; i < this.Value.length; i++)
        {
            for (var j = 0; j < vSet.length; j++)
            {
                if (this.Value[i][2])
                {
                    // Exclude values
                    if (this.Value[i][1].includes(vSet[j][this.Value[i][0]]))
                    {
                        vSet.splice(j, 1);  // Remove item
                        j--;    // Adjust for the removal of an item
                    }
                }
                else
                {
                    // Include values
                    if (!this.Value[i][1].includes(vSet[j][this.Value[i][0]]))
                    {
                        vSet.splice(j, 1);  // Remove item
                        j--;    // Adjust for the removal of an item
                    }
                }
            }
        }

        // Filter terms by input/output
        var ioSet = []; // Format: [<output type>, <output>, <input type>, <input>]
        for (var i = 0; i < this.IO.length; i++)
        {
            for (var j = 0; j < vSet.length; j++)
            {
                ioSet.push([vocabSet[0][this.IO[i][0]], vSet[j][this.IO[i][0]], vocabSet[0][this.IO[i][1]], vSet[j][this.IO[i][1]]]);
            }
        }

        // Return filtered set
        return ioSet;
    }
}