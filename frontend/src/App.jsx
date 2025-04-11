import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from "./components/Footer";

import PublicRoutes from './routes/PublicRoutes';
import AuthRoutes from './routes/AuthRoutes';
import ListingsRoutes from "./routes/ListingsRoutes";
import ChatRoutes from './routes/ChatRoutes';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/listings/*" element={<ListingsRoutes />} />
        <Route path="/chat/*" element={<ChatRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;

