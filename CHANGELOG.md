# Changelog

## 3.0.0 - 2021-04-03

### New
- **Progressive Web App:** Spanish-Quizzer can now be installed as a PWA so that
    it launches in its own window and works offline.
- **Diffs:** When you miss a prompt, Spanish-Quizzer will highlight the
    differences between your response and the correct answer. This feature can
    be disabled in settings.
- **Color coded conjugations:** Conjugations are color coded by type in the
    reference tables (green=regular, orange=nonregular, red=irregular). This
    feature can be disabled in settings.
- **Reference table sorting:** You can now sort the reference tables by a
    specific column by clicking on the column header or the arrows in the column
    header.
- **New conjugations and vocabulary:**
    - Past participle conjugations
    - Present subjunctive conjugations
    - Food vocabulary
    - Numbers vocabulary

### Changed
- **Various UI improvements**
- **Improved keyboard shortcuts:**
    - `h` or `/` to focus the search bar in the reference tables
    - `c` and `v` to switch categories in the reference tables
    - `c`, `v`, and `t` to navigate to other pages from the home page
    - `r` to resume the previous session from the home page
    - `,` to open settings (when available)
- **Remove duplicates:** Added a setting that prevents duplicate prompts from
    appearing in the quizzer.
- **Default filters:** You can now customize the default vocab and verb filters
    in settings.
- **Repeat missed prompts:** Added the option to repeat missed prompts 5 *and*
    10 prompts later to get extra practice with difficult prompts.
- **Reset settings:** Added a button in the settings page to reset all settings
    to their default values.

### Fixed
- Fixed issue where libraries failed to load on some devices
- Reduced lag in the reference table search bar
- Fixed issues with audio prompts
- The user's preferred theme is now detected and applied on first visit
- Centered filters on the vocab and verb filters page

## 2.7.0 - 2020-11-28

### New Vocabulary
- Added "Bien" and "Mal" to the list of Adverbs.
- Added "Pensar" and "Viajar" to the list of Verbs.
- Added verb conjugations in the simple future tense.

### New Features
- Added new filters. Conjugations can now be filtered by subject and direction.
    Vocabulary sets can now be filtered by word type and direction. Vocab sets
    can also now be filtered with the "All Sets" filter.
- Added `onMissedPrompt` setting. You can now have Spanish-Quizzer ignore
    mistakes, tell you when you make a mistake but not what the correct answer
    is, or tell you when you make a mistake and what the correct answer is.
- Added `multiplePrompts` setting to control whether multiple prompts (such as
    "El ave, El pájaro") are displayed together, split into separate questions,
    or if only one is displayed.
- Added `multipleAnswers` setting to control whether all answers are required.

### Improved Features
- Made it easier to find raw vocab sets and verb conjugations by creating the
    [vocab page](https://apps.ashermorgan.net/spanish-quizzer/vocab/).
- Disabled auto correct in the reference tables search bar to make it easier to
    search for Spanish words.
- Improved noscript message.

### Fixed Issues
- Fixed broken keyboard shortcuts for Safari on iOS.
- Fixed issue that caused the `repeatPrompts` setting to be ignored.
- Fixed issue where running the tests overrided the `promptType` setting.
- Fixed bug in browser validation for `promptType` and `inputType` settings.

## 2.6.0 - 2020-09-29

### New Features
- Created two separate quizzers (one for verb conjugations and another for
    vocab)
- Added several keyboard shortcuts (`Esc` = go back, `Ctrl+Enter` = skip prompt)

### Improved Features
- Improved the appearance and the dark mode
- Improved verb filters (tense and type filters can now be used together)

### Fixed
- Fixed several bugs
- Corrected many Spanish errors.

## 2.5.0 - 2020-06-22

### New Features
- Voice input
- Added session resume feature.
- Added more vocab filters.
- Added option to repeat terms at end.

### Improved Features
- Correct responses are read aloud when you click on them.
- Improved the quizzer interface

### Bugs Fixes
- Fixed Spanish errors.
- Skip button now works during quizzer feedback stage.

## 2.4.0 - 2020-05-09

### New Vocab
- Common Transitions

### New Features
- You can now click on a term in the reference tables to hear it spoken.
- Added a skip button.
- Added a new non-regular verb filter.

### Improved Features
- The reference tables now have sticky headers.
- The reference tables look better when printing.

### Bugs Fixes
- Corrected many Spanish (and English) errors.
- Shortcuts are no longer applied only once per response.
- Double tapping on mobile devices no longer causes the site to zoom in.

## 2.3.0 - 2020-04-11

### New Features
- Added [reference tables](https://apps.ashermorgan.net/spanish-quizzer/Reference/).
- Added audio prompts.
- Added option to repeat missed prompts.

### Improved Features
- Simplified the settings interface to allow for greater customization.
- User settings now auto-save.
- Improved the interface appearance (especially in dark mode).

### Bugs Fixes
- Extra and unnecessary spaces are now removed from responses.
- There is no longer a blank prompt in the adjectives set.
- Corrected many Spanish (and English) errors.

## 2.2.0 - 2020-03-24

### New Vocabulary
- Common Adjectives
- Common Adverbs
- Colors (Los Colores)
- Days (Los Días)
- Months (Los Meses)
- Weather (La Clima)
- Questions (Las Preguntas)
- Family (La Familia)
- Cloths (La Ropa)
- Professions (Las Profesiones)
- Health (La Salud)

### New Features
- Dark Mode
- Users can now click the page title to restart without reloading the page.
- Added a progress label in the quizzer.
- Added more character shortcuts (``` u` ``` to `ú`, `n~` to `ñ`, and `u~` to
    `ü`).
- Added new vocabulary set filters.

### Improved Features
- Improved the random prompt generator.
- Improved the response checking algorithm
- Improved the appearance of the user interface.

### Bugs Fixes
- Fixed zooming and scrolling issues on mobile devices.
- Users will now never get the same prompt twice in a row.
- Fixed many Spanish (and English) errors in vocabulary sets.

## 2.1.0 - 2020-03-15

### New Vocabulary
- Common Prepositions
- Nature (La Naturaleza)
- House (La Casa)
- Vacations (Las Vacaciones)
- Childhood (La Niñez)

### New Features
- Users can now study multiple sets at the same time.
- Users can now give multiple answers separated by commas.

### Improved Features
- Vocabulary sets of all types can now be easily filtered by input/output and by
    value.
- The quizzer interface has been improved.

### Fixed Bugs / Errors
- Various Spanish errors were fixed.

## 2.0.0 - 2020-05-13
Web app

## 1.0.0 - 2020-03-08
Python CLI
