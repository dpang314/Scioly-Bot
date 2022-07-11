import {ThemeProvider, createTheme} from '@mui/material/styles';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import UserProvider from './providers/UserProvider';
import './reset.css';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#333333',
    },
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
