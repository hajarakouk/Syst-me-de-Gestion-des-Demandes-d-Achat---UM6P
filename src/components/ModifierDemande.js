/**
 * Composant ModifierDemande
 * 
 * Permet aux utilisateurs de modifier une demande d'achat existante
 * qui a été marquée comme "non conforme" par le gestionnaire.
 * 
 * Fonctionnalités :
 * - Chargement des données existantes de la demande
 * - Formulaire multi-étapes avec validation
 * - Upload de nouveaux fichiers Excel et documents
 * - Conservation des fichiers existants
 * - Mise à jour de la demande via API REST
 * 
 * @author Elakouk Hajar
 * @date Stage UM6P - Juillet-Août 2025
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import { FiDownload, FiEye, FiUpload, FiX } from 'react-icons/fi';
import './PurchaseRequestFormFigma.css';
import './PurchaseRequestStepper.css';
import './PurchaseRequestStepperHorizontal.css';

/**
 * Schémas de validation Yup pour chaque étape du formulaire
 * - step1Schema : Validation des informations générales (objet, entité, urgence, etc.)
 * - step2Schema : Validation du type d'achat et de la famille
 * - step3Schema : Validation optionnelle des fichiers (Excel et documents)
 * - step4Schema : Pas de validation pour l'étape récapitulatif
 */
const step1Schema = yup.object().shape({
  objet: yup.string().required('Obligatoire').min(5, 'Au moins 5 caractères'),
  entite: yup.string().matches(/^U\d{3}$/i, 'Format UXXX').required('Obligatoire'),
  urgence: yup.string().oneOf(['Normal', 'Urgent']).required('Obligatoire'),
  description: yup.string().required('Obligatoire'),
  justification: yup.string().required('Obligatoire'),
});
const step2Schema = yup.object().shape({
  typeAchat: yup.string().required('Obligatoire'),
  famille: yup.string().required('Obligatoire'),
});
const step3Schema = yup.object().shape({
  excel: yup.mixed().nullable().optional(),
  docs: yup.array().nullable().optional(),
  lignesExcel: yup.array().nullable().optional(),
});

// Schéma pour l'étape 4 (soumission) - pas de validation
const step4Schema = yup.object().shape({});

const defaultValues = {
  objet: '',
  entite: '',
  urgence: 'Normal',
  description: '',
  justification: '',
  typeAchat: '',
  famille: '',
  excel: null,
  docs: [],
  lignesExcel: []
};

/**
 * Étapes du formulaire de modification
 */
const steps = [
  'Informations Générales',
  'Type d\'achat',
  'Upload fichiers',
  'Récapitulatif'
];

/**
 * Composant principal ModifierDemande
 * 
 * @returns {JSX.Element} Formulaire de modification de demande
 */
