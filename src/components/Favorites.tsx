import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navigation from './Navigation';

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

  const goBackToFeed = () => {
    navigate('/');
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

      <div className="favorites-container__main-content">
        <h2>Your Favorite Dogs</h2>

        <div className='favorite-and-match-btn'>
          {!match && (
            <div style={{ marginBottom: '20px' }}>
              <button onClick={clearFavorites}>Clear Favorites</button>
            </div>
          )}

          {!match && (
            <div style={{ marginBottom: '20px' }}>
              <button onClick={generateMatch}>Generate Match</button>
            </div>
          )}
        </div>

        {match && (
          <div className="dog-info">
            <h3>It's a paw-fect match!</h3>
            <img src={match.img} alt={match.name} />
            <h4>{match.name}</h4>
            <p>Age: {match.age}</p>
            <p>Breed: {match.breed}</p>
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
            favorites.map((dog) => (
              <div key={dog.id} className="dog-info">
                <img src={dog.img} alt={dog.name} />
                <h3>{dog.name}</h3>
                <p>Age: {dog.age}</p>
                <p>Breed: {dog.breed}</p>
                <button onClick={() => toggleFavorite(dog)}>Unfavorite</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
