import React, { useState, useEffect } from 'react';
import DetailDemande from './DetailDemande';
import GestionnaireForm from './GestionnaireForm';

const dossiers = [
  { key: 'dispatcher', label: 'Dispatcher' },
  { key: 'conforme', label: 'Conforme' },
  { key: 'non_conforme', label: 'Non Conforme' },
];

const familles = [
  'Famille DAG',
  'Famille IT',
  'Famille Laboratoire',
  'Famille Médicament',
  'Famille Communication et Audiovisuelle',
  'Famille Sport',
  'Famille Livre',
];

const sidebarStyle = {
  width: 220,
  background: '#f8fafc',
  borderRight: '1px solid #e5e7eb',
  minHeight: '100vh',
  padding: '32px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const dossierBtnStyle = (active) => ({
  background: active ? '#fff' : 'none',
  color: active ? '#2563eb' : '#222',
  border: 'none',
  borderLeft: active ? '4px solid #2563eb' : '4px solid transparent',
  borderRadius: 0,
  padding: '12px 24px',
  fontWeight: 600,
  fontSize: 16,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.2s',
});

const mainContentStyle = {
  flex: 1,
  background: '#fff',
  minHeight: '100vh',
  padding: '32px 40px',
};

const tabStyle = (active) => ({
  padding: '10px 24px',
  border: 'none',
  borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
  background: 'none',
  color: active ? '#2563eb' : '#222',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  outline: 'none',
  marginRight: 8,
  transition: 'color 0.2s',
});

const badgeStyle = (statut) => {
  let color = '#888', bg = '#f3f6fa';
  if (statut === 'reçue') { color = '#eab308'; bg = '#fef9c3'; }
  if (statut === 'confirmée') { color = '#22c55e'; bg = '#dcfce7'; }
  if (statut === 'non_confirmée') { color = '#ef4444'; bg = '#fee2e2'; }
  return {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: 14,
    color,
    background: bg,
  };
};

const cardsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: 18,
  maxWidth: '100%',
};

const getCardColor = (index) => {
  const colors = [
    { background: '#ffffff', borderColor: '#e5e7eb' },
    { background: '#eff6ff', borderColor: '#60a5fa' },
    { background: '#ffffff', borderColor: '#e5e7eb' },
    { background: '#f0fdf4', borderColor: '#22c55e' },
  ];
  return colors[index % colors.length];
};

const cardStyle = (index) => ({
  background: getCardColor(index).background,
  borderRadius: 8,
  padding: '12px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: `1px solid ${getCardColor(index).borderColor}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  width: '100%',
  minHeight: '60px'
});

const cardHoverStyle = {
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transform: 'translateY(-2px)',
};

const deleteBtnStyle = {
  padding: '6px 12px',
  border: 'none',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  background: '#fee2e2',
  color: '#ef4444',
  transition: 'all 0.2s',
  zIndex: 1000,
  position: 'relative',
};

