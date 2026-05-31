import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

// Lazy load feature components
const HomePage = lazy(() => import('@/features/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const DirectoryPage = lazy(() => import('@/features/directory/pages/DirectoryPage').then(m => ({ default: m.DirectoryPage })));
const MembershipPage = lazy(() => import('@/features/onboarding/pages/MembershipPage').then(m => ({ default: m.MembershipPage })));
const VisionPage = lazy(() => import('@/features/home/pages/VisionPage').then(m => ({ default: m.VisionPage })));
const HeritagePage = lazy(() => import('@/features/heritage/pages/HeritagePage').then(m => ({ default: m.HeritagePage })));
const KnowledgePage = lazy(() => import('@/features/heritage/pages/KnowledgePage').then(m => ({ default: m.KnowledgePage })));
const LegendsPage = lazy(() => import('@/features/heritage/pages/LegendsPage').then(m => ({ default: m.LegendsPage })));
const NetworkHub = lazy(() => import('@/features/network/pages/NetworkHub').then(m => ({ default: m.NetworkHub })));
const EmpowermentPage = lazy(() => import('@/features/empowerment/pages/EmpowermentPage').then(m => ({ default: m.EmpowermentPage })));
const Admin = lazy(() => import('@/features/admin/components/Admin').then(m => ({ default: m.Admin })));
const FounderPage = lazy(() => import('@/features/home/pages/FounderPage').then(m => ({ default: m.FounderPage })));
const DonorsPage = lazy(() => import('@/features/community/pages/DonorsPage').then(m => ({ default: m.DonorsPage })));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin" /></div>}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="vision" element={<VisionPage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="heritage" element={<HeritagePage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="legends" element={<LegendsPage />} />
          <Route path="network" element={<NetworkHub />} />
          <Route path="empowerment" element={<EmpowermentPage />} />
          <Route path="founder" element={<FounderPage />} />
          <Route path="donors" element={<DonorsPage />} />
          <Route path="events" element={<HomePage />} /> {/* Map to home sections for now */}
          <Route path="gallery" element={<HomePage />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}

export default App;
