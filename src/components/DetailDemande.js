import React, { useState } from 'react';

const DetailDemande = ({ demande, onClose, onOpenGestionnaireForm }) => {
  const [hoveredFile, setHoveredFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');

  if (!demande) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileDownload = (fichier) => {
    if (fichier.filename) {
      const downloadUrl = `http://localhost:5001/uploads/${fichier.filename}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fichier.name || fichier.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour changer le statut
  const handleSetStatus = async (newStatus, noteValue) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/demandes/${demande.id || demande._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus, 
          note_admin: noteValue || ''
        })
      });
      if (res.ok) {
        onClose();
      } else {
        alert('Erreur lors du changement de statut');
      }
    } catch (e) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Validation et envoi de la note
  const handleNoteSubmit = () => {
    if (!note.trim()) {
      setNoteError('Merci de saisir une note explicative.');
      return;
    }
    setNoteError('');
    handleSetStatus('non_confirmée', note);
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Détails de la demande</h2>
          <button style={closeBtnStyle} onClick={onClose}>×</button>
        </div>

        {/* Infos générales */}
        <div>
          {renderRow("Objet", demande.objet)}
          {renderRow("Nom", demande.demandeur_name || 'Non renseigné')}
          {renderRow("Email", demande.demandeur || 'Non renseigné')}
          {renderRow("Entité", demande.entite)}
          {renderRow("Urgence", demande.urgence || "Normal")}
          {renderRow("Type d'achat", demande.type_achat)}
          {renderRow("Famille", demande.famille)}
          <div style={detailRowStyle}>
            <span style={labelStyle}>Statut :</span>
            <span style={valueStyle}>{demande.status || demande.statut || 'Reçue'}</span>
          </div>
          {renderRow("Date de création", formatDate(demande.date_creation || demande.date))}

          {/* Affichage de la note explicative si non confirmée */}
         {['non_confirmée', 'non conforme', 'non_confirmee'].includes((demande.status || demande.statut || '').toLowerCase()) && demande.note_admin && (

            <div style={detailRowStyle}>
              <span style={labelStyle}>Note gestionnaire :</span>
              <span style={{ ...valueStyle, color: '#ef4444' }}>{demande.note_admin}</span>
            </div>
          )}
          {/* Description : afficher seulement si non vide */}
          {demande.description && demande.description.trim() !== '' && (
            <div style={detailRowStyle}>
              <span style={labelStyle}>Description :</span>
              <span style={valueStyle}>{demande.description}</span>
            </div>
          )}
          {/* Justification : afficher seulement si non vide */}
          {demande.justification && demande.justification.trim() !== '' && (
            <div style={detailRowStyle}>
              <span style={labelStyle}>Justification :</span>
              <span style={valueStyle}>{demande.justification}</span>
            </div>
          )}

          {/* Fichiers joints */}
          <div style={detailRowStyle}>
            <span style={labelStyle}>Documents joints :</span>
            <div style={{ flex: 1 }}>
              {demande.fichiers && demande.fichiers.length > 0 ? (
                <ul style={fileListStyle}>
                  {demande.fichiers.map((fichier, index) => (
                    <li
                      key={index}
                      style={{ ...fileItemStyle, cursor: 'pointer' }}
                    >
                      <a
                        href={`http://localhost:5001/uploads/${fichier.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', fontSize: '15px' }}
                      >
                        {fichier.name || fichier.filename || `Document ${index + 1}`}
                      </a>
                      {fichier.size && (
                        <span style={fileSizeStyle}>{formatFileSize(fichier.size)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={emptyValueStyle}>Aucun document joint</span>
              )}
            </div>
          </div>

          {/* Lignes Excel */}
          <div style={detailRowStyle}>
            <span style={labelStyle}>Fichier Excel :</span>
            <div style={{ flex: 1 }}>
              {demande.fichiers && demande.fichiers.length > 0 ? (
                demande.fichiers.filter(f => (f.name || f.filename || '').toLowerCase().endsWith('.xlsx')).length > 0 ? (
                  <ul style={fileListStyle}>
                    {demande.fichiers.filter(f => (f.name || f.filename || '').toLowerCase().endsWith('.xlsx')).map((fichier, index) => (
                      <li
                        key={index}
                        style={{ ...fileItemStyle, cursor: 'pointer' }}
                        onClick={() => handleFileDownload(fichier)}
                        title="Cliquer pour télécharger"
                      >
                        <span style={fileNameStyle}>
                          📄 {fichier.name || fichier.filename || `Fichier Excel ${index + 1}`}
                        </span>
                        {fichier.size && (
                          <span style={fileSizeStyle}>{formatFileSize(fichier.size)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={emptyValueStyle}>Aucun fichier Excel joint</span>
                )
              ) : (
                <span style={emptyValueStyle}>Aucun fichier Excel joint</span>
              )}
            </div>
          </div>
        </div>

        {/* Boutons de statut */}
        <div style={{ display: 'flex', gap: 16, marginTop: 32, justifyContent: 'flex-end' }}>
          {/* Afficher les boutons Conforme/Non Conforme seulement si la demande n'est pas encore conforme */}
          {!(demande.status === 'confirmée' || demande.statut === 'confirmée') ? (
            <>
              <button
                style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
                disabled={loading}
                onClick={() => handleSetStatus('confirmée')}
              >
                Conforme
              </button>
              <button
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
                disabled={loading}
                onClick={() => setShowNoteModal(true)}
              >
                Non Conforme
              </button>
            </>
          ) : (
            /* Afficher le bouton "Créer une demande" si la demande est conforme */
            <button
              style={{ background: '#ff6600', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
              onClick={() => {
                if (onOpenGestionnaireForm) {
                  onOpenGestionnaireForm(demande);
                }
              }}
            >
              + Créer une demande
            </button>
          )}
        </div>
        {/* Modale de note explicative */}
        {showNoteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
              <h3 style={{ marginTop: 0 }}>Note explicative</h3>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
                style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 10, fontSize: 15, marginBottom: 8 }}
                placeholder="Merci de préciser ce qui manque ou pose problème..."
                disabled={loading}
              />
              {noteError && <div style={{ color: '#ef4444', marginBottom: 8 }}>{noteError}</div>}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  style={{ background: '#f3f6fa', color: '#222', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                  onClick={() => setShowNoteModal(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
                  onClick={handleNoteSubmit}
                  disabled={loading}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helpers
const renderRow = (label, value) => (
  <div style={detailRowStyle}>
    <span style={labelStyle}>{label} :</span>
    <span style={value ? valueStyle : emptyValueStyle}>{value || 'Non renseigné'}</span>
  </div>
);

// Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '12vh',
  zIndex: 1000,
  overflowY: 'auto'
};

const modalStyle = { 
  background: '#fff', 
  borderRadius: 12, 
  padding: '32px', 
  maxWidth: '700px', 
  width: '90%', 
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  marginBottom: '5vh'
};
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' };
const titleStyle = { fontSize: '24px', fontWeight: 700, color: '#222', margin: 0 };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888', padding: '4px', borderRadius: '4px' };

const detailRowStyle = { display: 'flex', marginBottom: '16px', alignItems: 'flex-start' };
const labelStyle = { fontWeight: 700, color: '#222', minWidth: '140px', marginRight: '16px', fontSize: '15px' };
const valueStyle = { color: '#666', fontSize: '15px', flex: 1 };
const emptyValueStyle = { color: '#999', fontStyle: 'italic' };

const fileListStyle = { listStyle: 'none', padding: 0, margin: 0 };
const fileItemStyle = { padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' };
const fileItemHoverStyle = { background: '#e5e7eb' };
const fileNameStyle = { fontWeight: 600, color: '#2563eb', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' };
const fileSizeStyle = { color: '#888', fontSize: '12px' };

const excelDataStyle = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginTop: '8px' };
const excelTableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '14px' };
const excelThStyle = { background: '#e5e7eb', padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151' };
const excelTdStyle = { padding: '8px 12px', borderBottom: '1px solid #f3f4f6', fontSize: '13px' };

export default DetailDemande;
 