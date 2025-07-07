import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
