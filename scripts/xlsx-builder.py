# Import dependencies
import csv
import openpyxl
from openpyxl.styles.borders import Border, Side
from os import path

# Get type abbreveation
def getTypeAbbr(text):
    return text.replace("Regular", "R").replace("Reflexive", "X").replace("Stem Changing", "S").replace("Orthographic", "O").replace("Irregular", "I")

# Converts a csv of verbs to a spreadsheet
def createXlsx(csvPath, xlsxPath):
    # Load csv
    rows = []
    with open(csvPath, encoding="utf-8") as f:
        for row in csv.reader(f):
            rows.append(row)

    # Sort verbs by infinitive
    rows = sorted(rows[1:], key=lambda x: x[1])

    # Rearrange csv data
    data = [["Infinitive", "English & Participles", "Tense & Type", "Yo", "Tú", "Él", "Nosotros", "Ellos"]]
    for row in rows:
        data += [[row[1], row[0],                                       f"Present ({getTypeAbbr(row[6])})",      row[7],  row[8],  row[9],  row[10], row[11]]]  # Present
        data += [["",     "",                                           f"Preterite ({getTypeAbbr(row[12])})",   row[13], row[14], row[15], row[16], row[17]]]  # Preterite
        data += [["",     "",                                           f"Imperfect ({getTypeAbbr(row[18])})",   row[19], row[20], row[21], row[22], row[23]]]  # Imperfect
        data += [["",     f"Pres. Participle ({getTypeAbbr(row[2])}):", f"Conditional ({getTypeAbbr(row[24])})", row[25], row[26], row[27], row[28], row[29]]]  # Conditional
        data += [["",     row[3],                                       f"Future ({getTypeAbbr(row[30])})",      row[31], row[32], row[33], row[34], row[35]]]  # Simple Future
        data += [["",     f"Past Participle ({getTypeAbbr(row[4])}):",  f"Pres. Subj. ({getTypeAbbr(row[36])})", row[37], row[38], row[39], row[40], row[41]]]  # Present Subjunctive
        data += [["",     row[5],                                       f"Imp. Subj. ({getTypeAbbr(row[42])})",  row[43], row[44], row[45], row[46], row[47]]]  # Imperfect Subjunctive

    # Create spreadsheet
    vk = openpyxl.Workbook()

    # Get border styles
    thick = Side(border_style="thick", color="FF000000")
    thin = Side(border_style="thin", color="FF000000")

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
            if column == 1 and row % 7 > 3:
                # Participles only
                border.top = thin
                border.bottom = thin
            if row % 7 == 1:
                # Present tense rows only
                border.top = thick
            if row % 7 == 0:
                # Present Subjunctive tense rows only
                border.bottom = thick
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

    # Add page break
    for i in range(36, len(data), 35):
        sh.row_breaks.append(openpyxl.worksheet.pagebreak.Break(id=i))

    # Repeat first row every page
    sh.print_title_rows = "1:1"

    # Set page margins
    sh.page_margins.left = 0.25
    sh.page_margins.right = 0.25
    sh.page_margins.top = 0.75
    sh.page_margins.bottom = 0.25
    sh.page_margins.header = 0.3
    sh.page_margins.footer = 0

    # Set orientation to landscape
    openpyxl.worksheet.worksheet.Worksheet.set_printer_settings(sh, paper_size=1, orientation="landscape")

    # Save spreadsheet
    vk.save(xlsxPath)



# Create spreadsheet from Verbs.csv
if (__name__ == "__main__"):
    createXlsx(path.join(path.dirname(__file__), "../data/verbs.csv"), "verbs.xlsx")