const ProcessusAchatDashboard = () => {
  const [selectedDossier, setSelectedDossier] = useState('tous');
  const [selectedFamille, setSelectedFamille] = useState('Toutes');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showGestionnaireForm, setShowGestionnaireForm] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:5001/api/demandes?';
    if (selectedFamille !== 'Toutes') url += `famille=${encodeURIComponent(selectedFamille)}&`;
    if (selectedDossier === 'conforme') url += 'status=confirmée';
    else if (selectedDossier === 'non_conforme') url += 'status=non_confirmée';
    else if (selectedDossier === 'dispatcher') url += 'status=reçue';
    
    fetch(url)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) return res.text().then(text => { throw new Error(text); });
        if (contentType && contentType.includes('application/json')) return res.json();
        return res.text().then(text => { throw new Error('Réponse non JSON: ' + text); });
      })
      .then(data => {
        setRequests(data);
      })
      .catch(err => {
        console.error(' Erreur chargement:', err);
        setRequests([]);
        setError('Chargement en cours...');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();

  }, [selectedFamille, selectedDossier]);

  const handleDelete = async (requestId, event) => {
    event.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      setDeletingId(requestId);
      try {
        const url = `http://localhost:5001/api/demandes/${requestId}`;
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setRequests(prev => prev.filter(req => (req.id !== requestId && req._id !== requestId)));
        } else {
          const errorText = await response.text();
          console.error(' Erreur serveur:', errorText);
          alert('Erreur lors de la suppression: ' + errorText);
        }
      } catch (error) {
        console.error(' Erreur réseau:', error);
        alert('Erreur de connexion: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa', paddingTop: '90px' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 24, textAlign: 'center' }}>
          <span style={{ color: '#2563eb' }}>Dossiers</span>
        </div>
        {dossiers.map((dossier) => (
          <button
            key={dossier.key}
            style={dossierBtnStyle(selectedDossier === dossier.key)}
            onClick={() => setSelectedDossier(dossier.key)}
          >
            {dossier.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main style={mainContentStyle}>
        {/* Onglets familles */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <button
            style={tabStyle(selectedFamille === 'Toutes')}
            onClick={() => setSelectedFamille('Toutes')}
          >
            Toutes
          </button>
          {familles.map((fam) => (
            <button
              key={fam}
              style={tabStyle(selectedFamille === fam)}
              onClick={() => setSelectedFamille(fam)}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Cartes des demandes */}
        {loading ? (
          <div style={{ color: '#2563eb', fontWeight: 600, textAlign: 'center', marginTop: 40 }}>Chargement...</div>
        ) : error ? (
          <div style={{ color: '#666', fontWeight: 600, textAlign: 'center', marginTop: 40 }}>Chargement en cours...</div>
        ) : (
          <div style={cardsContainerStyle}>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                Aucune demande
              </div>
            ) : (
              requests.map((request, index) => (
                <div key={request.id || request._id} style={{
                  ...cardStyle(index),
                  ...(hoveredCard === index ? cardHoverStyle : {}),
                  // Barre verte si la demande non conforme a été mise à jour par le demandeur
                  ...(request && (
                    request.status === 'non_confirmée' || 
                    request.status === 'non conforme' || 
                    request.status === 'non_confirmee' ||
                    request.status === 'Non conforme' ||
                    request.status === 'Non confirmée'
                  ) && request.date_modification && {
                    borderLeft: '4px solid #22c55e' // Barre verte
                  }),
                  // Barre rouge si la demande non conforme n'a pas encore été mise à jour
                  ...(request && (
                    request.status === 'non_confirmée' || 
                    request.status === 'non conforme' || 
                    request.status === 'non_confirmee' ||
                    request.status === 'Non conforme' ||
                    request.status === 'Non confirmée'
                  ) && !request.date_modification && {
                    borderLeft: '4px solid #ef4444' // Barre rouge
                  })
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => {
                  setSelectedDemande(request);
                }}>
                  {/* Layout comme Gmail */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%' }}>
                    {/* Colonne de gauche - Demandeur */}
                    <div style={{ minWidth: '200px', flexShrink: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: '#222', marginBottom: '2px' }}>
                        {request.demandeur_name || 'Non renseigné'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {request.demandeur || 'Non renseigné'}
                      </div>
                    </div>

                    {/* Colonne centrale - Objet et détails */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: '#222', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {request.objet}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {request.date_creation ? new Date(request.date_creation).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : request.date ? new Date(request.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date non renseignée'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11H1l8-8 8 8h-8v8z"/>
                          </svg>
                          {request.famille}
                        </span>
                        {request.prix && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                              <path d="M12 6v2m0 8v2"/>
                            </svg>
                            {request.prix} MAD
                          </span>
                        )}
                        {request.fichiers && request.fichiers.length > 0 && (
                          <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14,2 14,8 20,8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10,9 9,9 8,9"/>
                            </svg>
                            {request.fichiers.length} fichier{request.fichiers.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Colonne de droite - Statut et Actions */}
                    <div style={{ minWidth: '120px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span style={badgeStyle(request.status || request.statut)}>
                        {request.status || request.statut}
                        {/* Indication si mise à jour */}
                        {request && (
                          request.status === 'non_confirmée' || 
                          request.status === 'non conforme' || 
                          request.status === 'non_confirmee' ||
                          request.status === 'Non conforme' ||
                          request.status === 'Non confirmée'
                        ) && request.date_modification && (
                          <span style={{ 
                            marginLeft: '4px', 
                            fontSize: '10px', 
                            color: '#22c55e',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </span>
                        )}
                      </span>
                      <button
                        style={{
                          ...deleteBtnStyle,
                          opacity: deletingId === (request.id || request._id) ? 0.6 : 1,
                          pointerEvents: deletingId === (request.id || request._id) ? 'none' : 'auto'
                        }}
                        onClick={(e) => {
                          handleDelete(request.id || request._id, e);
                        }}
                        disabled={deletingId === (request.id || request._id)}
                      >
                        {deletingId === (request.id || request._id) ? (
                          'Suppression...'
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            Supprimer
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      
      {/* Modal de détails */}
      {selectedDemande && !showGestionnaireForm && (
        <DetailDemande 
          demande={selectedDemande} 
          onClose={() => setSelectedDemande(null)}
          onOpenGestionnaireForm={(demande) => {
            setShowGestionnaireForm(true);
          }}
        />
      )}

      {/* Formulaire détaillé du gestionnaire */}
      {selectedDemande && showGestionnaireForm && (
        <GestionnaireForm 
          demande={selectedDemande} 
          onClose={() => {
            setShowGestionnaireForm(false);
            setSelectedDemande(null);
          }}
          onStatusChange={() => {
            setShowGestionnaireForm(false);
            setSelectedDemande(null);
            // Recharger les demandes après changement de statut
            fetchRequests();
          }}
        />
      )}
    </div>
  );
};

export default ProcessusAchatDashboard;
