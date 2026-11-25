// MOBELMONTAGE NURNBERG - GOOGLE SHEETS SCRIPT
// Spalten: Datum, Status, Event-Typ, Name, E-Mail, PLZ, Service, Prioritaet, Quelle, GCLID, Bewertung

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    lock.waitLock(10000);
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    var sheet = sheets.find(function(tab) { return tab.getSheetId() === 0; }) || sheets[0];
    
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }
    
    var eventType = data.eventType || 'form';
    var reference = eventType === 'form' && /^MN-[0-9A-F]{12}$/.test(data.reference) ? data.reference : '';
    var rowCount = sheet.getLastRow();
    var values = [
      Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy HH:mm'), 'Neu', eventType,
      data.name || '-', data.email || '-', data.plz || '-', data.service || '-',
      data.priority || 'Normal', data.quelle || 'Direct', data.gclid || '-', '-'
    ];
    if (reference) {
      var column = referenceColumn(sheet);
      if (rowCount > 1 && sheet.getRange(2, column, rowCount - 1, 1)
          .createTextFinder(reference).matchEntireCell(true).findNext()) {
        return jsonReply({success: true, reference: reference, duplicate: true});
      }
      while (values.length < column - 1) values.push('');
      values.push(reference);
    }
    var newRow = rowCount + 1;
    if (newRow > sheet.getMaxRows()) sheet.insertRowAfter(rowCount);
    sheet.getRange(newRow, 1, 1, values.length).setValues([values.map(function(value) {
      return typeof value === 'string' && value.charAt(0) === '=' ? "'" + value : value;
    })]);
    formatRow(sheet, newRow, eventType, data.priority || 'Normal');
    addDropdowns(sheet, newRow);
    SpreadsheetApp.flush();
    return jsonReply({success: true, reference: reference});
  } catch (error) {
    return jsonReply({error: error.toString()});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function referenceColumn(sheet) {
  var last = Math.max(11, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, last).getDisplayValues()[0];
  var index = headers.slice(11).indexOf('Anfragenummer');
  if (index !== -1) return 12 + index;
  var column = last + 1;
  if (column > sheet.getMaxColumns()) sheet.insertColumnAfter(last);
  sheet.getRange(1, column).setValue('Anfragenummer');
  return column;
}

function setupHeaders(sheet) {
  var headers = ['Datum', 'Status', 'Event-Typ', 'Name', 'E-Mail', 'PLZ', 'Service', 'Prioritaet', 'Quelle', 'GCLID', 'Bewertung'];
  
  for (var i = 0; i < headers.length; i++) {
    sheet.getRange(1, i + 1).setValue(headers[i]);
  }
  
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#f97316');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 70);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 90);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 120);
  sheet.setColumnWidth(11, 120);
  
  sheet.setFrozenRows(1);
}

function formatRow(sheet, row, eventType, priority) {
  var rowRange = sheet.getRange(row, 1, 1, 11);
  
  var bgColor = '#ffffff';
  if (eventType === 'phone_call') {
    bgColor = '#fef3c7';
  } else if (eventType === 'whatsapp') {
    bgColor = '#dcfce7';
  } else if (eventType === 'form') {
    bgColor = '#dbeafe';
  }
  rowRange.setBackground(bgColor);
  
  var priorityCell = sheet.getRange(row, 8);
  if (priority === 'DRINGEND') {
    priorityCell.setBackground('#dc2626');
    priorityCell.setFontColor('#ffffff');
    priorityCell.setFontWeight('bold');
  } else if (priority === 'Normal') {
    priorityCell.setBackground('#f97316');
    priorityCell.setFontColor('#ffffff');
  } else {
    priorityCell.setBackground('#22c55e');
    priorityCell.setFontColor('#ffffff');
  }
  
  var statusCell = sheet.getRange(row, 2);
  statusCell.setBackground('#3b82f6');
  statusCell.setFontColor('#ffffff');
  statusCell.setFontWeight('bold');
  
  var eventCell = sheet.getRange(row, 3);
  if (eventType === 'phone_call') {
    eventCell.setBackground('#eab308');
    eventCell.setFontColor('#000000');
  } else if (eventType === 'whatsapp') {
    eventCell.setBackground('#22c55e');
    eventCell.setFontColor('#ffffff');
  } else {
    eventCell.setBackground('#3b82f6');
    eventCell.setFontColor('#ffffff');
  }
}

function addDropdowns(sheet, row) {
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Neu', 'In Bearbeitung', 'Kontaktiert', 'Angebot gesendet', 'Erledigt', 'Storniert'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 2).setDataValidation(statusRule);
  
  var bewertungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['-', '1 Stern', '2 Sterne', '3 Sterne', '4 Sterne', '5 Sterne'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 11).setDataValidation(bewertungRule);
}

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();
  
  if (col === 2 && row > 1) {
    var value = range.getValue();
    if (value === 'Neu') {
      range.setBackground('#3b82f6').setFontColor('#ffffff');
    } else if (value === 'In Bearbeitung') {
      range.setBackground('#eab308').setFontColor('#000000');
    } else if (value === 'Kontaktiert') {
      range.setBackground('#8b5cf6').setFontColor('#ffffff');
    } else if (value === 'Angebot gesendet') {
      range.setBackground('#f97316').setFontColor('#ffffff');
    } else if (value === 'Erledigt') {
      range.setBackground('#22c55e').setFontColor('#ffffff');
    } else if (value === 'Storniert') {
      range.setBackground('#6b7280').setFontColor('#ffffff');
    }
  }
  
  if (col === 11 && row > 1) {
    var value = range.getValue();
    if (value === '5 Sterne') {
      range.setBackground('#22c55e').setFontColor('#000000');
    } else if (value === '4 Sterne') {
      range.setBackground('#84cc16').setFontColor('#000000');
    } else if (value === '3 Sterne') {
      range.setBackground('#eab308').setFontColor('#000000');
    } else if (value === '2 Sterne') {
      range.setBackground('#f97316').setFontColor('#000000');
    } else if (value === '1 Stern') {
      range.setBackground('#dc2626').setFontColor('#ffffff');
    } else {
      range.setBackground('#ffffff').setFontColor('#000000');
    }
  }
}

function getWebhookUrl() {
  return ScriptApp.getService().getUrl();
}
