import * as yup from 'yup';

export const stepFamilleSchema = yup.object().shape({
  famille: yup.string().required('La famille est requise'),
  referent: yup.string().required('Le référent est requis'),
}); 