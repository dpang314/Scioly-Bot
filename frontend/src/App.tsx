import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Templates from './pages/Templates';
import Tournaments from './pages/Tournaments';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Tournaments />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/tournaments" element={<Tournaments />} />
    </Routes>
  </Router>
);

export default App;
