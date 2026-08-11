window.NOVA_CONFIG = Object.freeze({
  studyVersion: "1.0.0",
  testMode: true,
  // In test mode, Nova redirects to the local payload inspector.
  // Replace with the anonymous link to the EXIT Qualtrics survey before production.
  exitSurveyUrl: "./test-exit.html",
  // Optional redundant backup. Leave blank while testing. After deploying Apps Script,
  // paste the /exec web-app URL here. Qualtrics remains the analysis source of truth.
  backupWebAppUrl: "",
  autoRedirectSeconds: 3,
  maxExitUrlLength: 1800
});
