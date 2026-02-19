import React from 'react';

const familles = [
  'Famille DAG', 'Famille IT', 'Famille Laboratoire', 'Famille Médicament',
  'Famille Communication et Audiovisuelle', 'Famille Sport', 'Famille Livre', 'Famille IT Rabat', 'Autre'
];

const Step2FamilleReferent = ({ values, onChange, errors }) => (
  <div>
    <h2>Famille d’Achat et Référent</h2>
    <label>Famille d’Achat *</label>
    <select name="famille" value={values.famille || ''} onChange={onChange}>
      <option value="">Sélectionner</option>
      {familles.map(f => <option key={f} value={f}>{f}</option>)}
    </select>
    {errors && errors.famille && <div className="error">{errors.famille}</div>}
  </div>
);

export default Step2FamilleReferent;
