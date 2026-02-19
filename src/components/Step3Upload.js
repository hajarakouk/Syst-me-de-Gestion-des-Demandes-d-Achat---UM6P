import React from 'react';

const Step3Upload = ({ files, onFileChange, onNext, onPrev, errors }) => {
  return (
    <div>
      <h2>Upload des fichiers</h2>
      {/* Zone drag & drop à intégrer (ex: react-dropzone) */}
      <input type="file" multiple onChange={onFileChange} />
      {errors.files && <div className="error">{errors.files}</div>}
      {/* Preview fichiers à ajouter ici */}
      <br />
      <button onClick={onPrev}>Précédent</button>
      <button onClick={onNext}>Suivant</button>
    </div>
  );
};

export default Step3Upload; 