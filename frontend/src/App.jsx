import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Layout from './components/Layout.jsx';
import Explorer from './pages/Explorer.jsx';
import Judges from './pages/Judges.jsx';
import CaseAnalysis from './pages/CaseAnalysis.jsx';
import BiasExplorer from './pages/BiasExplorer.jsx';
import SimilaritySearch from './pages/SimilaritySearch.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<Landing />} />

        {/* App pages — with sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/judges" element={<Judges />} />
          <Route path="/case-analysis" element={<CaseAnalysis />} />
          <Route path="/bias-explorer" element={<BiasExplorer />} />
          <Route path="/similarity-search" element={<SimilaritySearch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
