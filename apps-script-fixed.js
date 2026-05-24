// ============================================================
// GOOGLE APPS SCRIPT — Fixed: no duplicates, no emoji in subject
// ============================================================

const CONFIG = {
  SHEET_NAME:      'Leads',
  SHEET_ID:        '18c0VazYcBZtgdFDzJK6baFb4ZQieb0_mhfWzzkIcKRA',
  SENDER_NAME:     'Palash — AI App Workshop',
  WORKSHOP_DATE:   'Will be announced on WhatsApp',
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, phone, paymentId, amount } = data;
    saveLead(name, email, phone, paymentId, amount);
    sendEmail(name, email, paymentId);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const p = e.parameter;
    if (p && p.name && p.email) {
      const isPaid = p.paymentId && p.paymentId !== 'LEAD' && p.paymentId !== 'PAYMENT_INITIATED';
      saveLead(p.name, p.email, p.phone || '', p.paymentId || 'LEAD', null);
      if (isPaid) {
        sendEmail(p.name, p.email, p.paymentId);
      }
    }
  } catch(err) {
    Logger.log('doGet error: ' + err.message);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'OK' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveLead(name, email, phone, paymentId, amount) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['Date & Time','Name','Email','WhatsApp','Payment ID','Amount','Status','Notes']);
    const header = sheet.getRange(1, 1, 1, 8);
    header.setBackground('#0d1b6e');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    header.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180); sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 220); sheet.setColumnWidth(4, 140);
    sheet.setColumnWidth(5, 220); sheet.setColumnWidth(6, 100);
    sheet.setColumnWidth(7, 100); sheet.setColumnWidth(8, 200);
  }

  const isPaid = paymentId && paymentId !== 'LEAD' && paymentId !== 'PAYMENT_INITIATED';
  const status = isPaid ? 'Paid' : 'Initiated';
  const amountVal = amount ? '₹' + (amount / 100) : '₹249';

  // Check if phone or email already exists — avoid duplicates
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
    for (let i = 0; i < data.length; i++) {
      const rowEmail = data[i][2];
      const rowPhone = data[i][3];
      const rowStatus = data[i][6];

      // Match by email or phone
      if (rowEmail === email || (phone && rowPhone === phone)) {
        // If existing row is Initiated and new call is Paid — UPDATE the row
        // Handle both old emoji format "⏳ Initiated" and new format "Initiated"
        const isInitiated = rowStatus === 'Initiated' || rowStatus === '⏳ Initiated' || rowStatus.includes('Initiated');
        if (isInitiated && isPaid) {
          const rowNum = i + 2;
          sheet.getRange(rowNum, 5).setValue(paymentId); // Payment ID
          sheet.getRange(rowNum, 7).setValue('Paid');    // Status
          sheet.getRange(rowNum, 1).setValue(new Date()); // Update timestamp
          sheet.getRange(rowNum, 1, 1, 8).setBackground('#d4edda'); // Green for paid
        }
        // Already exists — don't add duplicate row
        return;
      }
    }
  }

  // New lead — add fresh row
  const row = [
    new Date(), name, email, phone,
    paymentId || 'LEAD',
    amountVal,
    status,
    'New lead — contact on WhatsApp'
  ];
  sheet.appendRow(row);
  const newLastRow = sheet.getLastRow();
  const bg = isPaid ? '#d4edda' : '#fffde7'; // Green for paid, yellow for initiated
  sheet.getRange(newLastRow, 1, 1, 8).setBackground(bg);
}

function sendEmail(name, email, paymentId) {
  // No emojis in subject — some Android email clients show ???? instead
  const subject = 'Payment Confirmed — Your Workshop Seat is Secured!';
  const htmlBody = `<!DOCTYPE html>
  <html><head><meta charset="UTF-8"/>
  <style>
    body{margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;}
    .wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);}
    .header{background:linear-gradient(135deg,#0d1b6e,#1a237e);padding:36px 32px;text-align:center;}
    .header h1{color:#fff;font-size:26px;font-weight:900;margin:0 0 6px;}
    .header p{color:rgba(255,255,255,.75);font-size:14px;margin:0;}
    .tick{font-size:56px;margin-bottom:12px;}
    .body{padding:32px;}
    .greeting{font-size:20px;font-weight:800;color:#0d1b6e;margin-bottom:8px;}
    .msg{font-size:15px;color:#555;line-height:1.7;margin-bottom:24px;}
    .badge{background:#fff9c4;border:2px solid #f9d300;border-radius:10px;padding:16px 20px;margin-bottom:24px;text-align:center;}
    .badge .amount{font-size:28px;font-weight:900;color:#0d1b6e;}
    .badge .label{font-size:13px;color:#777;margin-top:4px;}
    .steps{background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:24px;}
    .steps h3{font-size:13px;font-weight:800;color:#0d1b6e;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;}
    .step{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;}
    .step-num{min-width:26px;height:26px;border-radius:50%;background:#0d1b6e;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;}
    .step-text{font-size:14px;color:#333;line-height:1.5;padding-top:3px;}
    .footer{background:#f8f8f8;border-top:1px solid #eee;padding:20px 32px;text-align:center;}
    .footer p{font-size:12px;color:#aaa;margin:0;line-height:1.6;}
  </style></head>
  <body><div class="wrap">
    <div class="header"><div class="tick">&#127881;</div><h1>Payment Confirmed!</h1><p>AI App Building Workshop — Your seat is secured</p></div>
    <div class="body">
      <div class="greeting">Hey ${name}!</div>
      <p class="msg">You're officially in! Your payment has been received and your seat for the <strong>AI App Building Workshop</strong> is confirmed.<br/><br/>You'll build your own professional app in just 30 minutes — no coding, no developer needed.</p>
      <div class="badge"><div class="amount">Rs.249 Paid ✓</div><div class="label">Payment ID: ${paymentId || 'CONFIRMED'}</div></div>
      <div class="steps"><h3>What Happens Next</h3>
        <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Our team will contact you on WhatsApp</strong> within 24 hours with workshop details.</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Check this email inbox</strong> — workshop schedule will be sent here.</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Show up on workshop day</strong> — build your app live in 30 minutes!</div></div>
      </div>
      <p style="font-size:14px;color:#555;">Any questions? WhatsApp us: <strong>9109637004</strong> or reply to this email.</p>
    </div>
    <div class="footer"><p>© AI App Building Workshop by Palash Rajak<br/>
    <span style="color:#e8251a;">100% Money Back Guarantee</span></p></div>
  </div></body></html>`;

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: CONFIG.SENDER_NAME,
    replyTo: Session.getActiveUser().getEmail()
  });
}
