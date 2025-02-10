import React from "react";
import { Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
      
            navigate('/login');
          } else {
            throw new Error('Logout failed');
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
    };

    return(
        <>
            <div className='navigation-container__elements'>
                <div className='login-component__heading-icon-container'>
                    <h2>Pawtners</h2>
                    <PetsIcon className='login-component__heading-icon-container__paw-icon' sx={{ color: '#FBA919', height: '30px', width: '30px' }} />
                </div>
                <div className='navigation-container__elements-links'>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                        <a>Feed</a>
                    </Link>
                    <Link to="/favorites" style={{ textDecoration: 'none', color: 'white' }}>
                        <a>Favorites</a>
                    </Link>
                </div>
            </div>
            <Button
                type="button"
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
                onClick={handleLogout}
            >
                Log Out
            </Button>
        </>
    );
}

export default Navigation;
