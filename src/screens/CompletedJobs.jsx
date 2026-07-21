import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { getAllJobsWithCustomers } from '../repo.js';

export default function CompletedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getAllJobsWithCustomers().then((all) => setJobs(all.filter((j) => j.stage === 'Complete' || j.stage === 'Paid')));
  }, []);

  return (
    <Screen title="Completed Jobs" onBack={() => navigate('/home')}>
      {jobs.length === 0 ? (
        <div className="empty-state">No completed jobs yet.</div>
      ) : (
        <div className="stack">
          {jobs.map((j) => (
            <button key={j.id} className="list-tile" onClick={() => navigate(`/jobs/${j.id}`)}>
              {j.customer?.name}
              <div className="hint" style={{ marginTop: 4, marginBottom: 0 }}>
                {j.jobType} · {j.stage}
              </div>
            </button>
          ))}
        </div>
      )}
    </Screen>
  );
}
