# Import dependencies
from bs4 import BeautifulSoup
import csv
import requests



# Gets the conjugations of a verb from the Spanish Infinative
def getConjugations(verb):
    # Convert to lowercase
    verb = verb.lower().replace(" ", "")
    
    # Get page
    page = requests.get("https://www.spanishdict.com/conjugate/{0}".format(verb))
    soup = BeautifulSoup(page.text, "html.parser")

    # Get English infinative
    english = soup.find("div", class_="CMxOwuaP _1v-p9pvd").text
    
    # Get present participle
    presentParticiple = soup.find("div", class_="_2xfncFkp").text

    # Get Indicative conjugations
    conjugations = []
    rows = soup.find("table", class_="_2qmJM3i9").find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        conjugations += [[col.text for col in cols]]

    # Return verb info
    result = [english,verb, # Infinatives
        None, presentParticiple, # Present participle
        None, conjugations[1][1], conjugations[2][1], conjugations[3][1], conjugations[4][1], conjugations[6][1], # Present conjugations
        None, conjugations[1][2], conjugations[2][2], conjugations[3][2], conjugations[4][2], conjugations[6][2], # Preterite conjugations
        None, conjugations[1][3], conjugations[2][3], conjugations[3][3], conjugations[4][3], conjugations[6][3]] # Imperfect conjugations
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
    for row in rows[1:]:
        try:
            # Get correct conjugations
            temp = getConjugations(row[1])
        
            # Compare and correct conjugations
            for i in range(len(row)):
                if (temp[i] != None and temp[i].lower() != row[i].lower()):
                    row[i] = temp[i]
        except:
            print("Exception during {0}".format(row[1]))

    # Save csv
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        csvwriter = csv.writer(f)
        csvwriter.writerow(fields)
        csvwriter.writerows(rows)
