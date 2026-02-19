import React from 'react';

const familles = [
  'Famille DAG',
  'Famille IT',
  'Famille Laboratoire',
  'Famille Médicament',
  'Famille Communication et Audiovisuelle',
  'Famille Sport',
  'Famille Livre',
  'Famille IT Rabat',
  'Autre'
];

const StepFamilleReferent = ({ values, onChange, onNext, onPrev, errors }) => (
  <div>
    <h2>Famille d’Achat</h2>

    <label>Famille d’Achat *</label>
    <select name="famille" value={values.famille || ''} onChange={onChange}>
      <option value="">Sélectionner</option>
      {familles.map(f => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
    {errors && errors.famille && <div className="error">{errors.famille}</div>}

    <br />
    <button onClick={onPrev}>Précédent</button>
    <button onClick={onNext}>Suivant</button>
  </div>
);

export default StepFamilleReferent;
