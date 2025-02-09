import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardMedia, CardContent, Typography, CardActions, IconButton, Grid } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import Navigation from './Navigation';
import DrawerNavigation from './DrawerNavigation';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (dog: Dog) => {
    const newFavorites = [...favorites];
    const isFavorite = newFavorites.some((fav) => fav.id === dog.id);
    if (isFavorite) {
      setFavorites(newFavorites.filter((fav) => fav.id !== dog.id));
    } else {
      setFavorites([...newFavorites, dog]);
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      alert('Please add some dogs to your favorites first!');
      return;
    }

    try {
      const dogIds = favorites.map((dog) => dog.id);
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogIds),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const matchData = await response.json();
      const matchDogId = matchData.match;

      const matchDog = favorites.find((dog) => dog.id === matchDogId);
      if (matchDog) {
        setMatch(matchDog);
        clearFavorites();
      } else {
        setMatch(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="favorites-container">
      <div className="favorites-container__navigation-container">
        <Navigation />
      </div>
      <div className='favorites-container__drawer-navigation-container'>
        <DrawerNavigation />
      </div>

      <div className="favorites-container__main-content">
        <h2>Your Favorite Dogs</h2>

        <div className="favorite-and-match-btn">
          {!match && (
            <div style={{ marginBottom: '20px' }}>
              <Button 
                variant='outlined'
                onClick={clearFavorites}
                sx={{ borderColor: 'black', color: 'black' }}
              >
                Clear Favorites
              </Button>
            </div>
          )}

          {!match && (
            <div style={{ marginBottom: '20px' }}>
              <Button 
                variant='outlined'
                onClick={generateMatch}
                sx={{ borderColor: 'black', color: 'black' }}
              >
                Generate Match
              </Button>
            </div>
          )}
        </div>

        {match && (
          <div className="dog-info">
            <h3>It's a paw-fect match!</h3>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                  <CardMedia sx={{ height: 200 }} image={match.img} title={match.name} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {match.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Age: {match.age}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Breed: {match.breed}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" aria-label="remove from favorites">
                      <Favorite sx={{ color: 'red' }} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '20px' }}>
            <p>Error: {error}</p>
          </div>
        )}

        {match || favorites.length > 0 ? null : <p>No favorites yet!</p>}

        <div>
          {favorites.length === 0 && !match ? null : (
            <Grid container spacing={2}>
              {favorites.map((dog) => (
                <Grid item xs={12} sm={6} md={4} key={dog.id}>
                  <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                    <CardMedia sx={{ height: 200 }} image={dog.img} title={dog.name} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {dog.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Age: {dog.age}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Zip Code: {dog.zip_code}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Breed: {dog.breed}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(dog)}
                        aria-label="add to favorites"
                      >
                        {favorites.some((fav) => fav.id === dog.id) ? (
                          <Favorite sx={{ color: 'red' }} />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
