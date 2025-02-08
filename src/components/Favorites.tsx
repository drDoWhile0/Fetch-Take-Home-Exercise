import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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

  // Navigate to the Favorites page when the button is clicked
  const goBackToFeed = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Your Favorite Dogs</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={goBackToFeed}>
          Go Back to Feed
        </button>
      </div>
      <div>
        {favorites.length === 0 ? (
          <p>No favorites yet!</p>
        ) : (
          favorites.map((dog) => (
            <div key={dog.id}>
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
  );
};

export default Favorites;
