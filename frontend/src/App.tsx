import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Templates from './pages/Templates';
import Tournaments from './pages/Tournaments';

const App = () => (
  <Router>
    <Route path="/" element={<Tournaments />}>
      <Route path="templates" element={Templates} />
      <Route path="tournaments" element={Tournaments} />
    </Route>
  </Router>
);

export default App;
