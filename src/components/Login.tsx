import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>('');
  const navigateAuthUser = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      navigateAuthUser('/');
    } catch (err: any) {
      setError(err.message);
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
    }

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
            <h1>Pawtners</h1>
            <p>Find your paw-fect match today.</p>

            <Grid
                item
                xs={12}
                sm={8}
                md={4}
                component={Paper}
                elevation={6}
                sx={{
                    borderRadius: "8px",
                }}
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
                    <Typography variant="h5">Login</Typography>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        {/* Name input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Email input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Error message */}
                        {error && <Typography color="error">{error}</Typography>}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="login-component__login-card__button"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                </Box>
            </Grid>
        </Grid>
    </>
  );
};

export default Login;
