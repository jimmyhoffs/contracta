import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepCustomer from './StepCustomer.jsx';
import StepPhone from './StepPhone.jsx';
import StepEmail from './StepEmail.jsx';
import StepAddress from './StepAddress.jsx';
import StepJobType from './StepJobType.jsx';
import StepContactMethod from './StepContactMethod.jsx';
import StepPhotos from './StepPhotos.jsx';
import StepNotes from './StepNotes.jsx';
import StepSummary from './StepSummary.jsx';
import { createJob } from '../../repo';

const TOTAL_STEPS = 8;

const emptyDraft = () => ({
  customer: { id: null, name: '', phone: '', email: '', address: '' },
  jobType: '',
  contactMethod: '',
  photos: [],
  notes: '',
});

export default function NewJobWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(emptyDraft);

  const patch = (fields) => setDraft((d) => ({ ...d, ...fields }));
  const patchCustomer = (fields) => setDraft((d) => ({ ...d, customer: { ...d.customer, ...fields } }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  const back = () => (step === 1 ? navigate('/home') : setStep((s) => s - 1));

  const handleSave = async () => {
    const job = await createJob(draft);
    navigate(`/jobs/${job.id}`, { replace: true });
  };

  const props = { draft, patch, patchCustomer, next, back, step, totalSteps: TOTAL_STEPS };

  if (step === 1) return <StepCustomer {...props} />;
  if (step === 2) return <StepPhone {...props} />;
  if (step === 3) return <StepEmail {...props} />;
  if (step === 4) return <StepAddress {...props} />;
  if (step === 5) return <StepJobType {...props} />;
  if (step === 6) return <StepContactMethod {...props} />;
  if (step === 7) return <StepPhotos {...props} />;
  if (step === 8) return <StepNotes {...props} />;
  return <StepSummary draft={draft} onSave={handleSave} onEdit={() => setStep(1)} onBack={() => setStep(8)} />;
}
