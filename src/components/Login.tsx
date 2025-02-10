import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigateAuthUser = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setIsAuthenticated(true);
      navigateAuthUser('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
    if (location.pathname === '/login') {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }

    return () => {
      document.body.classList.remove('login-page');
    };
  }, [location]);

  return (
    <>
      <Grid
        container
        component="main"
        className="login-component"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className='login-component__heading-icon-container'>
          <h1>Pawtners</h1>
          <PetsIcon className='login-component__heading-icon-container__paw-icon' sx={{ color: '#FBA919', height: '30px', width: '30px' }} />
        </div>
        <p className='login-subtext'>Find your paw-fect match today.</p>

        <Grid
          item
          xs={12}
          sm={8}
          md={4}
          component={Paper}
          elevation={6}
          sx={{ borderRadius: "8px", backgroundColor: "#F6F6F8" }}
          square
        >
          <Box
            className="login-component__login-card"
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: '"Bree Serif", serif' }}>Login</Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#C31162' },
                  },
                }}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#C31162' },
                  },
                }}
              />

              {error && <Typography color="error">{error}</Typography>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-component__login-card__button"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#FFA900",
                  color: 'black',
                  fontFamily: '"Bree Serif", serif',
                  "&:hover": {
                    backgroundColor: "#FF5733",
                    color: "white",
                  },
                }}
              >
                Let's Go!
              </Button>
            </form>
            <div className='login-component__bottom-heading-icon-container'>
              <div className='login-component__heading-icon-container-bottom'>
                <h1>Pawtners</h1>
                <PetsIcon className='login-component__heading-icon-container-bottom__paw-icon' sx={{ color: '#FBA919', height: '30px', width: '30px' }} />
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
