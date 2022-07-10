import {ThemeProvider, createTheme} from '@mui/material/styles';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import UserProvider from './providers/UserProvider';
import './reset.css';
import './common.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <UserProvider>
        <Navbar />
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
