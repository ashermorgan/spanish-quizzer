# Import dependencies
import csv
import os
import random
import sys


# Display program information
print("Spanish Quizzer v 1.0.0")
print("Created by Asher Morgan")
print()


# Load verbs
verbs = []
with open(os.path.dirname(os.path.realpath(__file__)) + r"/Verbs.csv") as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        verbs +=[row]


# Get input & output types
outputTypes = []
inputTypes = []
print("Select settings: 'o' = output / prompt, 'i' = input / responce, ' ' = neither")
for Type in verbs[0]:
    # Get user input
    responce = input("\t" + Type + ": ")

    # Type is output
    if (responce.lower() == "o"):
        outputTypes += [True]
        inputTypes += [False]

    # Type is input
    elif (responce.lower() == "i"):
        outputTypes += [False]
        inputTypes += [True]

    # Type is neither
    else:
        outputTypes += [False]
        inputTypes += [False]


# Validate input & output types
if True not in outputTypes or True not in inputTypes:
    print("You must specify at least one output type and one input type.")
    sys.exit()


# Main loop
while True:
    # Choose verb
    verb = random.choice(verbs[1:])

    # Display output (prompt)
    print("VERB: ", end="")
    for i in range(0, len(outputTypes)):
        if (outputTypes[i] and verb[i] != ""):
            print(verb[i] + "\t ", end="")
    print()

    # Collect input (responce)
    for i in range(0, len(inputTypes)):
        if (inputTypes[i] and verb[i] != ""):
            responce = input("\t" + verbs[0][i] + ": ")
            responce = responce.lower()
            responce = responce.replace("a`", "á")
            responce = responce.replace("e`", "é")
            responce = responce.replace("i`", "í")
            responce = responce.replace("n`", "ñ")
            responce = responce.replace("o`", "ó")
            if (verb[i].lower() != responce):
                print ("\t\tINCORRECT: " + verb[i])
