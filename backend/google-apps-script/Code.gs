/**
 * ============================================================================
 * OLIVAR DESIGN — CONSULTATION LEAD MANAGEMENT & INSTANT NOTIFICATION SYSTEM
 * Google Apps Script (Automatically creates/formats the "Olivar Design —
 * Consultation Leads" spreadsheet, generates sequential atomic Lead IDs
 * OD-2026-001, OD-2026-002..., appends rows, and sends mobile-first HTML
 * notification emails with 1-click "OPEN IN WHATSAPP" to design@olivardesign.com)
 * ============================================================================
 */

const CONFIG = {
  SPREADSHEET_ID: '1H13nMTP8tUmiwpBm7RBJPSBdB_sqdNzXf7jvFrZp-8A',
  SPREADSHEET_NAME: 'Olivar Design — Consultation Leads',
  SHEET_TAB_NAME: 'Consultation Leads',
  NOTIFICATION_EMAIL: 'design@olivardesign.com',
  LEAD_ID_PREFIX: 'OD-2026-',
  DEFAULT_STATUS: 'NEW LEAD',
  PIPELINE_STATUSES: [
    'NEW LEAD',
    'CONTACTED',
    'CONSULTATION SCHEDULED',
    'CONSULTATION COMPLETED',
    'PROPOSAL SENT',
    'SIGNED',
    'LOST / NOT QUALIFIED'
  ]
};

const HEADERS = [
  // MANAGEMENT (Columns A - F)
  'Lead ID',
  'Status',
  'Assigned To',
  'Consultation Date / Time',
  'Internal Notes',
  'Submitted At (Riyadh)',
  // CLIENT INFORMATION (Columns G - J)
  'Full Name',
  'WhatsApp / Phone',
  'Email',
  'Preferred Language',
  // PROJECT INFORMATION (Columns K - R)
  'Services Requested',
  'Project Type',
  'City / Region',
  'District / Neighborhood',
  'Plot / Project Area',
  'Current Stage',
  'Target Timeline',
  'Project Description',
  // MARKETING ATTRIBUTION (Columns S - AB)
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'UTM Term',
  'Ad Click ID(s)',
  'Initial Referrer',
  'Initial Landing Page',
  'Submission Page',
  'Device Type'
];

/**
 * 1. Gets or automatically creates & formats the "Olivar Design — Consultation Leads" Google Sheet.
 */
function getOrCreateLeadSheet() {
  const props = PropertiesService.getScriptProperties();
  let ssId = CONFIG.SPREADSHEET_ID || props.getProperty('OLIVAR_SPREADSHEET_ID');
  let ss = null;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    props.setProperty('OLIVAR_SPREADSHEET_ID', ss.getId());
  } else if (!ssId) {
    props.setProperty('OLIVAR_SPREADSHEET_ID', ss.getId());
  }

  let sheet = ss.getSheetByName(CONFIG.SHEET_TAB_NAME);
  if (!sheet) {
    const firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getLastRow() === 0) {
      firstSheet.setName(CONFIG.SHEET_TAB_NAME);
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet(CONFIG.SHEET_TAB_NAME);
    }
  }

  // Initialize headers & formatting if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setBackground('#2C3529')
      .setFontColor('#EAE0D5')
      .setFontWeight('bold')
      .setFontFamily('Arial')
      .setFontSize(10)
      .setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 34);

    // Set comfortable column widths
    sheet.setColumnWidth(1, 130); // Lead ID
    sheet.setColumnWidth(2, 195); // Status
    sheet.setColumnWidth(3, 140); // Assigned To
    sheet.setColumnWidth(4, 175); // Consultation Date / Time
    sheet.setColumnWidth(5, 240); // Internal Notes
    sheet.setColumnWidth(6, 165); // Submitted At
    sheet.setColumnWidth(7, 180); // Full Name
    sheet.setColumnWidth(8, 155); // WhatsApp / Phone
    sheet.setColumnWidth(9, 200); // Email
    sheet.setColumnWidth(10, 140); // Preferred Language
    sheet.setColumnWidth(11, 240); // Services Requested
    sheet.setColumnWidth(12, 160); // Project Type
    sheet.setColumnWidth(13, 150); // City / Region
    sheet.setColumnWidth(14, 160); // District
    sheet.setColumnWidth(15, 150); // Area
    sheet.setColumnWidth(16, 210); // Current Stage
    sheet.setColumnWidth(17, 160); // Timeline
    sheet.setColumnWidth(18, 300); // Project Description
  }

  return { ss: ss, sheet: sheet };
}

