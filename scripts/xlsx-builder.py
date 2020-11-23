# Import dependencies
import csv
import openpyxl
from openpyxl.styles.borders import Border, Side



# Converts a csv of verbs to a spreadsheet
def createXlsx(csvPath, xlsxPath):
    # Load csv
    rows = []
    with open(csvPath, encoding="utf-8") as f:
        for row in csv.reader(f): 
            rows.append(row)

    # Rearrange csv data
    data = [["English", "Infinitive", "Yo", "Tú", "Él", "Nosotros", "Ellos"]]
    for row in rows[1:]:
        data += [[row[0], row[0], row[5],  row[6],  row[7],  row[8],  row[9]]]      # Present
        data += [["",     "",     row[11], row[12], row[13], row[14], row[15]]]     # Preterite
        data += [["",     "",     row[17], row[18], row[19], row[20], row[21]]]     # Imperfect
        data += [["",     "",     row[23], row[24], row[25], row[26], row[27]]]     # Simple Future
    
    # Create spreadsheet
    vk = openpyxl.Workbook()

    # Get border styles
    thick = Side(border_style='thick', color="FF000000")
    thin = Side(border_style='thin', color="FF000000")

    # Set data
    sh = vk.active
    sh.page_setup.fitToHeight = False
    for row in range(len(data)):
        for column in range(len(data[row])):
            # Get cell
            cell = sh.cell(row=row + 1, column=column + 1)
            
            # Set cell value
            cell.value = data[row][column]

            # Get cell borders
            border = Border(
                left=cell.border.left,
                right=cell.border.right,
                top=cell.border.top,
                bottom=cell.border.bottom
            )

            # Set inner borders
            if column > 1:
                # Conjugation columns only
                border.top = thin
                border.bottom = thin
            if row % 4 == 1:
                # Present tense rows only
                border.top = thick
            border.left = thin
            border.right = thin

            # Set outside borders
            if column == 0:
                border.left = thick
            if column == len(data[row]) - 1:
                border.right = thick
            if row == 0:
                border.top = thick
            if row == len(data) - 1:
                border.bottom = thick

            # Update cell borders
            cell.border = border
    
    # Set page margins
    sh.page_margins.left = 0.25
    sh.page_margins.right = 0.25
    sh.page_margins.top = 0.75
    sh.page_margins.bottom = 0.25
    sh.page_margins.header = 0.3
    sh.page_margins.footer = 0

    # Save spreadsheet
    vk.save(xlsxPath)



# Create spreadsheet from Verbs.csv
if (__name__ == "__main__"):
    createXlsx("../vocab/Verbs.csv", "../vocab/Verbs.xlsx")
