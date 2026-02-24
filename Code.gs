// Configuration
const CONFIG = {
  ANNEE_BASE_CP: 25,
  FORFAIT_JOURS: 218
};

// Webapp
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Gestion Congés')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Initialisation
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName('Parametres')) {
    const p = ss.insertSheet('Parametres');
    p.getRange("A1:D1").setValues([["Type", "Acquis", "Reste", "Année"]]);
    p.getRange("A2:D3").setValues([["CP", 25, 25, new Date().getFullYear()], ["RTT", 9, 9, new Date().getFullYear()]]);
  } else {
    const p = ss.getSheetByName('Parametres');
    if (p.getLastColumn() < 4) { p.getRange(1, 4).setValue("Année"); p.getRange(2, 4, p.getLastRow()-1, 1).setValue(new Date().getFullYear()); }
  }
  if (!ss.getSheetByName('BDD')) { const b = ss.insertSheet('BDD'); b.getRange("A1:E1").setValues([["ID", "Début", "Fin", "Type", "NbJours"]]); }
  if (!ss.getSheetByName('Feries')) { ss.insertSheet('Feries'); genererJoursFeries(); }
}

// RÉCUPÉRATION DONNÉES (Optimisée)
function getDonnees() {
  try {
    initSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const anneeActuelle = new Date().getFullYear();
    const pSheet = ss.getSheetByName('Parametres');
    const bSheet = ss.getSheetByName('BDD');
    const fSheet = ss.getSheetByName('Feries');
    
    // Lecture groupée
    const pLastRow = pSheet.getLastRow();
    const bLastRow = bSheet.getLastRow();
    const fLastRow = fSheet.getLastRow();
    
    const paramsVals = pLastRow > 1 ? pSheet.getRange(2, 1, pLastRow-1, 4).getValues() : [];
    const bddVals = bLastRow > 1 ? bSheet.getRange(2, 1, bLastRow-1, 5).getValues() : [];
    const feriesVals = fLastRow > 1 ? fSheet.getRange(2, 1, fLastRow-1, 2).getValues() : [];

    // Gestion des soldes
    let cpAcquis = CONFIG.ANNEE_BASE_CP, rttAcquis = 9, savedYear = anneeActuelle, cpRowIdx = -1, rttRowIdx = -1;
    for(let i=0; i<paramsVals.length; i++) {
      const type = String(paramsVals[i][0]).toLowerCase().trim();
      if(type === 'cp') { cpRowIdx = i; cpAcquis = parseFloat(paramsVals[i][1]) || 25; savedYear = parseInt(paramsVals[i][3]) || anneeActuelle; }
      if(type === 'rtt') { rttRowIdx = i; rttAcquis = parseFloat(paramsVals[i][1]) || 9; }
    }

    // Mise à jour année
    if (savedYear < anneeActuelle) {
      const cpPrisAnneePrec = calculerTotalPris(bddVals, savedYear, 'cp');
      const report = Math.max(0, cpAcquis - cpPrisAnneePrec);
      const nouveauxDroits = CONFIG.ANNEE_BASE_CP + report;
      cpAcquis = nouveauxDroits;
      if(cpRowIdx >= 0) { paramsVals[cpRowIdx][1] = nouveauxDroits; paramsVals[cpRowIdx][3] = anneeActuelle; pSheet.getRange(cpRowIdx + 2, 2, 1, 3).setValues([[nouveauxDroits, nouveauxDroits, anneeActuelle]]); }
      rttAcquis = calculerRTT(anneeActuelle, feriesVals); 
      if(rttRowIdx >= 0) { paramsVals[rttRowIdx][1] = rttAcquis; paramsVals[rttRowIdx][3] = anneeActuelle; pSheet.getRange(rttRowIdx + 2, 2, 1, 3).setValues([[rttAcquis, rttAcquis, anneeActuelle]]); }
      SpreadsheetApp.flush();
    }

    // Calcul totaux
    const cpPris = calculerTotalPris(bddVals, anneeActuelle, 'cp');
    const rttPris = calculerTotalPris(bddVals, anneeActuelle, 'rtt');
    const cpReste = Math.max(0, cpAcquis - cpPris);
    const rttReste = Math.max(0, rttAcquis - rttPris);
    
    if(cpRowIdx >= 0) pSheet.getRange(cpRowIdx + 2, 3).setValue(cpReste);
    if(rttRowIdx >= 0) pSheet.getRange(rttRowIdx + 2, 3).setValue(rttReste);

    // Construction réponse
    const projection = { annee: anneeActuelle + 1, cp: { acquis: CONFIG.ANNEE_BASE_CP + cpReste, reste: CONFIG.ANNEE_BASE_CP + cpReste }, rtt: { acquis: calculerRTT(anneeActuelle + 1), reste: calculerRTT(anneeActuelle + 1) } };
    const soldesFinaux = [{ type: "CP", acquis: cpAcquis, reste: cpReste }, { type: "RTT", acquis: rttAcquis, reste: rttReste }];
    const conges = bddVals.map(r => ({ id: r[0], debut: formaterDate(r[1]), fin: formaterDate(r[2]), type: r[3], nbJours: r[4] }));
    const feries = feriesVals.map(r => ({ date: formaterDate(r[0]), nom: r[1] }));

    return { soldes: soldesFinaux, conges: conges, feries: feries, annee: anneeActuelle, cp: { acquis: cpAcquis, reste: cpReste }, rtt: { acquis: rttAcquis, reste: rttReste }, projection: projection };
  } catch (e) { return { error: true, message: "ERREUR SCRIPT: " + e.toString() }; }
}

