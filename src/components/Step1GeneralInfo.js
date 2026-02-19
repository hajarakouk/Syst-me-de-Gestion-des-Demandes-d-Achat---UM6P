import React from 'react';

const Step1GeneralInfo = ({ values, onChange, onNext, errors }) => {
  return (
    <div>
      <h2>Informations Générales</h2>
      {/* Objet de la demande */}
      <label>Objet de la demande *</label>
      <input type="text" name="objet" value={values.objet || ''} onChange={onChange} />
      {errors && errors.objet && <div className="error">{errors.objet}</div>}
      {/* Nom du demandeur */}
      <label>Nom du demandeur *</label>
      <input type="text" name="demandeur" value={values.demandeur || ''} onChange={onChange} />
      {errors && errors.demandeur && <div className="error">{errors.demandeur}</div>}
      {/* Entité */}
      <label>Entité *</label>
      <input type="text" name="entite" value={values.entite || ''} onChange={onChange} />
      {errors && errors.entite && <div className="error">{errors.entite}</div>}
      {/* Urgence */}
      <label>Urgence</label>
      <select name="urgence" value={values.urgence || ''} onChange={onChange}>
        <option value="">Sélectionner</option>
        <option value="Urgent">Urgent</option>
        <option value="Normal">Normal</option>
      </select>
      <br />
      <button onClick={onNext}>Suivant</button>
    </div>
  );
};

export default Step1GeneralInfo; 