# Import dependencies
from bs4 import BeautifulSoup
import requests



# Gets the conjugations of a verb from the Spanish Infinative
def getConjugations(verb):
    # Convert to lowercase
    verb = verb.lower().replace(" ", "")
    
    # Get page
    page = requests.get("https://www.spanishdict.com/conjugate/{0}".format(verb))
    soup = BeautifulSoup(page.text, "html.parser")

    # Get Indicative conjugations
    conjugations = []
    rows = soup.find("table", class_="_2qmJM3i9").find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        conjugations += [[col.text for col in cols]]

    # Return verb info
    result = [None,verb, # Infinatives
        None,None, # Present participle
        None, conjugations[1][1], conjugations[2][1], conjugations[3][1], conjugations[4][1], conjugations[6][1], # Present conjugations
        None, conjugations[1][2], conjugations[2][2], conjugations[3][2], conjugations[4][2], conjugations[6][2], # Preterite conjugations
        None, conjugations[1][3], conjugations[2][3], conjugations[3][3], conjugations[4][3], conjugations[6][3]] # Imperfect conjugations
    return result
