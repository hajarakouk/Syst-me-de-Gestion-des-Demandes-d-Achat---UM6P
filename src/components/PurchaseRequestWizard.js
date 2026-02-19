import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import Step2FamilleReferent from './Step2FamilleReferent';
import { BsFileEarmarkArrowDown, BsEyeFill } from 'react-icons/bs';
import './PurchaseRequestFormFigma.css';
import './PurchaseRequestStepper.css';
import './PurchaseRequestStepperHorizontal.css';

// --- Validation schemas pour chaque étape ---
const step1Schema = yup.object().shape({
  objet: yup.string().required('Obligatoire').min(5, 'Au moins 5 caractères'),
  entite: yup.string().matches(/^U\d{3}$/, 'Format UXXX').required('Obligatoire'),
  urgence: yup.string().oneOf(['Normal', 'Urgent']).required('Obligatoire'),
});
const step2Schema = yup.object().shape({
  typeAchat: yup.string().required('Obligatoire'),
});
const step3Schema = yup.object().shape({
  excel: yup.mixed().required('Fichier Excel requis'),
  docs: yup.array(),
  lignesExcel: yup.array().required('Lecture Excel requise'),
});

const typeDocs = {
  'Achat direct': [
    'Applicable si le montant estimé ne dépasse pas 50 KMAD.',
    'Fournir :',
    '- Descriptif technique détaillé (sans lien fournisseur ni prix, avec spécifications exactes).',
    '- Proposition fournisseur.'
  ],
  "Appel d’offres": [
    'Applicable si l’estimation dépasse 50 KMAD.',
    'Fournir :',
    '- Descriptif technique détaillé.',
    '- Synthèse des critères de sélection.',
    '- Propositions fournisseurs.'
  ],
  'Gré à gré': [
    'Sélectionner "gré à gré" en cas de recours à un fournisseur précis pour l’un des motifs suivants :',
    '1. Exclusivité',
    '2. Confidentialité',
    '3. Urgence extrême',
    'Fournir :',
    '- Devis.',
    '- Note gré à gré signée par le responsable d’entité, expliquant en détail le motif du recours.',
    '- Lettre d’exclusivité (si applicable).'
  ],
  'Achat en ligne': [
    'Sélectionner "achat en ligne" en cas d’achat d’un service ou produit en ligne.',
    'Fournir :',
    '- Lien d’achat.',
    '- Capture d’écran de l’achat.'
  ],
  'Convention/Accord-cadre': [
    'Sélectionner cette option si un contrat ou une convention existe avec le fournisseur.',
    'Fournir :',
    '- Contrat.',
    '- Factures à payer.'
  ],
  'Achat de vacation': [
    'Sélectionner "vacation" en cas de prestation fournie par un vacataire.',
    'Fournir :',
    '- Contrat de vacataire.'
  ]
};


const defaultValues = {
  objet: '',
  entite: '',
  urgence: 'Normal',
  typeAchat: '',
  excel: null,
  docs: [],
  lignesExcel: [],
};

