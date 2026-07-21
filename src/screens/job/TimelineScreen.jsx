import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getTimeline } from '../../repo.js';
import { formatClock, formatDay } from '../../utils/time.js';

export default function TimelineScreen() {
  const { jobId } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getTimeline(jobId).then(setEvents);
  }, [jobId]);

  if (events.length === 0) {
    return (
      <Screen title="Timeline">
        <div className="empty-state">Nothing logged yet. The timeline fills in automatically as you work.</div>
      </Screen>
    );
  }

  let lastDay = null;

  return (
    <Screen title="Timeline">
      <div className="timeline-list">
        {events.map((e) => {
          const day = formatDay(e.timestamp);
          const showDay = day !== lastDay;
          lastDay = day;
          return (
            <div key={e.id}>
              {showDay && <div className="timeline-day">{day}</div>}
              <div className="timeline-entry">
                <span className="timeline-time">{formatClock(e.timestamp)}</span>
                <span>{e.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
