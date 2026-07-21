import { Routes, Route } from 'react-router-dom';
import Splash from './screens/Splash.jsx';
import Home from './screens/Home.jsx';
import NewJobWizard from './screens/NewJobWizard/NewJobWizard.jsx';
import ExistingJobs from './screens/ExistingJobs.jsx';
import CompletedJobs from './screens/CompletedJobs.jsx';
import JobDashboard from './screens/JobDashboard.jsx';
import PhotosScreen from './screens/job/PhotosScreen.jsx';
import NotesScreen from './screens/job/NotesScreen.jsx';
import LineItemsScreen from './screens/job/LineItemsScreen.jsx';
import PaymentsScreen from './screens/job/PaymentsScreen.jsx';
import DocumentsScreen from './screens/job/DocumentsScreen.jsx';
import MeasurementsScreen from './screens/job/MeasurementsScreen.jsx';
import TimelineScreen from './screens/job/TimelineScreen.jsx';
import MoreScreen from './screens/job/MoreScreen.jsx';
import Settings from './screens/Settings.jsx';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new-job" element={<NewJobWizard />} />
        <Route path="/jobs" element={<ExistingJobs />} />
        <Route path="/jobs/completed" element={<CompletedJobs />} />
        <Route path="/jobs/:jobId" element={<JobDashboard />} />
        <Route path="/jobs/:jobId/photos" element={<PhotosScreen />} />
        <Route path="/jobs/:jobId/notes" element={<NotesScreen />} />
        <Route path="/jobs/:jobId/measurements" element={<MeasurementsScreen />} />
        <Route path="/jobs/:jobId/estimate" element={<LineItemsScreen kind="estimate" title="Estimate" />} />
        <Route path="/jobs/:jobId/invoice" element={<LineItemsScreen kind="invoice" title="Invoice" />} />
        <Route path="/jobs/:jobId/materials" element={<LineItemsScreen kind="materials" title="Materials" simple />} />
        <Route path="/jobs/:jobId/payments" element={<PaymentsScreen />} />
        <Route path="/jobs/:jobId/documents" element={<DocumentsScreen />} />
        <Route path="/jobs/:jobId/timeline" element={<TimelineScreen />} />
        <Route path="/jobs/:jobId/more" element={<MoreScreen />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
