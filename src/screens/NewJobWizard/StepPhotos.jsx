import { useRef } from 'react';
import Screen from '../../components/Screen.jsx';

export default function StepPhotos({ draft, patch, next, back }) {
  const cameraRef = useRef();
  const galleryRef = useRef();
  const filesRef = useRef();

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    patch({ photos: [...draft.photos, ...files] });
  };

  const removePhoto = (idx) => {
    patch({ photos: draft.photos.filter((_, i) => i !== idx) });
  };

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Add Photos</div>

      <div className="stack">
        <button className="big-btn" onClick={() => cameraRef.current.click()}>
          📷 Take Photos
        </button>
        <button className="big-btn" onClick={() => galleryRef.current.click()}>
          🖼 Choose Gallery
        </button>
        <button className="big-btn" onClick={() => filesRef.current.click()}>
          📁 Browse Files
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
      <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      <input ref={filesRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />

      {draft.photos.length > 0 && (
        <div className="photo-grid">
          {draft.photos.map((file, idx) => (
            <img
              key={idx}
              className="photo-thumb"
              src={URL.createObjectURL(file)}
              onClick={() => removePhoto(idx)}
              alt=""
            />
          ))}
        </div>
      )}

      <div className="footer-actions">
        {draft.photos.length > 0 && (
          <button className="big-btn primary" onClick={next}>
            Next
          </button>
        )}
        <button className="skip-link" onClick={next}>
          Skip
        </button>
      </div>
    </Screen>
  );
}