function HelpModal({ open, onClose, content }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
        <h2 style={{ marginTop: 0 }}>Aide</h2>
        <div>{content}</div>
        <button onClick={onClose} style={{ marginTop: 24, background: '#e6501e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700 }}>Fermer</button>
      </div>
    </div>
  );
}

const steps = [
  'Informations Générales',
  'Type d’achat',
  'Upload fichiers',
  'Récapitulatif'
];

export default function PurchaseRequestWizard() {
  const [step, setStep] = useState(1);
  const [help, setHelp] = useState(null);
  const [excelPreview, setExcelPreview] = useState([]);
  const [excelError, setExcelError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [daNumber, setDaNumber] = useState('');
  const userName = localStorage.getItem('name') || localStorage.getItem('user') || 'Utilisateur';

  // Wizard form
  const methods = useForm({ defaultValues, resolver: yupResolver(step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema) });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = methods;
  const typeAchat = watch('typeAchat');
  const docs = watch('docs');
  const excel = watch('excel');

  const handleChange = e => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  // --- Step 1: Infos générales ---
  const Step1 = () => (
    <div style={{ marginTop: '-48px' }}>
      
      <label>Objet de la demande *</label>
      <input {...register('objet')} placeholder="Ex: Achat d’un PC portable Lenovo" className="form-input" />
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
      <div style={{ margin: '18px 0', color: '#888' }}>
        Prévisualisation : <b>Vous êtes {userName} et vous demandez "{methods.getValues('objet')}" pour l’entité {methods.getValues('entite') || '...'}.</b>
      </div>
    </div>
  );

  // --- Step 2: Type de demande + Famille d'achat ---
  const familles = [
    'Famille DAG', 'Famille IT', 'Famille Laboratoire', 'Famille Médicament',
    'Famille Communication et Audiovisuelle', 'Famille Sport', 'Famille Livre', 
  ];
  const [showTypeHelp, setShowTypeHelp] = useState(true);
  const Step2 = () => (
  <div style={{ marginTop: '8px' }}>
      <label>Type *</label>
    <select
      {...register('typeAchat')}
      className="form-input"
      onChange={e => {
        setShowTypeHelp(true);
        setValue('typeAchat', e.target.value);
      }}
    >
        <option value="">Choisir…</option>
      {Object.keys(typeDocs).map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
      </select>
      {errors.typeAchat && <div className="form-error">{errors.typeAchat.message}</div>}

      {typeAchat && showTypeHelp && (
        <div style={{ background: '#f7f7f7', borderRadius: 12, padding: 18, marginTop: 18, position: 'relative' }}>
        <button
          onClick={() => setShowTypeHelp(false)}
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1
          }}
          title="Fermer l'explication"
        >
          
        </button>
          <b>Explications :</b>
          <ul>
            {typeDocs[typeAchat].map(doc => <li key={doc}> {doc}</li>)}
          </ul>
        </div>
      )}

    <div style={{ marginTop: 24 }}>
      <label>Famille d’Achat *</label>
      <select {...register('famille')} className="form-input">
        <option value="">Sélectionner</option>
        {familles.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      {errors.famille && <div className="form-error">{errors.famille.message}</div>}
    </div>
    </div>
  );

  // --- Step 3: Upload fichiers ---
  const [showExcelInfo, setShowExcelInfo] = useState(false);
  const Step3 = () => (
    <div>
      <h2> Upload des fichiers <span style={{ cursor: 'pointer' }} onClick={() => setHelp('upload')}></span></h2>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Fichier Excel *
        <a
          href="/Articles_Qte (5).xlsx"
          download
          style={{ marginLeft: 8, textDecoration: 'none', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center' }}
          title="Télécharger le modèle Excel"
        >
          <BsFileEarmarkArrowDown style={{ fontSize: 20, marginRight: 4 }} /> Article
        </a>
        <span
          style={{ marginLeft: 8, cursor: 'pointer', color: '#222', fontSize: 20 }}
          onClick={() => setShowExcelInfo(v => !v)}
          title="Explication du fichier Excel"
        >
          <BsEyeFill style={{ fontSize: 20 }} />
        </span>
      </label>
      {showExcelInfo && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 16, margin: '8px 0', color: '#444', fontSize: 15, maxWidth: 500 }}>
          <b>Explication du fichier Excel :</b>
          <ul style={{ margin: '8px 0 0 18px' }}>
            <li><b>Désignation</b> : le nom de votre produit en français</li>
            <li><b>Entité</b> : remplir la case avec le numéro de l’entité (ex : communication c’est U129)</li>
            <li><b>Ligne budgétaire (order interne)</b> : renseignez la ligne budgétaire concernée (Veuillez vous assurer que la ligne est correcte et alimentée afin d’éviter tout retard). Veuillez aussi ajouter le type d'achat à côté de la ligne budgétaire.</li>
          </ul>
        </div>
      )}
      <Dropzone
        accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }}
        multiple={false}
        maxSize={100 * 1024 * 1024} // 100MB
        onDrop={(acceptedFiles, rejectedFiles) => {
          if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors.some(e => e.code === 'file-too-large')) {
              setExcelError('Le fichier est trop volumineux. Taille maximale : 100MB');
            } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
              setExcelError('Type de fichier invalide. Seuls les fichiers .xlsx sont acceptés.');
            } else {
              setExcelError('Erreur lors du chargement du fichier.');
            }
            return;
          }
          if (acceptedFiles.length > 0) {
            setExcelError('');
            setValue('excel', acceptedFiles[0]);
            handleExcelRead(acceptedFiles[0]);
          }
        }}
        onDropRejected={(fileRejections) => {
          // Empêcher l'affichage du message par défaut de Dropzone
          const rejection = fileRejections[0];
          if (rejection.errors.some(e => e.code === 'file-too-large')) {
            setExcelError('Le fichier est trop volumineux. Taille maximale : 100MB');
          } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
            setExcelError('Type de fichier invalide. Seuls les fichiers .xlsx sont acceptés.');
          } else {
            setExcelError('Erreur lors du chargement du fichier.');
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="form-dropzone">
            <input {...getInputProps()} />
            {excel ? <span>✅ {excel.name}</span> : <span>Glissez-déposez ou cliquez pour charger un fichier Excel (.xlsx)</span>}
          </div>
        )}
      </Dropzone>
      {excelError && (
        <div className="form-error">
          {excelError.startsWith('Champs vides détectés côté serveur :') ? (
            <>
              <div>Champs vides détectés côté serveur :</div>
              <ul style={{ margin: '8px 0 0 18px' }}>
                {excelError.replace('Champs vides détectés côté serveur :', '').split(',').map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            </>
          ) : (
            excelError
          )}
        </div>
      )}
      <label>Documents justificatifs *</label>
      <Dropzone
        accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] }}
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
            setValue('docs', [...docs, ...acceptedFiles]);
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
          <div {...getRootProps()} className="form-dropzone">
            <input {...getInputProps()} />
            <span>Glissez-déposez ou cliquez pour charger PDF/images</span>
          </div>
        )}
      </Dropzone>
      <ul>
        {docs && docs.map((f, i) => <li key={i}>{f.name} <button type="button" onClick={() => setValue('docs', docs.filter((_, j) => j !== i))}>❌</button></li>)}
      </ul>
      {errors.docs && <div className="form-error">{errors.docs.message}</div>}
    </div>
  );

  

  // --- Step 5: Lecture Excel ---
  // Colonnes obligatoires pour l'Excel
  const requiredExcelCols = ['Désignation', 'Quantité', 'Prix', 'Devise', 'Entité', 'Order interne'];

  // Lecture et validation Excel côté frontend (tolérante sur les noms de colonnes)
  function handleExcelRead(file) {
    setExcelError('');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const [header, ...body] = rows;
        if (!header) {
          setExcelError('Fichier Excel sans entête.');
          setExcelPreview([]);
          return;
        }
        // Filtrer les lignes totalement vides
        const filteredBody = body.filter(row => row.some(cell => cell && cell.toString().trim() !== ''));
        if (filteredBody.length === 0) {
          setExcelError('Veuillez remplir toutes les colonnes du tableau.');
          setExcelPreview([]);
          return;
        }
        const emptyCells = [];
        const dataRows = filteredBody.map((row, idx) => {
          const obj = Object.fromEntries(header.map((h, i) => [h, row[i]]));
          // Vérifier les champs vides seulement si au moins un champ est rempli
          const hasAtLeastOne = header.some(col => obj[col] && obj[col].toString().trim() !== '');
          if (hasAtLeastOne) {
            header.forEach(col => {
              if (!obj[col] || obj[col].toString().trim() === '') {
                emptyCells.push({ row: idx + 2, col });
              }
            });
          }
          return obj;
        });
        if (emptyCells.length > 0) {
          setExcelError('Champs vides trouvés : ' + emptyCells.map(c => `Ligne ${c.row} - ${c.col}`).join(', '));
          setExcelPreview([]);
          return;
        }
        setExcelPreview(dataRows);
        setValue('lignesExcel', dataRows);
      } catch (e) {
        setExcelError('Erreur de lecture du fichier Excel');
        setExcelPreview([]);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  
  // --- Step 6: Récapitulatif ---
  const Step6 = () => (
    <div>
      <h2>Récapitulatif <span style={{ cursor: 'pointer' }} onClick={() => setHelp('recap')}></span></h2>
      <div><b>Objet :</b> {methods.getValues('objet')}</div>
      <div><b>Demandeur :</b> {userName}</div>
      <div><b>Entité :</b> {methods.getValues('entite')}</div>
      <div><b>Urgence :</b> {methods.getValues('urgence')}</div>
      <div><b>Type d’achat :</b> {methods.getValues('typeAchat')}</div>
      <div><b>Documents joints :</b> {docs && docs.map(f => f.name).join(', ')}</div>
      <div style={{ margin: '18px 0' }}>
        <b>Lignes Excel :</b>
        {excelPreview.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                {Object.keys(excelPreview[0]).map(col => <th key={col} style={{ border: '1px solid #eee', padding: 6 }}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {excelPreview.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => <td key={j} style={{ border: '1px solid #eee', padding: 6 }}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : <span style={{ color: '#888' }}>Aucune ligne Excel chargée.</span>}
      </div>
    </div>
  );

  // --- Step 7: Soumission ---
  async function onSubmit(data) {
    // Envoi au backend
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'docs') {
        v.forEach(f => formData.append('docs', f));
      } else if (k === 'excel') {
        formData.append('excel', v);
      } else if (k === 'lignesExcel') {
        formData.append('lignesExcel', JSON.stringify(v));
      } else {
        formData.append(k, v);
      }
    });
    // Ajout explicite du champ famille si absent
    if (!formData.has('famille') && methods.getValues('famille')) {
      formData.append('famille', methods.getValues('famille'));
    }
    // Ajout explicite du champ demandeur (email)
    if (!formData.has('demandeur')) {
      formData.append('demandeur', localStorage.getItem('email') || '');
    }
    const res = await fetch('http://localhost:5001/api/demandes' ,{
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const result = await res.json();
      setDaNumber(result.daNumber || 'DA2407-01');
      setSubmitSuccess(true);
    } else {
      // Gestion erreur backend champs Excel vides
      if (res.status === 400) {
        const err = await res.json();
        if (err.details && Array.isArray(err.details)) {
          setExcelError('Champs vides détectés côté serveur : ' + err.details.map(c => `Ligne ${c.row} - ${c.col}`).join(', '));
          return;
        }
        setExcelError(err.error || 'Erreur de validation côté serveur.');
        return;
      }
      alert('Erreur lors de la soumission');
    }
  }

  // --- Step 8: Suivi (facultatif, à brancher sur backend) ---
  // ...

  // --- Step 9: Aide visuelle ---
  const helpContent = {
    infos: <div>Remplissez l’objet, l’entité (ex: U129), et l’urgence. Le nom du demandeur est récupéré automatiquement.</div>,
    type: <div>Choisissez le type d’achat. Selon le type, des documents spécifiques seront demandés.</div>,
    upload: <div>Chargez le fichier Excel et les documents justificatifs (PDF, images). Glissez-déposez ou cliquez.</div>,
    excel: <div>Le fichier Excel doit contenir les colonnes : Désignation, Quantité, Prix, Devise, Entité, Order interne.</div>,
    recap: <div>Vérifiez toutes les informations avant d’envoyer la demande.</div>,
  };

  // --- Navigation ---
  function next() { setStep(s => Math.min(s + 1, 4)); }
  function prev() { setStep(s => Math.max(s - 1, 1)); }

  if (submitSuccess) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 48, textAlign: 'center' }}>
        <h2>✅ Votre demande a bien été envoyée.</h2>
        <div style={{ fontSize: 20, margin: '18px 0' }}>N° DA : <b>{daNumber}</b></div>
        <div style={{ color: '#444', marginBottom: 18 }}>📬 Vous recevrez un email de confirmation dans quelques minutes.</div>
      </div>
    );
  }

  // ... tout ton code au-dessus reste identique

  return (
  <div
    className="stepper-horizontal-layout"
    style={{ paddingTop: step === 1 ? '160px' : '120px' }} //  Ajout d’espace visible pour steps 2,3,4
  >
    <div className="stepper-horizontal-card" style={{ paddingTop: 0 }}>
      
      {/* Titre du formulaire */}
      <h1
        className="formulaire-title-custom"
        style={{
          marginTop: step === 1 ? '60px' : '30px',
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        Formulaire demande d'achat
      </h1>

      {/* Stepper horizontal */}
      <div className="formulaire-stepper-horizontal">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div
              className={`formulaire-stepper-step${step === num ? ' active' : ''}${step > num ? ' done' : ''}`}
            >
              <span className="formulaire-stepper-circle">{num}</span>
              <span className="formulaire-stepper-label">
                {num === 1
                  ? 'Informations Générales'
                  : num === 2
                  ? 'Type d’Achat'
                  : 'Upload fichiers'}
              </span>
            </div>
            {num < 3 && (
              <div className={`formulaire-stepper-line${step > num ? ' done' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Message de bienvenue uniquement à Step 1 */}
      {step === 1 && (
        <div
          className="formulaire-bienvenue-custom"
          style={{
            margin: '40px 0 80px 0',
            textAlign: 'center',
          }}
        >
          Bonjour, {userName}. Lorsque vous soumettez ce formulaire, le propriétaire verra votre nom et votre adresse e-mail.
        </div>
      )}

        <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-card form-card-horizontal"
          style={{ marginTop: step === 1 ? '0' : '20px' }}
        >
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step6 />}

          <div
            style={{
              display: 'flex',
              justifyContent: step === 2 || step === 3 ? 'center' : 'flex-end',
              marginTop: 32,
              gap: '30px',
              flexWrap: 'wrap',
            }}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={prev}
                className="form-btn form-btn-orange"
              >
                Précédent
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={next}
                className="form-btn form-btn-orange"
                disabled={!!excelError && step === 3}
              >
                Suivant
              </button>
            )}
            {step === 4 && (
              <button type="submit" className="form-btn form-btn-orange">
                Envoyer
              </button>
            )}
            </div>

          <HelpModal
            open={!!help}
            onClose={() => setHelp(null)}
            content={helpContent[help]}
          />
          </form>
        </FormProvider>
      </div>
    </div>
  );
} 