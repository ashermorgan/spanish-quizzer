# Import dependencies
from bs4 import BeautifulSoup
import csv
from os import path
import requests



# Gets the conjugations of a verb from the Spanish Infinative
def getConjugations(verb):
    # Convert to lowercase
    verb = verb.lower().replace(" ", "")

    # Get page
    page = requests.get("https://www.spanishdict.com/conjugate/{0}".format(verb))
    soup = BeautifulSoup(page.text, "html.parser")

    # Get English infinative
    english = soup.find("div", class_="quickdefWrapper--2qDMaLCj").text

    # Get participles
    presentParticiple = soup.find_all("div", class_="dashedBorder--2zu1T3f5")[0].text
    pastParticiple = soup.find_all("div", class_="dashedBorder--2zu1T3f5")[1].text

    # Get Indicative conjugations
    indicative = []
    rows = soup.find_all("table", class_="vtable--2WLTGmgs")[0].find_all("tr")
    for row in rows:
        cols = row.find_all("td")
        indicative += [[col.text for col in cols]]

    # Get Subjunctive conjugations
    subjunctive = []
    rows = soup.find_all("table", class_="vtable--2WLTGmgs")[1].find_all("tr")
    for row in rows:
        cols = row.find_all("td")
        subjunctive += [[col.text for col in cols]]

    # Return verb info
    result = [english,verb, # Infinitives
        None, presentParticiple, # Present participle
        None, pastParticiple, # Past participle
        None, indicative[1][1],  indicative[2][1], indicative[3][1], indicative[4][1], indicative[6][1], # Present conjugations
        None, indicative[1][2],  indicative[2][2], indicative[3][2], indicative[4][2], indicative[6][2], # Preterite conjugations
        None, indicative[1][3],  indicative[2][3], indicative[3][3], indicative[4][3], indicative[6][3], # Imperfect conjugations
        None, indicative[1][4],  indicative[2][4], indicative[3][4], indicative[4][4], indicative[6][4], # Conditional conjugations
        None, indicative[1][5],  indicative[2][5], indicative[3][5], indicative[4][5], indicative[6][5], # Future conjugations
        None, subjunctive[1][1], subjunctive[2][1], subjunctive[3][1], subjunctive[4][1], subjunctive[6][1], # Present Subjunctive conjugations
        None, subjunctive[1][2], subjunctive[2][2], subjunctive[3][2], subjunctive[4][2], subjunctive[6][2], # Imperfect Subjunctive conjugations
    ]
    return result



# Corrects the conjugations in a CSV file
def correctConjugations(filepath):
    # Load csv
    rows = []
    with open(filepath, encoding="utf-8") as f:
        csvreader = csv.reader(f)
        fields = next(csvreader)
        for row in csv.reader(f):
            rows.append(row)

    # Iterate over rows
    for row in rows:
        try:
            # Get correct conjugations
            temp = getConjugations(row[1])

            # Compare and correct conjugations
            for i in range(20, len(row)):
                if (temp[i] != None and temp[i].lower() != row[i].lower()):
                    row[i] = temp[i].capitalize()
        except Exception as e:
            print(f"Exception during {row[1]}: {e}")

    # Save csv
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        csvwriter = csv.writer(f)
        csvwriter.writerow(fields)
        csvwriter.writerows(rows)



# Correct conjugations in data/verbs.csv
if (__name__ == "__main__"):
    correctConjugations(path.join(path.dirname(__file__), "../data/verbs.csv"))
