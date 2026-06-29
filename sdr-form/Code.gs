/**
 * gigson solutions — SDR application backend
 * Recibe el POST del formulario, guarda el CV en una carpeta de Drive y añade
 * una fila a un Google Sheet. Todo se queda dentro de vuestro Google Workspace.
 *
 * SETUP
 *  1. Crea un Google Sheet (dentro de la unidad de Gigson, p. ej. carpeta de Ventas).
 *     Copia su ID desde la URL
 *     (https://docs.google.com/spreadsheets/d/THIS_PART/edit) en SHEET_ID.
 *  2. Crea una carpeta de Drive para los CVs. Copia su ID desde la URL
 *     (https://drive.google.com/drive/folders/THIS_PART) en CV_FOLDER_ID.
 *  3. Extensiones ▸ Apps Script, pega este archivo, guarda.
 *  4. Implementar ▸ Nueva implementación ▸ tipo "Aplicación web".
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquier usuario
 *     Copia la URL de la app web y pégala en SCRIPT_URL en index.html.
 *  5. Ejecuta setupHeaders() una vez desde el editor para escribir la cabecera
 *     (autoriza el script cuando lo pida).
 */

const SHEET_ID     = "1nKvzZqRZ7Kp6rktfFYfDtCkmgcscMY7TxeOprNlMh7U"; // "SDR_aplicantes"
const CV_FOLDER_ID = "1cVbP56ad8MMWgpsmxUJ-lSCBElsvDJN1";            // carpeta "SDR_aplicantes_CVs"

// Orden de columnas — coincide con los "name" de los campos del formulario.
const COLUMNS = [
  "Timestamp",
  "Full name",
  "Email",
  "Phone",
  "Country",
  "LinkedIn",
  "CV link",
  "Portfolio",
  "Outbound experience",
  "Outbound experience detail",
  "Sold software/AI",
  "Sold software/AI detail",
  "Outbound years",
  "Biggest outbound challenge",
  "Tools",
  "Tools other",
  "AI interest",
  "Cold calling",
  "Spanish level",
  "English level",
  "Organization system",
  "High volume example",
  "Weekly hours",
  "Time zone",
  "Availability",
  "Comp model fit",
  "Comp model comment",
  "Expected retainer EUR",
  "Can invoice today",
  "Scenario answer",
  "Consent"
];

function setupHeaders() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. Guardar el CV en Drive y construir un enlace.
    let cvLink = "";
    if (data._fileBase64 && data._fileName) {
      const folder = DriveApp.getFolderById(CV_FOLDER_ID);
      const decoded = Utilities.base64Decode(data._fileBase64);
      const safeName = (data["Full name"] || "applicant").replace(/[^\w\s-]/g, "").trim();
      const blob = Utilities.newBlob(decoded, data._fileType, safeName + " — " + data._fileName);
      const file = folder.createFile(blob);
      cvLink = file.getUrl();
    }
    data["CV link"] = cvLink;

    // 2. Marca de tiempo (Madrid).
    data["Timestamp"] = Utilities.formatDate(new Date(), "Europe/Madrid", "yyyy-MM-dd HH:mm:ss");

    // 3. Añadir una fila en el orden fijo de columnas.
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const row = COLUMNS.map(col => data[col] != null ? data[col] : "");
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
