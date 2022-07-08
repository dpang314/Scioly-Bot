import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import UserProvider from './providers/UserProvider';

const App = () => {
  return (
    <UserProvider>
      <Navbar />
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