export default function ModifierDemande() {
  // Récupération de l'ID de la demande depuis l'URL
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [excelPreview, setExcelPreview] = useState([]);
  const [excelError, setExcelError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingExcelData, setExistingExcelData] = useState([]);
  const [demandeData, setDemandeData] = useState(null);
  const userName = localStorage.getItem('name') || localStorage.getItem('user') || 'Utilisateur';

  // Wizard form
  const methods = useForm({ 
    defaultValues, 
    resolver: yupResolver(
      step === 1 ? step1Schema : 
      step === 2 ? step2Schema : 
      step === 3 ? step3Schema : 
      step4Schema
    ) 
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = methods;
  const typeAchat = watch('typeAchat');
  const docs = watch('docs');
  const excel = watch('excel');

  // Charger les données de la demande
  useEffect(() => {
    const loadDemande = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/demandes/${id}`);
        
        if (!response.ok) {
          throw new Error('Demande non trouvée');
        }
        
        const demande = await response.json();
        setDemandeData(demande);
        
        // Pré-remplir le formulaire
        setValue('objet', demande.objet || '');
        setValue('entite', demande.entite || '');
        setValue('urgence', demande.urgence || 'Normal');
        setValue('description', demande.description || '');
        setValue('justification', demande.justification || '');
        setValue('typeAchat', demande.type_achat || '');
        setValue('famille', demande.famille || '');
        
        // Gérer les fichiers existants
        if (demande.fichiers && demande.fichiers.length > 0) {
          setExistingFiles(demande.fichiers);
        }
        
        // Gérer les données Excel existantes
        if (demande.lignes_excel && demande.lignes_excel.length > 0) {
          setExistingExcelData(demande.lignes_excel);
          setExcelPreview(demande.lignes_excel);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de la demande: ' + err.message);
        setLoading(false);
      }
    };
    
    loadDemande();
  }, [id, setValue]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Step 1: Infos générales
  const Step1 = () => (
    <div style={{ marginTop: '-48px' }}>
      {demandeData && (
        <div style={{ 
          background: '#f8fafd', 
          borderRadius: 8, 
          padding: 16, 
          marginBottom: 20, 
          border: '1px solid #e0e0e0',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Date de création :</strong> {formatDate(demandeData.date_creation || demandeData.date)}
        </div>
      )}
      
      <label>Objet de la demande *</label>
      <input {...register('objet')} placeholder="Ex: Achat d'un PC portable Lenovo" className="form-input" />
      {errors.objet && <div className="form-error">{errors.objet.message}</div>}
      
      <label>Nom du demandeur *</label>
      <input value={userName} disabled style={{ width: '100%', padding: '12px 10px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 12, fontSize: 16 }} />
      
      <label>Entité *</label>
      <input {...register('entite')} placeholder="U129" className="form-input" />
      {errors.entite && <div className="form-error">{errors.entite.message}</div>}
      
      <label>Urgence *</label>
      <select {...register('urgence')} className="form-input">
        <option value="Normal">Normal</option>
        <option value="Urgent">Urgent</option>
      </select>
      
      <label>Description *</label>
      <textarea {...register('description')} placeholder="Décrivez votre demande..." className="form-input" rows={4} />
      {errors.description && <div className="form-error">{errors.description.message}</div>}
      
      <label>Justification *</label>
      <textarea {...register('justification')} placeholder="Justifiez votre demande..." className="form-input" rows={4} />
      {errors.justification && <div className="form-error">{errors.justification.message}</div>}
      
      <div style={{ margin: '18px 0', color: '#888' }}>
        Prévisualisation : <b>Vous êtes {userName} et vous demandez "{methods.getValues('objet')}" pour l'entité {methods.getValues('entite') || '...'}.</b>
      </div>
    </div>
  );

  // Step 2: Type de demande + Famille d'achat
  const familles = [
    'Famille DAG', 'Famille IT', 'Famille Laboratoire', 'Famille Médicament',
    'Famille Communication et Audiovisuelle', 'Famille Sport', 'Famille Livre', 
  ];

  const Step2 = () => (
    <div style={{ marginTop: '-48px' }}>
      <label>Type d'achat *</label>
      <select {...register('typeAchat')} className="form-input">
        <option value="">Sélectionner un type</option>
        <option value="convention">Convention (Avoir un contrat/convention avec le fournisseur)</option>
        <option value="accord_cadre">Accord Cadre (Avoir un contrat/convention avec le fournisseur)</option>
        <option value="achat_direct">Achat Direct (Consultation &lt; 50 000 DH)</option>
        <option value="appel_offre">Appel d'Offre (Consultation &gt;50 000 DH)</option>
        <option value="achat_en_ligne">Achat en ligne (Achat par site internet)</option>
        <option value="gre_a_gre">Gré à Gré (Choix d'un seul fournisseur)</option>
        <option value="contrat_cadre">Contrat Cadre (Avoir un contrat sur SAP)</option>
      </select>
      {errors.typeAchat && <div className="form-error">{errors.typeAchat.message}</div>}
      
      <label>Famille d'achat *</label>
      <select {...register('famille')} className="form-input">
        <option value="">Sélectionner une famille</option>
        {familles.map(famille => (
          <option key={famille} value={famille}>{famille}</option>
        ))}
      </select>
      {errors.famille && <div className="form-error">{errors.famille.message}</div>}
    </div>
  );

  // Step 3: Upload fichiers
  const Step3 = () => (
    <div style={{ marginTop: '-48px' }}>
      <label>Fichier Excel (optionnel)</label>
      <Dropzone 
        maxSize={100 * 1024 * 1024} // 100MB
        onDrop={(acceptedFiles, rejectedFiles) => {
          if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors.some(e => e.code === 'file-too-large')) {
              alert('Le fichier est trop volumineux. Taille maximale : 100MB');
              return;
            }
          }
          if (acceptedFiles.length > 0) {
            setValue('excel', acceptedFiles[0]);
          }
        }}
        onDropRejected={(fileRejections) => {
          // Empêcher l'affichage du message par défaut "Yowza" de Dropzone
          const rejection = fileRejections[0];
          if (rejection.errors.some(e => e.code === 'file-too-large')) {
            alert('Le fichier est trop volumineux. Taille maximale : 100MB');
          } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
            alert('Type de fichier invalide.');
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <FiUpload style={{ fontSize: 24, marginBottom: 8 }} />
            <p>Glissez un fichier Excel ici ou cliquez pour sélectionner</p>
          </div>
        )}
      </Dropzone>
      {excel && (
        <div style={{ marginTop: 8, padding: 8, background: '#f0f9ff', borderRadius: 4 }}>
          <span> {excel.name}</span>
          <button type="button" onClick={() => setValue('excel', null)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
            <FiX />
          </button>
        </div>
      )}
      
      <label>Documents joints (optionnel)</label>
      <Dropzone 
        maxSize={100 * 1024 * 1024} // 100MB
        onDrop={(acceptedFiles, rejectedFiles) => {
          if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors.some(e => e.code === 'file-too-large')) {
              alert('Un ou plusieurs fichiers sont trop volumineux. Taille maximale : 100MB par fichier');
              return;
            }
          }
          if (acceptedFiles.length > 0) {
            setValue('docs', acceptedFiles);
          }
        }}
        onDropRejected={(fileRejections) => {
          // Empêcher l'affichage du message par défaut de Dropzone
          const rejection = fileRejections[0];
          if (rejection.errors.some(e => e.code === 'file-too-large')) {
            alert('Un ou plusieurs fichiers sont trop volumineux. Taille maximale : 100MB par fichier');
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <FiUpload style={{ fontSize: 24, marginBottom: 8 }} />
            <p>Glissez vos documents ici ou cliquez pour sélectionner</p>
          </div>
        )}
      </Dropzone>
      {docs && docs.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {docs.map((file, index) => (
            <div key={index} style={{ padding: 8, background: '#f0f9ff', borderRadius: 4, marginBottom: 4 }}>
              <span> {file.name}</span>
              <button type="button" onClick={() => setValue('docs', docs.filter((_, i) => i !== index))} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Afficher les fichiers existants */}
      {existingFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <label>Fichiers existants :</label>
          <div style={{ marginTop: 8 }}>
            {existingFiles.map((file, index) => (
              <div key={index} style={{ padding: 8, background: '#f8fafc', borderRadius: 4, marginBottom: 4, border: '1px solid #e5e7eb' }}>
                <span>{file.name || file.filename}</span>
                <span style={{ marginLeft: 8, color: '#888', fontSize: '12px' }}>
                  ({Math.round((file.size || 0) / 1024)} KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Afficher les données Excel existantes */}
      {existingExcelData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <label>Données Excel existantes :</label>
          <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto', background: '#f8fafc', borderRadius: 4, padding: 8 }}>
            <table style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  {Object.keys(existingExcelData[0] || {}).map(key => (
                    <th key={key} style={{ padding: 4, textAlign: 'left', fontWeight: 600 }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {existingExcelData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} style={{ padding: 4 }}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {existingExcelData.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 8, color: '#888', fontSize: '12px' }}>
                ... et {existingExcelData.length - 5} lignes supplémentaires
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Step 4: Récapitulatif
  const Step4 = () => (
    <div style={{ marginTop: '-48px' }}>
      <h3 style={{ color: '#2563eb', marginBottom: 16 }}>Récapitulatif de votre demande</h3>
      
      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>Informations générales</h4>
        <p><strong>Objet :</strong> {methods.getValues('objet')}</p>
        <p><strong>Demandeur :</strong> {userName} ({localStorage.getItem('email') || 'Non renseigné'})</p>
        <p><strong>Entité :</strong> {methods.getValues('entite')}</p>
        <p><strong>Urgence :</strong> {methods.getValues('urgence')}</p>
        <p><strong>Description :</strong> {methods.getValues('description')}</p>
        <p><strong>Justification :</strong> {methods.getValues('justification')}</p>
      </div>
      
      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>Type d'achat</h4>
        <p><strong>Type :</strong> {methods.getValues('typeAchat')}</p>
        <p><strong>Famille :</strong> {methods.getValues('famille')}</p>
      </div>
      
      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>Fichiers</h4>
        <p><strong>Fichiers existants :</strong> {existingFiles.length}</p>
        <p><strong>Nouveaux fichiers :</strong> {(docs?.length || 0) + (excel ? 1 : 0)}</p>
        <p><strong>Lignes Excel :</strong> {existingExcelData.length}</p>
      </div>
    </div>
  );

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  // Soumission
  async function onSubmit(data) {
    console.log(' Fonction onSubmit appelée !');
    console.log(' Données reçues:', data);
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();

      // Ajouter tous les champs de texte du formulaire
      for (const key in data) {
        if (key !== 'docs' && key !== 'excel' && key !== 'lignesExcel') {
          if (key === 'typeAchat') {
            formData.append('type_achat', data[key] || '');
          } else {
            formData.append(key, data[key] || '');
          }
        }
      }
      
      // Assurer que le demandeur est bien l'email stocké
      const demandeurEmail = localStorage.getItem('email') || '';
      formData.set('demandeur', demandeurEmail);

      // Ajouter les nouveaux documents
      if (data.docs && data.docs.length > 0) {
        for (let i = 0; i < data.docs.length; i++) {
          formData.append('fichiers', data.docs[i]);
        }
      }

      // Ajouter le nouveau fichier Excel
      if (data.excel) {
        formData.append('fichiers', data.excel);
      }
      
      // Ajouter les lignes Excel existantes
      formData.append('lignes_excel', JSON.stringify(existingExcelData));
      
      const res = await fetch(`http://localhost:5001/api/demandes/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        const errText = await res.text();
        console.error(' Erreur serveur:', errText);
        setError('Chargement en cours...');
      }
    } catch (error) {
      console.error(' Erreur de connexion:', error);
      setError('Chargement en cours...');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Chargement de la demande...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <div style={{ color: '#666', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Chargement en cours...</div>
          <div style={{ fontSize: '14px' }}>Veuillez patienter pendant que nous chargeons votre demande.</div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <div style={{ color: '#22c55e', marginBottom: 16, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          Demande modifiée avec succès !
        </div>
        <div style={{ color: '#666' }}>Redirection vers la page d'accueil...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px', paddingTop: '120px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ color: '#ff6600', fontSize: '28px', fontWeight: 700, marginBottom: 8 }}>
              Modifier ma demande
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Étape {step} sur {steps.length} : {steps[step - 1]}
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="form-card form-card-horizontal">
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
              {step === 4 && <Step4 />}

              <div style={{
                display: 'flex',
                justifyContent: step === 2 || step === 3 ? 'center' : 'flex-end',
                marginTop: 32,
                gap: '30px',
                flexWrap: 'wrap',
              }}>
                {step > 1 && (
                  <button type="button" onClick={prev} className="form-btn form-btn-orange">
                    Précédent
                  </button>
                )}
                {step < 4 && (
                  <button type="button" onClick={next} className="form-btn form-btn-orange">
                    Suivant
                  </button>
                )}
                {step === 4 && (
                  <button 
                    type="submit" 
                    className="form-btn form-btn-orange" 
                    disabled={loading}
                    onClick={() => {
                      console.log(' Bouton "Modifier la demande" cliqué !');
                      console.log(' État du formulaire:', methods.getValues());
                      console.log(' Erreurs de validation:', methods.formState.errors);
                      console.log(' Erreurs détaillées:', JSON.stringify(methods.formState.errors, null, 2));
                    }}
                  >
                    {loading ? 'Modification...' : 'Modifier la demande'}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
} 