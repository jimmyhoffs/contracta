import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getDocuments, addDocument, logEvent } from '../../repo.js';

export default function DocumentsScreen() {
  const { jobId } = useParams();
  const [docs, setDocs] = useState([]);
  const fileRef = useRef();

  const load = () => getDocuments(jobId).then(setDocs);

  useEffect(() => {
    load();
  }, [jobId]);

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    await Promise.all(files.map((f) => addDocument(jobId, f.name, f)));
    await logEvent(jobId, `${files.length} document${files.length > 1 ? 's' : ''} added`);
    load();
  };

  const open = (doc) => {
    const url = URL.createObjectURL(doc.blob);
    window.open(url, '_blank', 'noopener');
  };

  return (
    <Screen title="Documents">
      <button className="big-btn" onClick={() => fileRef.current.click()}>
        📁 Browse Files
      </button>
      <input ref={fileRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />

      {docs.length === 0 ? (
        <div className="empty-state">No documents yet.</div>
      ) : (
        <div className="stack" style={{ marginTop: 16 }}>
          {docs.map((d) => (
            <button key={d.id} className="list-tile" onClick={() => open(d)}>
              📎 {d.name}
            </button>
          ))}
        </div>
      )}
    </Screen>
  );
}