/**
 * 2. Generates a sequential, concurrency-safe Lead ID: OD-2026-001, OD-2026-002, etc.
 */
function generateNextLeadId(sheet) {
  const props = PropertiesService.getScriptProperties();
  let lastSeq = parseInt(props.getProperty('OLIVAR_LAST_LEAD_SEQ') || '0', 10);
  const existingDataRows = Math.max(0, sheet.getLastRow() - 1);
  if (existingDataRows > lastSeq) {
    lastSeq = existingDataRows;
  }
  const nextSeq = lastSeq + 1;
  props.setProperty('OLIVAR_LAST_LEAD_SEQ', String(nextSeq));
  const padded = String(nextSeq).padStart(3, '0');
  return CONFIG.LEAD_ID_PREFIX + padded;
}

/**
 * 3. Applies the Pipeline Status dropdown validation to Column B of the newly inserted row.
 */
function applyStatusDropdown(sheet, rowIndex) {
  try {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.PIPELINE_STATUSES, true)
      .setAllowInvalid(false)
      .build();
    const statusCell = sheet.getRange(rowIndex, 2);
    statusCell.setDataValidation(rule);
    statusCell.setFontWeight('bold');
  } catch (e) {}
}

/**
 * 4. Builds & sends the mobile-optimized HTML + plain-text notification email to design@olivardesign.com
 */
