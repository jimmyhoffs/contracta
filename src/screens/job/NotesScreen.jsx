import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getJob, updateJob, logEvent } from '../../repo.js';

const SpeechRecognitionCtor =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function NotesScreen() {
  const { jobId } = useParams();
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(true);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    getJob(jobId).then((j) => setNotes(j?.notes || ''));
  }, [jobId]);

  const save = async () => {
    await updateJob(jobId, { notes });
    await logEvent(jobId, 'Notes updated');
    setSaved(true);
  };

  const toggleVoice = () => {
    if (!SpeechRecognitionCtor) {
      alert('Voice notes are not supported on this device. Type your notes instead.');
      return;
    }
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setNotes((n) => (n ? n + ' ' : '') + transcript.trim());
      setSaved(false);
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  return (
    <Screen title="Job Notes">
      <textarea
        className="field-input"
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
      />
      <button className={`mic-btn${recording ? ' recording' : ''}`} onClick={toggleVoice}>
        {recording ? '● Listening… tap to stop' : '🎤 Voice Note'}
      </button>
      <div className="footer-actions">
        <button className="big-btn primary" disabled={saved} onClick={save}>
          {saved ? 'Saved' : 'Save Notes'}
        </button>
      </div>
    </Screen>
  );
}
