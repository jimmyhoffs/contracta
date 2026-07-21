import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { getAllJobsWithCustomers } from '../repo.js';
import { STAGES, STAGE_COLORS } from '../constants.js';

const ACTIVE_STAGES = STAGES.filter((s) => s !== 'Complete' && s !== 'Paid');

export default function ExistingJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState({});

  useEffect(() => {
    getAllJobsWithCustomers().then((all) => setJobs(all.filter((j) => ACTIVE_STAGES.includes(j.stage))));
  }, []);

  const groups = ACTIVE_STAGES.map((stage) => ({
    stage,
    jobs: jobs.filter((j) => j.stage === stage),
  })).filter((g) => g.jobs.length > 0);

  if (groups.length === 0) {
    return (
      <Screen title="Existing Jobs" onBack={() => navigate('/home')}>
        <div className="empty-state">No active jobs yet. Start a new job from the home screen.</div>
      </Screen>
    );
  }

  return (
    <Screen title="Existing Jobs" onBack={() => navigate('/home')}>
      {groups.map(({ stage, jobs: stageJobs }) => (
        <div key={stage}>
          <button
            className="group-header"
            style={{ width: '100%', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            onClick={() => setOpen((o) => ({ ...o, [stage]: !o[stage] }))}
          >
            <span className="dot" style={{ background: STAGE_COLORS[stage] }} />
            {stage} ({stageJobs.length})
            <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{open[stage] ? '▲' : '▼'}</span>
          </button>

          {open[stage] && (
            <div className="stack">
              {stageJobs.map((j) => (
                <button key={j.id} className="list-tile" onClick={() => navigate(`/jobs/${j.id}`)}>
                  {j.customer?.name}
                  <div className="hint" style={{ marginTop: 4, marginBottom: 0 }}>
                    {j.jobType}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </Screen>
  );
}
