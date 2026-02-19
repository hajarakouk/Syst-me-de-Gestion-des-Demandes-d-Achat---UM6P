import React from 'react';

const Step2Type = ({ values, onChange, onNext, onPrev, errors }) => {
  return (
    <div>
      <h2>Type de Demande d'Achat</h2>
      <label>Type *</label>
      <select name="typeAchat" value={values.typeAchat || ''} onChange={onChange}>
        <option value="">Sélectionner</option>
        <option value="Achat direct">Achat direct</option>
        <option value="Appel d’offres">Appel d’offres</option>
        <option value="Gré à gré">Gré à gré</option>
        <option value="Achat en ligne">Achat en ligne</option>
        <option value="Convention/Accord-cadre">Convention/Accord-cadre</option>
        <option value="Achat de vacation">Achat de vacation</option>
      </select>
      {errors.typeAchat && <div className="error">{errors.typeAchat}</div>}
      {/* Bloc explicatif et checklist dynamiques à ajouter ici */}
      <br />
      <button onClick={onPrev}>Précédent</button>
      <button onClick={onNext}>Suivant</button>
    </div>
  );
};

export default Step2Type; 