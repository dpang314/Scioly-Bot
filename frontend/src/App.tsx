import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Templates from './pages/Templates';
import Tournaments from './pages/Tournaments';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navbar loggedIn={false} />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/tournaments" element={<Tournaments />} />
    </Routes>
  </Router>
);

export default App;
