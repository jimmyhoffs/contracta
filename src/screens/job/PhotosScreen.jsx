import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getPhotos, addPhoto, deletePhoto, logEvent } from '../../repo.js';
import { useObjectUrls } from '../../hooks/useObjectUrls.js';

export default function PhotosScreen() {
  const { jobId } = useParams();
  const [photos, setPhotos] = useState([]);
  const cameraRef = useRef();
  const galleryRef = useRef();
  const urls = useObjectUrls(photos);

  const load = () => getPhotos(jobId).then(setPhotos);

  useEffect(() => {
    load();
  }, [jobId]);

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    await Promise.all(files.map((f) => addPhoto(jobId, f)));
    await logEvent(jobId, `${files.length} photo${files.length > 1 ? 's' : ''} added`);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await deletePhoto(id);
    load();
  };

  return (
    <Screen title="Photos">
      <div className="stack">
        <button className="big-btn" onClick={() => cameraRef.current.click()}>
          📷 Take Photos
        </button>
        <button className="big-btn" onClick={() => galleryRef.current.click()}>
          🖼 Choose Gallery
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

      {photos.length === 0 ? (
        <div className="empty-state">No photos yet.</div>
      ) : (
        <div className="photo-grid">
          {photos.map((p) => (
            <img key={p.id} className="photo-thumb" src={urls[p.id]} onClick={() => remove(p.id)} alt="" />
          ))}
        </div>
      )}
    </Screen>
  );
}
