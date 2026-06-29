function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.email || '',
    p.phone || '',
    'Workshop - $9',
    p.status || 'Form Fill',
    'Meta Ad'
  ]);
  return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
}
