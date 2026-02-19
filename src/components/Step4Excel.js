import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Step4Excel({ formData, setFormData, nextStep, prevStep }) {
  const [excelError, setExcelError] = useState('');
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Validation des colonnes
      const requiredColumns = ['Article', 'Quantité', 'Prix', 'Unité'];
      const columnsInFile = Object.keys(jsonData[0] || {});
      const missing = requiredColumns.filter(col => !columnsInFile.includes(col));

      if (missing.length > 0) {
        setExcelError(`Colonnes manquantes : ${missing.join(', ')}`);
        setExcelData([]);
        return;
      }

      setExcelData(jsonData);
      setFormData({ ...formData, excelData: jsonData });
      setExcelError('');
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="step step4-excel">
      <h2>Étape 4 : Importer les lignes d'achat (Excel)</h2>

      <a
        href="/template.xlsx"
        download
        style={{ display: 'inline-block', marginBottom: '16px', color: '#007bff' }}
      >
        📥 Télécharger le modèle Excel à remplir
      </a>

      <input type="file" accept=".xlsx" onChange={handleFileUpload} />

      {excelError && <p style={{ color: 'red' }}>{excelError}</p>}

      {excelData.length > 0 && (
        <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité</th>
              <th>Prix</th>
              <th>Unité</th>
            </tr>
          </thead>
          <tbody>
            {excelData.map((row, index) => (
              <tr key={index}>
                <td>{row.Article}</td>
                <td>{row.Quantité}</td>
                <td>{row.Prix}</td>
                <td>{row.Unité}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '24px' }}>
        <button onClick={prevStep}>⬅️ Précédent</button>
        <button onClick={nextStep} disabled={excelData.length === 0}>
          Suivant ➡️
        </button>
      </div>
    </div>
  );
}
