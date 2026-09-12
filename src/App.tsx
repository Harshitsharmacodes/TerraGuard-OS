import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/landing/HeroSection';
import PipelineSection from './components/landing/PipelineSection';
import ArchitectureSection from './components/landing/ArchitectureSection';
import ComparisonTable from './components/landing/ComparisonTable';
import EnterpriseCTA from './components/landing/EnterpriseCTA';
import LiveTracker from './components/tracker/LiveTracker';
import SOSPanel from './components/emergency/SOSPanel';
import ReportButton from './components/report/ReportButton';
import ReportModal from './components/report/ReportModal';
import { IncidentProvider } from './context/IncidentContext';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <PipelineSection />
      <ArchitectureSection />
      <ComparisonTable />
      <EnterpriseCTA />
      <Footer />
    </>
  );
}

export default function App() {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <IncidentProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tracker" element={<LiveTracker />} />
            <Route path="/emergency" element={<SOSPanel />} />
          </Routes>
        </main>
        <ReportButton onClick={() => setReportOpen(true)} />
        <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
      </div>
    </IncidentProvider>
  );
}
