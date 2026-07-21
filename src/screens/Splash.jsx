import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div className="splash">
      <div className="splash-title">CONTRACTOR ASSISTANT</div>
      <div className="splash-sub">
        Built by contractors,
        <br />
        for contractors.
      </div>
      <button className="splash-enter" onClick={() => navigate('/home')}>
        Enter
      </button>
    </div>
  );
}
