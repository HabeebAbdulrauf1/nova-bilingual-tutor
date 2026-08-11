/**
 * Nova redundant Google Sheet backup endpoint.
 * IMPORTANT: Qualtrics Exit is the analysis source of truth. This endpoint is a redundant raw backup.
 * Deploy this Apps Script as a Web App after running setupNovaBackup() once from a script bound to the Google Sheet.
 */

const RAW_SHEET = 'RAW_LOG';
const FINAL_SHEET = 'FINAL_BACKUP';
const SCRIPT_PROPERTY_ID = 'NOVA_SPREADSHEET_ID';

const FINAL_FIELDS = [
  'event_id','server_saved_at','pid','condition','study_version','nova_complete','mental_effort','estimated_score',
  't1_resp','t1_correct','t2_resp','t2_correct','t3_resp','t3_correct','t4_resp','t4_correct','t5_resp','t5_correct','t6_resp','t6_correct',
  'p1c_resp','p1c_correct','p1p_resp','p1p_correct','p2c_resp','p2c_correct','p2p_resp','p2p_correct',
  'p3c_resp','p3c_correct','p3p_resp','p3p_correct','p4c_resp','p4c_correct','p4p_resp','p4p_correct',
  'p5c_resp','p5c_correct','p5p_resp','p5p_correct','p6c_resp','p6c_correct','p6p_resp','p6p_correct',
  'total_transfer','conceptual_transfer','procedural_transfer','calibration_bias'
];

function setupNovaBackup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this Apps Script from the Google Sheet (Extensions > Apps Script), then run setupNovaBackup again.');
  PropertiesService.getScriptProperties().setProperty(SCRIPT_PROPERTY_ID, ss.getId());
  ensureSheet_(ss, RAW_SHEET, ['server_saved_at','event_id','phase','pid','condition','study_version','saved_at_client','payload_json']);
  ensureSheet_(ss, FINAL_SHEET, FINAL_FIELDS);
  SpreadsheetApp.flush();
  Logger.log('Nova backup setup complete for spreadsheet: ' + ss.getId());
}

function doPost(e) {
  try {
    const raw = e && e.parameter ? e.parameter.payload : '';
    if (!raw) throw new Error('Missing payload');
    const packet = JSON.parse(raw);
    validatePacket_(packet);

    const ssId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROPERTY_ID);
    if (!ssId) throw new Error('Run setupNovaBackup() before deploying the web app.');

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const ss = SpreadsheetApp.openById(ssId);
      const rawSheet = ensureSheet_(ss, RAW_SHEET, ['server_saved_at','event_id','phase','pid','condition','study_version','saved_at_client','payload_json']);
      rawSheet.appendRow([
        new Date(), packet.event_id, packet.phase, packet.pid, packet.condition,
        packet.study_version, packet.saved_at_client || '', raw
      ]);

      if (packet.phase === 'final' && packet.data) {
        const finalSheet = ensureSheet_(ss, FINAL_SHEET, FINAL_FIELDS);
        if (!eventExists_(finalSheet, packet.event_id)) {
          const core = packet.data;
          const rowObject = Object.assign({}, core, {
            event_id: packet.event_id,
            server_saved_at: new Date(),
            pid: packet.pid,
            condition: packet.condition,
            study_version: packet.study_version
          });
          finalSheet.appendRow(FINAL_FIELDS.map(f => rowObject[f] !== undefined ? rowObject[f] : ''));
        }
      }
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput('ERROR').setMimeType(ContentService.MimeType.TEXT);
  }
}

function validatePacket_(packet) {
  if (!packet || typeof packet !== 'object') throw new Error('Invalid packet');
  if (!/^[A-Za-z0-9_-]{3,100}$/.test(String(packet.pid || ''))) throw new Error('Invalid pid');
  if (!['A','B'].includes(String(packet.condition || ''))) throw new Error('Invalid condition');
  if (!['start','training_complete','final'].includes(String(packet.phase || ''))) throw new Error('Invalid phase');
  if (!String(packet.event_id || '').startsWith(String(packet.pid))) throw new Error('Invalid event_id');
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}

function eventExists_(sheet, eventId) {
  if (sheet.getLastRow() < 2) return false;
  const finder = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(String(eventId)).matchEntireCell(true);
  return !!finder.findNext();
}
