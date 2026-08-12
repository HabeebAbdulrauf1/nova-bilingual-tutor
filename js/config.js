window.NOVA_CONFIG = Object.freeze({
  studyVersion: "1.0.0",

  testMode: false,

  // Production mode: completed Nova sessions redirect to Exit Qualtrics.
  exitSurveyUrl: "https://usc.qualtrics.com/jfe/form/SV_8q7RFljHb99WfPM",

  // Redundant Google Sheet backup.
  // Qualtrics remains the primary analysis dataset.
  backupWebAppUrl: "https://script.google.com/macros/s/AKfycbxQ55s5Xhcpje9uR6hkHwj_auV78azxY5T0J0XZuj2Xh4WQZT7SGQ-utSYDt1RxHn83/exec",

  autoRedirectSeconds: 3,
  maxExitUrlLength: 1800
});
