import React from "react";
import { Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navigation = () => {
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
                Log Out
            </Button>
        </>
    );
}

export default Navigation;