function sendLeadNotificationEmail(record) {
  const recipient = record.recipient || CONFIG.NOTIFICATION_EMAIL;
  const subject = 'New Consultation Request | ' + record.leadId + ' | ' + record.fullName;

  const waMessage = 'Hello ' + record.fullName + ', this is Olivar Design. We received your consultation request regarding your ' + record.projectType + ' project.';
  const waDigits = String(record.phoneNormalized || record.phoneRaw || '').replace(/\D/g, '');
  const telNumber = waDigits ? ('+' + waDigits) : String(record.phoneNormalized || record.phoneRaw || '').trim();
  const telUrl = 'tel:' + telNumber;
  const waUrl = 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(waMessage);

  const htmlBody = [
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F9F8F5; color: #2A2D2B; border: 1px solid #D4C9B4; border-radius: 10px; overflow: hidden;">',
      '<div style="background-color: #2C3529; color: #EAE0D5; padding: 24px 24px 20px;">',
        '<div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #D4C9B4; margin-bottom: 6px;">OLIVAR DESIGN · NEW CONSULTATION REQUEST</div>',
        '<div style="font-size: 22px; font-weight: 400; color: #EAE0D5; margin-bottom: 4px;">' + escapeHtml(record.fullName) + '</div>',
        '<div style="font-size: 13px; color: #D4C9B4;">Lead ID: <strong>' + escapeHtml(record.leadId) + '</strong> &nbsp;·&nbsp; Status: <strong>NEW LEAD</strong></div>',
      '</div>',

      '<div style="padding: 24px;">',
        '<div style="margin-bottom: 24px; text-align: center; font-size: 0;">',
          '<div style="display: inline-block; width: 100%; max-width: 265px; vertical-align: top; padding: 4px; box-sizing: border-box;">',
            '<a href="' + telUrl + '" style="display: block; width: 100%; box-sizing: border-box; background-color: #FFFFFF; color: #2C3529; border: 1px solid #2C3529; text-decoration: none; padding: 14px 16px; border-radius: 40px; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-align: center;">',
              'CALL CLIENT',
            '</a>',
          '</div>',
          '<div style="display: inline-block; width: 100%; max-width: 265px; vertical-align: top; padding: 4px; box-sizing: border-box;">',
            '<a href="' + waUrl + '" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #2C3529; color: #EAE0D5; border: 1px solid #2C3529; text-decoration: none; padding: 14px 16px; border-radius: 40px; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-align: center;">',
              'OPEN IN WHATSAPP',
            '</a>',
          '</div>',
          '<div style="font-size: 11px; color: #6B726C; margin-top: 8px; line-height: 1.4;">Direct dial (' + escapeHtml(telNumber) + ') or open WhatsApp with pre-filled greeting</div>',
        '</div>',

        '<div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #3B4A3F; font-weight: 700; border-bottom: 1px solid #D4C9B4; padding-bottom: 6px; margin-bottom: 12px;">Client Information</div>',
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 22px;">',
          rowHtml('Client Name', record.fullName),
          rowHtml('WhatsApp / Phone', record.phoneNormalized),
          rowHtml('Email', record.email || '— (Not provided)'),
          rowHtml('Language', record.language),
        '</table>',

        '<div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #3B4A3F; font-weight: 700; border-bottom: 1px solid #D4C9B4; padding-bottom: 6px; margin-bottom: 12px;">Project Qualification</div>',
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 22px;">',
          rowHtml('Service(s)', record.services),
          rowHtml('Project Type', record.projectType),
          rowHtml('City / Region', record.city),
          rowHtml('District', record.district || '—'),
          rowHtml('Project Area', record.area || '—'),
          rowHtml('Current Stage', record.stage),
          rowHtml('Target Timeline', record.timeline),
          rowHtml('Project Description', record.description || '—'),
        '</table>',

        '<div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #3B4A3F; font-weight: 700; border-bottom: 1px solid #D4C9B4; padding-bottom: 6px; margin-bottom: 12px;">Marketing Attribution & Timestamp</div>',
        '<table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #6B726C;">',
          rowHtml('Source / Medium', (record.utmSource || 'Direct') + (record.utmMedium ? ' / ' + record.utmMedium : '')),
          rowHtml('Campaign / Content', (record.utmCampaign || '—') + (record.utmContent ? ' / ' + record.utmContent : '')),
          rowHtml('Device & Landing', record.deviceType + ' · ' + record.landingPage),
          rowHtml('Submitted At (Riyadh)', record.submittedAtRiyadh),
          record.sheetUrl ? rowHtml('Google Sheet', '<a href="' + record.sheetUrl + '" style="color:#2C3529;">Open Lead Database →</a>', true) : '',
        '</table>',
      '</div>',
    '</div>'
  ].join('');

  const plainBody = [
    'OLIVAR DESIGN — NEW CONSULTATION REQUEST',
    'Lead ID: ' + record.leadId,
    'Status: NEW LEAD',
    'Submitted At (Riyadh): ' + record.submittedAtRiyadh,
    '',
    'CLIENT INFORMATION',
    'Name: ' + record.fullName,
    'WhatsApp / Phone: ' + record.phoneNormalized,
    'Email: ' + (record.email || '—'),
    'Language: ' + record.language,
    '',
    'CALL CLIENT:',
    telUrl,
    '',
    'OPEN IN WHATSAPP:',
    waUrl,
    '',
    'PROJECT DETAILS',
    'Service(s): ' + record.services,
    'Project Type: ' + record.projectType,
    'City / Region: ' + record.city,
    'District: ' + (record.district || '—'),
    'Project Area: ' + (record.area || '—'),
    'Current Stage: ' + record.stage,
    'Timeline: ' + record.timeline,
    'Description: ' + (record.description || '—'),
    '',
    'MARKETING ATTRIBUTION',
    'Source / Medium: ' + (record.utmSource || 'Direct') + ' / ' + (record.utmMedium || '—'),
    'Campaign: ' + (record.utmCampaign || '—'),
    'Device: ' + record.deviceType
  ].join('\n');

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'Olivar Design Consultation System'
  });
}

function rowHtml(label, value, isRawHtml) {
  const safeVal = isRawHtml ? value : escapeHtml(value);
  return '<tr>' +
    '<td style="padding: 7px 10px 7px 0; color: #6B726C; width: 38%; vertical-align: top; font-weight: 500;">' + escapeHtml(label) + '</td>' +
    '<td style="padding: 7px 0; color: #2A2D2B; vertical-align: top; font-weight: 500;">' + safeVal + '</td>' +
  '</tr>';
}

