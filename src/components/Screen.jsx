import { useNavigate } from 'react-router-dom';

export default function Screen({ title, onBack, children, noBack }) {
  const navigate = useNavigate();
  return (
    <div className="screen">
      <div className="screen-header">
        {!noBack && (
          <button className="back-btn" onClick={onBack || (() => navigate(-1))} aria-label="Back">
            ←
          </button>
        )}
        <div className="screen-title">{title}</div>
      </div>
      {children}
    </div>
  );
}
