/**
 * Google Apps Script — Protocolo H: Log de respuestas
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var row = [
      data.timestamp || new Date().toISOString(),
      data.nombre || '',
      data.correo || '',
      data.bp || '',
      data.perfil || '',
      data.nivel || '',
      data.escenario || '',
      data.respuesta || '',
      data.scoreAnticipacion || 0,
      data.scoreAutenticidad || 0,
      data.scoreSorpresa || 0,
      data.promedio || 0,
      data.commentAnticipacion || '',
      data.commentAutenticidad || '',
      data.commentSorpresa || '',
      data.mejora || '',
      data.xpGanado || 0,
      data.streak || 0
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Protocolo H Log endpoint activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
