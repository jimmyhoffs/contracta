import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobsWithCustomers } from '../repo';

export default function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ active: 0, completed: 0 });

  useEffect(() => {
    getAllJobsWithCustomers().then((jobs) => {
      const completed = jobs.filter((j) => j.stage === 'Paid' || j.stage === 'Complete').length;
      setCounts({ active: jobs.length - completed, completed });
    });
  }, []);

  return (
    <div className="screen">
      <div className="screen-header" style={{ justifyContent: 'center' }}>
        <div className="screen-title" style={{ textAlign: 'center' }}>
          Contractor Assistant
        </div>
      </div>

      <div className="stack" style={{ marginTop: 20 }}>
        <button className="big-btn primary" onClick={() => navigate('/new-job')}>
          ➕ NEW JOB
        </button>

        <button className="big-btn" onClick={() => navigate('/jobs')}>
          EXISTING JOBS
          {counts.active > 0 && <span className="badge">{counts.active}</span>}
        </button>

        <button className="big-btn" onClick={() => navigate('/jobs/completed')}>
          COMPLETED JOBS
          {counts.completed > 0 && <span className="badge">{counts.completed}</span>}
        </button>
      </div>

      <div className="footer-actions">
        <button className="big-btn subtle" onClick={() => navigate('/settings')}>
          ⚙ Settings
        </button>
      </div>
    </div>
  );
}
