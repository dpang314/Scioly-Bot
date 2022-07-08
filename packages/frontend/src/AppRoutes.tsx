import {useContext} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Templates from './pages/Templates';
import Tournaments from './pages/Tournaments';
import Unauthorized from './pages/Unauthorized';
import UserContext from './providers/UserContext';

const AppRoutes = () => {
  const user = useContext(UserContext);
  if (user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/templates/:templateId" />
          <Route path="/tournaments/:tournamentId" />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
