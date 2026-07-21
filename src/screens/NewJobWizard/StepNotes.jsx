import { useRef, useState } from 'react';
import Screen from '../../components/Screen.jsx';

const SpeechRecognitionCtor =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function StepNotes({ draft, patch, next, back }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

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
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      patch({ notes: (draft.notes ? draft.notes + ' ' : '') + transcript.trim() });
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Job Notes</div>

      <textarea
        className="field-input"
        placeholder="Replace south slope. Five sheets. One vent."
        value={draft.notes}
        onChange={(e) => patch({ notes: e.target.value })}
      />

      <button className={`mic-btn${recording ? ' recording' : ''}`} onClick={toggleVoice}>
        {recording ? '● Listening… tap to stop' : '🎤 Voice Note'}
      </button>

      <div className="footer-actions">
        <button className="big-btn primary" onClick={next}>
          {draft.notes.trim() ? 'Next' : 'Skip'}
        </button>
      </div>
    </Screen>
  );
}