function updateSoldesManuel(cpAcquis, rttAcquis) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet(); const sheet = ss.getSheetByName('Parametres'); if(!sheet) return "Erreur parametres";
    const data = sheet.getDataRange().getValues();
    for(let i=1; i<data.length; i++) {
      const type = String(data[i][0]).toLowerCase();
      if(type === 'cp') sheet.getRange(i+1, 2).setValue(parseFloat(cpAcquis) || 25);
      if(type === 'rtt') sheet.getRange(i+1, 2).setValue(parseFloat(rttAcquis) || 9);
    }
    SpreadsheetApp.flush();
    return "Succès";
  } catch(e) { return "Erreur: " + e.toString(); }
}

// UTILITAIRES
function calculerTotalPris(data, annee, typeFiltre) {
  let total = 0; 
  const isDemi = "0.5 " + typeFiltre;
  data.forEach(r => { 
    const d = new Date(r[1]); 
    const t = String(r[3]).toLowerCase(); 
    if (d.getFullYear() === annee) { 
      if (t === typeFiltre) total += (parseFloat(r[4]) || 0); 
      if (t === isDemi) total += 0.5; 
    } 
  });
  return total;
}

function calculerRTT(annee, existingFeries) {
  let nbFeries = 8; 
  if(existingFeries && existingFeries.length > 0) nbFeries = existingFeries.filter(f => new Date(f[0]).getFullYear() === annee).length;
  const start = new Date(annee, 0, 1); const end = new Date(annee, 11, 31); 
  const totalDays = Math.round((end - start) / (24*60*60*1000)) + 1; 
  const weekends = 104; 
  return Math.max(0, Math.round(totalDays - weekends - CONFIG.ANNEE_BASE_CP - nbFeries - CONFIG.FORFAIT_JOURS));
}

function formaterDate(dateObj) { if (!dateObj) return ""; const d = new Date(dateObj); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; }

function ajouterConge(dateStr, type, endDateStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); const sheet = ss.getSheetByName('BDD'); if (!sheet) return "Erreur BDD";
  const startDate = new Date(dateStr); const endDate = endDateStr ? new Date(endDateStr) : startDate; let nbJours = 0; const isDemi = type.toLowerCase().includes('0.5');
  const fSheet = ss.getSheetByName('Feries'); const fVals = fSheet.getRange("A2:A").getValues(); const fMap = {}; fVals.forEach(f => fMap[formaterDate(f[0])] = true);
  let current = new Date(startDate);
  while (current <= endDate) {
    const jourSemaine = current.getDay();
    if(jourSemaine !== 0 && jourSemaine !== 6) { if(!fMap[formaterDate(current)]) nbJours += isDemi ? 0.5 : 1; }
    current.setDate(current.getDate() + 1);
  }
  sheet.appendRow([new Date().getTime(), dateStr, endDateStr || dateStr, type, nbJours]);
  return "Succès";
}

function supprimerConge(id) {
  if (!id) return "ID manquant";
  const ss = SpreadsheetApp.getActiveSpreadsheet(); const sheet = ss.getSheetByName('BDD'); if (!sheet) return "Erreur BDD";
  const lastRow = sheet.getLastRow(); if (lastRow < 2) return "Aucune donnée";
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  let foundRow = -1;
  for (let i = 0; i < ids.length; i++) { if (String(ids[i]) === String(id)) { foundRow = i + 2; break; } }
  if (foundRow !== -1) { sheet.deleteRow(foundRow); SpreadsheetApp.flush(); return "Succès"; }
  return "Congé non trouvé";
}

// GENERATION FERIES
function genererJoursFeries() {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); let sheet = ss.getSheetByName('Feries');
  if (!sheet) sheet = ss.insertSheet('Feries'); sheet.clear(); sheet.appendRow(["Date", "Nom"]);
  const annees = [new Date().getFullYear(), new Date().getFullYear() + 1]; const allRows = [];
  annees.forEach(annee => {
    const paques = getEasterSunday(annee); const lp = new Date(paques); lp.setDate(paques.getDate() + 1);
    const asc = new Date(paques); asc.setDate(paques.getDate() + 39); const pent = new Date(paques); pent.setDate(paques.getDate() + 50);
    allRows.push([new Date(annee, 0, 1), "Jour de l'an"]); 
    allRows.push([lp, "Lundi de Pâques"]); 
    allRows.push([new Date(annee, 4, 1), "Fête du travail"]);
    allRows.push([new Date(annee, 4, 8), "Victoire 1945"]); 
    allRows.push([asc, "Ascension"]); 
    allRows.push([pent, "Lundi de Pentecôte"]);
    allRows.push([new Date(annee, 6, 14), "Fête nationale"]); 
    allRows.push([new Date(annee, 7, 15), "Assomption"]);
    allRows.push([new Date(annee, 10, 1), "Toussaint"]); 
    allRows.push([new Date(annee, 10, 11), "Armistice 1918"]);
    allRows.push([new Date(annee, 11, 25), "Noël"]);
  });
  if(allRows.length > 0) sheet.getRange(2, 1, allRows.length, 2).setValues(allRows);
}

function getEasterSunday(year) {
  const a = year % 19; const b = Math.floor(year / 100); const c = year % 100; const d = Math.floor(b / 4); const e = b % 4;
  const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451); const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1; return new Date(year, month, day);
}
