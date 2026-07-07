function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.email || '',
    p.phone || '',
    p.country || '',
    'Workshop - FREE',
    p.status || 'Form Fill',
    'Meta Ad'
  ]);
  return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Only process successful payments
    if (data.type !== 'checkout.session.completed') {
      return ContentService.createTextOutput(JSON.stringify({status: 'ignored'})).setMimeType(ContentService.MimeType.JSON);
    }

    var session = data.data.object;
    var email = session.customer_details && session.customer_details.email ? session.customer_details.email.toLowerCase() : '';

    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({status: 'no_email'})).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();

    var updated = false;
    for (var i = 1; i < rows.length; i++) {
      // Email is in column 3 (index 2)
      if (rows[i][2] && rows[i][2].toString().toLowerCase() === email) {
        // Status is column 6 (index 5)
        sheet.getRange(i + 1, 6).setValue('Paid');
        sheet.getRange(i + 1, 6).setBackground('#c6f6d5'); // green highlight
        updated = true;
        break;
      }
    }

    // If no existing form fill row found, add a new row directly as Paid
    if (!updated) {
      var name = session.customer_details && session.customer_details.name ? session.customer_details.name : '';
      sheet.appendRow([new Date(), name, email, '', 'Workshop - $9', 'Paid', 'Meta Ad']);
    }

    return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
