import React, { useState } from 'react';

const GestionnaireForm = ({ demande, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTypeAchat, setSelectedTypeAchat] = useState('convention');
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [formData, setFormData] = useState({
    fichierExcel: null,
    nomDemandeur: demande.demandeur_name || '',
    referenceDemande: '',
    objet: ''
  });
  
  const [contratFiles, setContratFiles] = useState([]);
  const [factureFiles, setFactureFiles] = useState([]);

  if (!demande) return null;

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
        if (onStatusChange) onStatusChange();
      } else {
        alert('Erreur lors du changement de statut');
      }
    } catch (e) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSubmit = () => {
    if (!note.trim()) {
      setNoteError('Merci de saisir une note explicative.');
      return;
    }
    setNoteError('');
    handleSetStatus('non_confirmée', note);
  };

  const nextStep = () => {
    if (currentStep === 3) {
      // Si on est à l'étape 3 (Type d'Achat), on affiche le formulaire spécifique
      setShowTypeForm(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (showTypeForm) {
      setShowTypeForm(false);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
            1
          </div>
          <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Fichier Excel des Articles (Question non anonyme) <span style={{ color: 'red' }}>*</span></h3>
        </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
          Fichier Template des Articles :
        </label>
        <a 
          href="/Articles.xlsx" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '14px' }}
        >
          Articles 1
        </a>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
          Importer votre fichier Excel : <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          type="file" 
          accept=".xlsx,.xls"
          onChange={(e) => {
            setFormData({...formData, fichierExcel: e.target.files[0]});
          }}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: 8, 
            border: '1px solid #ddd', 
            fontSize: '14px',
            backgroundColor: '#f8fafc'
          }}
        />
        {formData.fichierExcel && (
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#22c55e' }}>
            Fichier sélectionné: {formData.fichierExcel.name}
          </div>
        )}
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
        <div>Nombre maximal de fichiers: 1</div>
        <div>Taille maximale autorisée pour un fichier: 100MB</div>
        <div>Types de fichier autorisés: Excel</div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
            2
          </div>
          <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Informations de la Demande <span style={{ color: 'red' }}>*</span></h3>
        </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
          Nom Demandeur <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          value={formData.nomDemandeur || demande.demandeur_name || 'hhh'} 
          onChange={(e) => setFormData({...formData, nomDemandeur: e.target.value})}
          style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
          Référence Demande <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          value={formData.referenceDemande}
          onChange={(e) => setFormData({...formData, referenceDemande: e.target.value})}
          placeholder="Entrez la référence de la demande"
          style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
          Objet <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          value={formData.objet}
          onChange={(e) => setFormData({...formData, objet: e.target.value})}
          placeholder="Entrez l'objet de la demande"
          style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
            3
          </div>
          <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Type d'Achat <span style={{ color: 'red' }}>*</span></h3>
        </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="convention" 
              checked={selectedTypeAchat === 'convention'}
              style={{ margin: 0 }}
              onChange={(e) => {
                setSelectedTypeAchat(e.target.value);
              }}
            />
            Convention (Avoir un contrat/convention avec le fournisseur)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="appel_offre" 
              checked={selectedTypeAchat === 'appel_offre'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Appel d'Offre (Consultation &gt;50 000 DH)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="achat_en_ligne" 
              checked={selectedTypeAchat === 'achat_en_ligne'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Achat en ligne (Achat par site internet)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="achat_direct" 
              checked={selectedTypeAchat === 'achat_direct'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Achat Direct (Consultation &lt; 50 000 DH)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="accord_cadre" 
              checked={selectedTypeAchat === 'accord_cadre'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Accord Cadre (Avoir un contrat/convention avec le fournisseur)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="gre_a_gre" 
              checked={selectedTypeAchat === 'gre_a_gre'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Gré à Gré (Choix d'un seul fournisseur)
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <input 
              type="radio" 
              name="typeAchat" 
              value="contrat_cadre" 
              checked={selectedTypeAchat === 'contrat_cadre'}
              style={{ margin: 0 }}
              onChange={(e) => setSelectedTypeAchat(e.target.value)}
            />
            Contrat Cadre (Avoir un contrat sur SAP)
          </label>
        </div>
      </div>
    </div>
  );

  const renderTypeSpecificForm = () => {
    switch (selectedTypeAchat) {
      case 'contrat_cadre':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Contrat Cadre
            </h1>

            {/* Section 6: Numéro du contrat sur SAP */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Numéro du contrat sur SAP
                </h3>
              </div>
              
              <input 
                type="text" 
                placeholder="Entrez votre réponse"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb'
                }}
                onChange={(e) => {
                }}
              />
            </div>

            {/* Section 7: Numéro Fournisseur */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Numéro Fournisseur
                </h3>
              </div>
              
              <input 
                type="number" 
                placeholder="Entrez votre réponse"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb'
                }}
                onChange={(e) => {
                }}
              />
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                La valeur doit être un nombre
              </div>
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'gre_a_gre':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Gré à Gré
            </h1>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                color: '#374151', 
                margin: '0 0 16px 0', 
                fontSize: '16px', 
                fontWeight: '500' 
              }}>
                Modèle Standard de Note Gré à Gré:
              </p>
              <a 
                href="https://um6p.sharepoint.com/sites/RPAPARTAGE/Documents%20partages/Note%20de%20gr%C3%A9%20%C3%A0%20gr%C3%A9.docx"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                https://um6p.sharepoint.com/sites/RPAPARTAGE/Documents%20partages/Note%20de%20gr%C3%A9%20%C3%A0%20gr%C3%A9.docx
              </a>
            </div>

            {/* Section 6: Devis */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Devis
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="devis-gre-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Devis:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('devis-gre-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 7: Note signée par le responsable de l'entité */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Note signée par le responsable de l'entité
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="note-signee-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Note signée:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('note-signee-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 8: Lettre d'Exclusivité */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  8. Lettre d'Exclusivité
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="lettre-exclusivite-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Lettre d\'Exclusivité:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('lettre-exclusivite-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'achat_direct':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Achat Direct
            </h1>

            {/* Section 6: Descriptif Technique */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Descriptif Technique
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="descriptif-direct-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Descriptif Technique:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('descriptif-direct-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 7: Trois Devis Contradictoires */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Trois Devis Contradictoires
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="devis-direct-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Trois Devis Contradictoires:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('devis-direct-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 3</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 8: Proposition des Fournisseurs */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  8. Proposition des Fournisseurs
                </h3>
              </div>
              
              <input 
                type="text" 
                placeholder="Entrez votre réponse"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#fff'
                }}
                onChange={(e) => {
                }}
              />
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'achat_en_ligne':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Achat en Ligne
            </h1>

            {/* Section 6: Lien de l'achat */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Lien de l'achat
                </h3>
              </div>
              
              <input 
                type="text" 
                placeholder="Entrez votre réponse"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#fff'
                }}
                onChange={(e) => {
                }}
              />
            </div>

            {/* Section 7: Capture d'achat */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Capture d'achat
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="capture-achat-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Capture d\'achat:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('capture-achat-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'appel_offre':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Appel d'Offre
            </h1>

            {/* Section 6: Descriptif Technique Appel d'Offre */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Descriptif Technique Appel d'Offre
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="descriptif-appel-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Descriptif Technique Appel d\'Offre:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('descriptif-appel-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 7: Synthèse de critères */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Synthèse de critères
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="synthese-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Synthèse de critères:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('synthese-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 8: Proposition fournisseur */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  8. Proposition fournisseur
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="proposition-fournisseur-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Proposition fournisseur:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('proposition-fournisseur-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'accord_cadre':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Accord Cadre
            </h1>

            {/* Section 6: Descriptif Technique */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Descriptif Technique
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="descriptif-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Descriptif Technique:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('descriptif-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 7: Trois Devis Contradictoires */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Trois Devis Contradictoires
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="devis-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Devis:', e.target.files);
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('devis-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 3</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 8: Proposition des Fournisseurs */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  8. Proposition des Fournisseurs
                </h3>
              </div>
              
              <input 
                type="text"
                placeholder="Entrez votre réponse"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#f3f4f6'
                }}
              />
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'convention':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#111827', 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              Convention
            </h1>

            {/* Section 6: Convention */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  6. Convention
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="contrat-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Contrat:', e.target.files);
                  setContratFiles(Array.from(e.target.files));
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('contrat-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              {contratFiles.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#22c55e' }}>
                   {contratFiles.length} fichier(s) sélectionné(s)
                </div>
              )}
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Section 7: Facture */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ 
                  color: '#f97316', 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  7. Facture
                </h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
                multiple
                style={{ display: 'none' }}
                id="facture-file"
                onChange={(e) => {
                  // Fichiers sélectionnés pour Facture:', e.target.files);
                  setFactureFiles(Array.from(e.target.files));
                }}
              />
              <button 
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
                onClick={() => document.getElementById('facture-file').click()}
              >
                <span style={{ fontSize: '16px' }}>↑</span>
                Charger le fichier
              </button>
              
              {factureFiles.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#22c55e' }}>
                   {factureFiles.length} fichier(s) sélectionné(s)
                </div>
              )}
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <div>Nombre maximal de fichiers : 10</div>
                <div>Taille maximale autorisée pour un fichier : 100MB</div>
                <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
              </div>
            </div>

            {/* Boutons de navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  background: '#fff', 
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => setShowTypeForm(false)}
              >
                Précédent
              </button>
              
              <button style={{ 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '8px', 
                background: '#6b7280', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Envoyer
              </button>
            </div>
          </div>
        );

      case 'accord_cadre':
        return (
          <div>
            <div style={{ 
              background: '#374151', 
              padding: '16px 24px', 
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#dc2626',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                UM6P
              </div>
              <h2 style={{ 
                color: '#f97316', 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '600' 
              }}>
                Formulaire Creation de Demande d'Achat - Demandeur
              </h2>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#6b7280', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '12px' }}>🔊</span>
                </div>
                <div style={{ width: '24px', height: '24px', background: '#6b7280', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '12px' }}>📄</span>
                </div>
                <div style={{ width: '24px', height: '24px', background: '#6b7280', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '12px' }}>⋯</span>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '24px',
              borderRadius: '0 0 8px 8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h1 style={{ 
                color: '#111827', 
                margin: '0 0 24px 0', 
                fontSize: '24px', 
                fontWeight: '700' 
              }}>
                Accord Cadre
              </h1>

              {/* Section 6: Contrat */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h3 style={{ 
                    color: '#f97316', 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: '600' 
                  }}>
                    6. Contrat
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#6b7280', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '8px' }}>i</span>
                    </div>
                    <div style={{ width: '16px', height: '16px', background: '#6b7280', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '8px' }}>📄</span>
                    </div>
                  </div>
                </div>
                
                <button style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '16px' }}>↑</span>
                  Charger le fichier
                </button>
                
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  <div>Nombre maximal de fichiers : 10</div>
                  <div>Taille maximale autorisée pour un fichier : 100MB</div>
                  <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
                </div>
              </div>

              {/* Section 7: Facture Accord Cadre */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h3 style={{ 
                    color: '#f97316', 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: '600' 
                  }}>
                    7. Facture Accord Cadre
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>(Question non anonyme)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#6b7280', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '8px' }}>i</span>
                    </div>
                    <div style={{ width: '16px', height: '16px', background: '#6b7280', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '8px' }}>📄</span>
                    </div>
                  </div>
                </div>
                
                <button style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '16px' }}>↑</span>
                  Charger le fichier
                </button>
                
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  <div>Nombre maximal de fichiers : 10</div>
                  <div>Taille maximale autorisée pour un fichier : 100MB</div>
                  <div>Types de fichier autorisés : Word, Excel, PPT, PDF, Image, Vidéo, Audio</div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Précédent
                </button>
                <button style={{
                  background: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'white'
                }}>
                  Envoyer
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              background: '#dbeafe', 
              padding: '16px 24px',
              borderRadius: '8px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#1e40af' }}>Microsoft 365</span>
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                <p>Ce contenu est créé par le propriétaire du formulaire. Les données que vous soumettez sont envoyées au propriétaire du formulaire. Microsoft n'est pas responsable des pratiques de confidentialité ou de sécurité de ses clients, y compris celles de ce propriétaire de formulaire. Ne donnez jamais votre mot de passe.</p>
                <p style={{ marginTop: '8px' }}>
                  Microsoft Forms | Enquêtes, questionnaires et sondages basés sur l'intelligence artificielle 
                  <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}> Créer mon propre formulaire</a>
                </p>
                <p style={{ marginTop: '4px' }}>
                  <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Confidentialité et cookies</a> | 
                  <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}> Conditions d'utilisation</a>
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#374151', marginBottom: '16px' }}>
              Formulaire pour {selectedTypeAchat}
            </h3>
            <p style={{ color: '#6b7280' }}>
              Le formulaire spécifique pour ce type d'achat sera développé prochainement.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#6b7280', color: '#fff', padding: '8px 12px', borderRadius: 6, fontWeight: 600 }}>
              UM6P
            </div>
            <h2 style={titleStyle}>Formulaire Gestion Demande d'Achat - Gestionnaire</h2>
          </div>
          <button style={closeBtnStyle} onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ color: '#666', marginBottom: 8 }}>
            Bonjour, {localStorage.getItem('name') || 'Hajar'}. Lorsque vous soumettez ce formulaire, le propriétaire verra votre nom et votre adresse e-mail.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'red', fontSize: '12px' }}>*</span>
            <span style={{ fontSize: '12px', color: '#666' }}>Obligatoire</span>
          </div>
        </div>

        {/* Formulaire complet sur une seule page */}
        <div style={{ marginBottom: 32 }}>
          {showTypeForm ? (
            renderTypeSpecificForm()
          ) : (
            <div>
              {/* Étape 1: Fichier Excel */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    1
                  </div>
                  <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Fichier Excel des Articles (Question non anonyme) <span style={{ color: 'red' }}>*</span></h3>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
                    Fichier Template des Articles :
                  </label>
                  <a 
                    href="/Articles.xlsx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '14px' }}
                  >
                    Articles 1
                  </a>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
                    Importer votre fichier Excel : <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    type="file" 
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      setFormData({...formData, fichierExcel: e.target.files[0]});
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: 8, 
                      border: '1px solid #ddd', 
                      fontSize: '14px',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                  {formData.fichierExcel && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#22c55e' }}>
                       Fichier sélectionné: {formData.fichierExcel.name}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                  <div>Nombre maximal de fichiers: 1</div>
                  <div>Taille maximale autorisée pour un fichier: 100MB</div>
                  <div>Types de fichier autorisés: Excel</div>
                </div>
              </div>

              {/* Étape 2: Informations de la Demande */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    2
                  </div>
                  <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Informations de la Demande <span style={{ color: 'red' }}>*</span></h3>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
                    Nom Demandeur <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    value={formData.nomDemandeur || demande.demandeur_name || 'hhh'} 
                    onChange={(e) => setFormData({...formData, nomDemandeur: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
                    Référence Demande <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    value={formData.referenceDemande}
                    onChange={(e) => setFormData({...formData, referenceDemande: e.target.value})}
                    placeholder="Entrez la référence de la demande"
                    style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '14px' }}>
                    Objet <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    value={formData.objet}
                    onChange={(e) => setFormData({...formData, objet: e.target.value})}
                    placeholder="Entrez l'objet de la demande"
                    style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Étape 3: Type d'Achat */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 20, height: 20, background: '#6b7280', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                    3
                  </div>
                  <h3 style={{ color: '#374151', margin: 0, fontSize: '18px' }}>Type d'Achat <span style={{ color: 'red' }}>*</span></h3>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="convention" 
                        checked={selectedTypeAchat === 'convention'}
                        style={{ margin: 0 }}
                        onChange={(e) => {
                          setSelectedTypeAchat(e.target.value);
                        }}
                      />
                      Convention (Avoir un contrat/convention avec le fournisseur)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="appel_offre" 
                        checked={selectedTypeAchat === 'appel_offre'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Appel d'Offre (Consultation &gt;50 000 DH)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="achat_en_ligne" 
                        checked={selectedTypeAchat === 'achat_en_ligne'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Achat en ligne (Achat par site internet)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="achat_direct" 
                        checked={selectedTypeAchat === 'achat_direct'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Achat Direct (Consultation &lt; 50 000 DH)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="accord_cadre" 
                        checked={selectedTypeAchat === 'accord_cadre'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Accord Cadre (Avoir un contrat/convention avec le fournisseur)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="gre_a_gre" 
                        checked={selectedTypeAchat === 'gre_a_gre'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Gré à Gré (Choix d'un seul fournisseur)
                    </label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                      <input 
                        type="radio" 
                        name="typeAchat" 
                        value="contrat_cadre" 
                        checked={selectedTypeAchat === 'contrat_cadre'}
                        style={{ margin: 0 }}
                        onChange={(e) => setSelectedTypeAchat(e.target.value)}
                      />
                      Contrat Cadre (Avoir un contrat sur SAP)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

                {/* Navigation simplifiée */}
        {!showTypeForm && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button
              style={{ 
                background: '#6b7280', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 32px', 
                fontWeight: 600, 
                fontSize: '16px',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Validation des champs obligatoires
                if (!formData.fichierExcel) {
                  alert('Veuillez importer un fichier Excel.');
                  return;
                }
                if (!formData.nomDemandeur && !demande.demandeur_name) {
                  alert('Veuillez saisir le nom du demandeur.');
                  return;
                }
                if (!formData.referenceDemande) {
                  alert('Veuillez saisir la référence de la demande.');
                  return;
                }
                if (!formData.objet) {
                  alert('Veuillez saisir l\'objet de la demande.');
                  return;
                }
                if (!selectedTypeAchat) {
                  alert('Veuillez sélectionner un type d\'achat.');
                  return;
                }
                
                setShowTypeForm(true);
              }}
            >
              Valider et Continuer
            </button>
          </div>
        )}

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
  paddingTop: '25vh',
  zIndex: 1000,
  overflowY: 'auto'
};

const modalStyle = { 
  background: '#fff', 
  borderRadius: 12, 
  padding: '32px', 
  maxWidth: '800px', 
  width: '90%', 
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  marginBottom: '5vh'
};

const headerStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '24px', 
  paddingBottom: '16px', 
  borderBottom: '1px solid #e5e7eb' 
};

const titleStyle = { 
  fontSize: '20px', 
  fontWeight: 700, 
  color: '#f97316', 
  margin: 0 
};

const closeBtnStyle = { 
  background: 'none', 
  border: 'none', 
  fontSize: '24px', 
  cursor: 'pointer', 
  color: '#888', 
  padding: '4px', 
  borderRadius: '4px' 
};

export default GestionnaireForm; 