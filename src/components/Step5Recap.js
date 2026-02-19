import React from 'react';



export default function Step5Recap({ formData, prevStep, handleSubmit }) {
  return (
    <div className="step step5-recap">
      <h2>Étape 5 : Récapitulatif de la demande</h2>

      <h3>🔹 Informations générales</h3>
      <p><strong>Objet :</strong> {formData.objet}</p>
      <p><strong>Demandeur :</strong> {formData.nom}</p>
      <p><strong>Entité :</strong> {formData.entite}</p>
      <p><strong>Urgence :</strong> {formData.urgence}</p>

      <h3>🔹 Type de demande</h3>
      <p><strong>Type :</strong> {formData.type}</p>

      <h3>🔹 Famille et Référent</h3>
      <p><strong>Famille :</strong> {formData.famille}</p>
      <p><strong>Référent :</strong> {formData.referent}</p>

      <h3>🔹 Fichiers joints</h3>
      {formData.documents && formData.documents.length > 0 ? (
        <ul>
          {formData.documents.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier ajouté.</p>
      )}

      <h3>🔹 Articles demandés (Excel)</h3>
      {formData.excelData && formData.excelData.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité</th>
              <th>Prix</th>
              <th>Unité</th>
            </tr>
          </thead>
          <tbody>
            {formData.excelData.map((row, index) => (
              <tr key={index}>
                <td>{row.Article}</td>
                <td>{row.Quantité}</td>
                <td>{row.Prix}</td>
                <td>{row.Unité}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun fichier Excel importé.</p>
      )}

      <div style={{ marginTop: '24px' }}>
        <button onClick={prevStep}>⬅️ Précédent</button>
        <button onClick={handleSubmit}>✅ Soumettre</button>
      </div>
    </div>
  );
}
