# Nova Bilingual AI Tutor — GitHub Pages Package

This repository is the mobile-first scripted chatbot for the randomized English-only vs. strategic English–Nigerian Pidgin AI tutoring experiment.

## Data architecture

**Primary analysis data:** Exit Qualtrics. Nova passes all critical experimental variables to the Exit survey in one `Q_EED` Base64URL-encoded payload.

**Redundant backup:** Google Sheet. Nova sends start, training-complete, and final snapshots to a Google Apps Script web app using a hidden form POST. The study does not depend on receiving a cross-origin acknowledgment from Apps Script.

**Local recovery:** Nova saves the participant state to browser `localStorage` after every action. Reopening the same Nova URL on the same device resumes the unfinished state.

## Files

- `index.html` — participant application
- `styles.css` — mobile-first styling
- `js/config.js` — the only file you normally edit before launch
- `js/content.js` — frozen study stimuli and answer keys
- `js/app.js` — routing, scoring, persistence, Q_EED creation, backup logging
- `test-launcher.html` — simulates the Entry Qualtrics redirect
- `test-exit.html` — decodes and displays the exact payload that would enter Exit Qualtrics
- `apps-script/Code.gs` — redundant Google Sheet backup endpoint

## Before production

1. Upload this folder to a new GitHub repository and enable GitHub Pages.
2. Test with `test-launcher.html` on an actual phone.
3. Build the Entry and Exit Qualtrics surveys from the supplied survey specification.
4. Replace `exitSurveyUrl` in `js/config.js` with the anonymous Exit Qualtrics link.
5. Set `testMode: false`.
6. Upload/convert the supplied Excel workbook to Google Sheets.
7. In that Google Sheet, open **Extensions > Apps Script**, paste `apps-script/Code.gs`, save, and run `setupNovaBackup()` once.
8. Deploy Apps Script as a Web App. Execute as yourself; give access according to your institutional policy for anonymous participants. Copy the `/exec` URL.
9. Paste the `/exec` URL into `backupWebAppUrl` in `js/config.js`.
10. Run the full test matrix in the QA document before collecting real data.

## Entry Qualtrics redirect

The Entry survey must redirect to your GitHub Pages Nova URL and pass two values:

- `pid` = Entry Qualtrics `ResponseID`
- `condition` = randomized embedded data (`A` or `B`)

Use Qualtrics' **Insert Piped Text** function when building the redirect. Do not hand-type participant IDs.

## Exit Qualtrics

At the top of Exit Survey Flow, create all Embedded Data fields listed in the supplied `QUALTRICS_FIELDS` worksheet/document. Leave their values blank so they can be populated from the URL/Q_EED payload.

## Important

`Q_EED` is encoding, not encryption. Do not put names, email addresses, student IDs, passwords, or other sensitive identifying data in Nova or in the Q_EED payload.
