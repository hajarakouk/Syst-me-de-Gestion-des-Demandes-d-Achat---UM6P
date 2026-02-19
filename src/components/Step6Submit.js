import React from 'react';

const Step6Submit = ({ daNumber, onRestart }) => {
  return (
    <div>
      <h2> Votre demande a bien été envoyée</h2>
      <p>N° DA : {daNumber}</p>
      <p> Vous recevrez un email de confirmation dans quelques minutes.</p>
      <button onClick={onRestart}>Nouvelle demande</button>
    </div>
  );
};

export default Step6Submit; 