function escapeHtml(str) {
  return String(str === null || str === undefined ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 5. HTTP POST Webhook Handler (Called securely by /api/consultation)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000); // Ensure atomic Lead ID generation and row insertion

  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(rawBody);

    const { ss, sheet } = getOrCreateLeadSheet();
    const leadId = generateNextLeadId(sheet);

    const riyadhTimestamp = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm:ss') + ' AST';

    const client = payload.client || {};
    const project = payload.project || {};
    const attr = payload.attribution || {};

    const adClickIds = [
      attr.fbclid ? 'fbclid:' + attr.fbclid : '',
      attr.gclid ? 'gclid:' + attr.gclid : '',
      attr.ttclid ? 'ttclid:' + attr.ttclid : '',
      attr.twclid ? 'twclid:' + attr.twclid : ''
    ].filter(Boolean).join(', ');

    const record = {
      leadId: leadId,
      status: CONFIG.DEFAULT_STATUS,
      submittedAtRiyadh: riyadhTimestamp,
      recipient: payload.notification_recipient || CONFIG.NOTIFICATION_EMAIL,
      fullName: String(client.full_name || '').trim(),
      phoneRaw: String(client.phone_raw || '').trim(),
      phoneNormalized: String(client.phone_normalized || client.phone_raw || '').trim(),
      email: String(client.email || '').trim(),
      language: String(client.preferred_language || 'English (EN)'),
      services: Array.isArray(project.services) ? project.services.join(', ') : String(project.services_formatted || ''),
      projectType: String(project.project_type || ''),
      city: String(project.city || ''),
      district: String(project.district || ''),
      area: String(project.area || ''),
      stage: String(project.stage || ''),
      timeline: String(project.timeline || ''),
      description: String(project.description || ''),
      utmSource: String(attr.utm_source || 'Direct'),
      utmMedium: String(attr.utm_medium || ''),
      utmCampaign: String(attr.utm_campaign || ''),
      utmContent: String(attr.utm_content || ''),
      utmTerm: String(attr.utm_term || ''),
      adClickIds: adClickIds,
      initialReferrer: String(attr.initial_referrer || 'Direct'),
      landingPage: String(attr.landing_page || '/consultation'),
      submissionPage: String(attr.submission_page || '/consultation'),
      deviceType: String(attr.device_type || 'Desktop'),
      sheetUrl: ss.getUrl()
    };

    const rowValues = [
      record.leadId,
      record.status,
      '', // Assigned To
      '', // Consultation Date / Time
      '', // Internal Notes
      record.submittedAtRiyadh,
      record.fullName,
      record.phoneNormalized,
      record.email,
      record.language,
      record.services,
      record.projectType,
      record.city,
      record.district,
      record.area,
      record.stage,
      record.timeline,
      record.description,
      record.utmSource,
      record.utmMedium,
      record.utmCampaign,
      record.utmContent,
      record.utmTerm,
      record.adClickIds,
      record.initialReferrer,
      record.landingPage,
      record.submissionPage,
      record.deviceType
    ];

    sheet.appendRow(rowValues);
    const insertedRowIndex = sheet.getLastRow();
    applyStatusDropdown(sheet, insertedRowIndex);

    // Send immediate email notification to design@olivardesign.com
    sendLeadNotificationEmail(record);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        lead_id: record.leadId,
        status: record.status,
        submitted_at: record.submittedAtRiyadh,
        sheet_url: record.sheetUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: String(err && err.message ? err.message : err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * 6. One-Click Initializer & Browser GET Trigger
 * Opening the Web App URL once in the browser authorizes SpreadsheetApp + MailApp
 * and formats the "Olivar Design — Consultation Leads" spreadsheet immediately.
 */
function doGet(e) {
  const { ss, sheet } = getOrCreateLeadSheet();
  const html = [
    '<div style="font-family: sans-serif; max-width: 520px; margin: 60px auto; padding: 32px; background: #F9F8F5; border: 1px solid #D4C9B4; border-radius: 12px; text-align: center; color: #2C3529;">',
      '<h2 style="margin: 0 0 12px; font-weight: 500;">Olivar Design Lead Database Connected ✓</h2>',
      '<p style="color: #6B726C; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Your Google Sheet and Email Notification system are now authorized and active.</p>',
      '<a href="' + ss.getUrl() + '" target="_blank" style="display: inline-block; background: #2C3529; color: #EAE0D5; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">Open Google Sheet →</a>',
    '</div>'
  ].join('');
  return HtmlService.createHtmlOutput(html).setTitle('Olivar Design — Lead System Active');
}

/**
 * Automatically adds an "Olivar Setup" button in the top menu bar of the Google Sheet
 * so you can authorize the script with one click right inside the spreadsheet.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Olivar Setup')
    .addItem('1. Click Here to Authorize & Format Sheet', 'authorizeAndFormatFromSheet')
    .addToUi();
}

function authorizeAndFormatFromSheet() {
  const { ss, sheet } = getOrCreateLeadSheet();
  SpreadsheetApp.getUi().alert('Olivar Design Lead Database is now authorized and formatted! Return to chat and type "done".');
}
