/**
 * MEDIA BUY TRIO — Google Apps Script (paste this in your Sheet)
 * ==============================================================
 * Web app URL currently used by the site:
 * https://script.google.com/macros/s/AKfycbwteeEb5BI-RyMeqeR7QOYi_uZxkggtWIsAGaOzoQXxaf9DSbJw_cBllYSeCKPo9rqI/exec
 *
 * Tabs written to (created automatically if missing):
 *   "quote form"       -> Date time | Name | Email | Brand / Website | Contact Number | Tell us about your goals
 *   "questions answer" -> Date time | Name | Email | Brand / Website | Contact Number | Score | Verdict | question 1..8
 *
 * DEPLOY STEPS
 * 1. Open the Google Sheet -> Extensions -> Apps Script.
 * 2. Delete everything in Code.gs and paste this whole file. Save.
 * 3. Deploy -> New deployment -> type "Web app".
 *      Execute as: Me      |    Who has access: Anyone
 * 4. Deploy, authorise, copy the /exec URL.
 * 5. If that URL differs from the one above, paste it into
 *    script.js (line ~65) and scorecard.js (line ~165).
 * IMPORTANT: after ANY code change you must Deploy -> Manage deployments ->
 * edit -> Version: New version -> Deploy, otherwise the old code keeps running.
 */

var QUOTE_SHEET = 'quote form';
var SCORECARD_SHEET = 'questions answer';

var QUOTE_HEADERS = [
  'Date time', 'Name', 'Email', 'Brand / Website', 'Contact Number', 'Tell us about your goals'
];

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.type === 'scorecard') {
      var answers = data.answers || [];
      var headers = ['Date time', 'Name', 'Email', 'Brand / Website', 'Contact Number', 'Score', 'Verdict'];
      var row = [
        new Date(),
        data.name || '',
        data.email || '',
        data.brand || '',
        data.phone || '',
        data.score || '',
        data.verdict || ''
      ];

      answers.forEach(function (a, i) {
        headers.push('Q' + (i + 1) + ' — ' + a.category);
        row.push((a.answer || '') + ' (' + (a.score || 0) + '/4)');
      });

      var sc = getSheet_(SCORECARD_SHEET, headers);
      if (sc.getLastColumn() < headers.length) {
        sc.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      }
      sc.appendRow(row);

    } else {
      getSheet_(QUOTE_SHEET, QUOTE_HEADERS).appendRow([
        new Date(),
        data.name || '',
        data.email || '',
        data.brand || '',
        data.phone || '',
        data.message || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Simple health check in a browser: opening the /exec URL should print "MBT endpoint live".
function doGet() {
  return ContentService.createTextOutput('MBT endpoint live');
}

// Run once from the editor to confirm permissions + see a test row appear.
function testAppend() {
  getSheet_(QUOTE_SHEET, QUOTE_HEADERS)
    .appendRow([new Date(), 'Test Name', 'test@email.com', 'testbrand.com', '+92 300 1234567', 'Test message']);
}
