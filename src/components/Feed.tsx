import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, IconButton, Typography, CardActions } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import Navigation from './Navigation';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const Feed = () => {
  const [dogData, setDogData] = useState<Dog[] | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [paginationLinks, setPaginationLinks] = useState<{ next: string | null; prev: string | null }>({
    next: null,
    prev: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!breedResponse.ok) {
          throw new Error(`HTTP error! Status: ${breedResponse.status}`);
        }

        const breedData = await breedResponse.json();
        setBreeds(breedData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogIds = async () => {
      setLoadingResults(true);
      try {
        const searchParams: any = {
          size: 25,
          sort: `breed:${sortOrder}`,
          from: page * 25,
        };

        if (selectedBreed) {
          searchParams.breeds = [selectedBreed];
        }

        const dogIdResponse = await fetch(
          'https://frontend-take-home-service.fetch.com/dogs/search?' + new URLSearchParams(searchParams).toString(),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!dogIdResponse.ok) {
          throw new Error(`HTTP error! Status: ${dogIdResponse.status}`);
        }

        const dogIdResult = await dogIdResponse.json();
        const dogIds: string[] = dogIdResult.resultIds;
        setTotalResults(dogIdResult.total);

        setPaginationLinks({
          next: dogIdResult.next || null,
          prev: dogIdResult.prev || null,
        });

        if (dogIds.length > 0) {
          fetchDogDetails(dogIds);
        } else {
          setDogData([]);
          setLoadingResults(false);
        }
      } catch (err: any) {
        setError(err.message);
        setLoadingResults(false);
      }
    };

    const fetchDogDetails = async (dogIds: string[]) => {
      try {
        const dogDetailsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dogIds),
        });

        if (!dogDetailsResponse.ok) {
          throw new Error(`HTTP error! Status: ${dogDetailsResponse.status}`);
        }

        const dogDetails: Dog[] = await dogDetailsResponse.json();
        setDogData(dogDetails);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchDogIds();
  }, [selectedBreed, sortOrder, page]);

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
      const updatedFavorites = newFavorites.filter((fav) => fav.id !== dog.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...newFavorites, dog];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  const goToFavorites = () => {
    navigate('/favorites');
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(0);
  };

  const goToNextPage = () => {
    if (paginationLinks.next) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationLinks.prev) {
      setPage((prev) => prev - 1);
    }
  };

  if (loadingResults) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='main-feed-container'>
      <div className='main-feed-container__navigation-container'>
        <Navigation />
      </div>
      <div className='main-feed-container__main-feed-display'>
        <h1>Your Potential Pawtners</h1>

        <div className='main-feed-container__main-feed-display__filter-sort-controls'>
          <div>
            <label htmlFor="breed">Filter by Breed: </label>
            <select
              id="breed"
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Sort by Breed: </label>
            <button onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Ascending ▲' : 'Descending ▼'}
            </button>
          </div>

          <div>
            <button onClick={goToFavorites}>
              Favorites ({favorites.length})
            </button>
            <button onClick={clearFavorites} style={{ marginLeft: '10px' }}>
              Clear Favorites
            </button>
          </div>
        </div>

        {dogData && dogData.length > 0 ? (
          <div className="dog-grid">
            {dogData.map((dog) => (
              <Card key={dog.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
                <CardMedia
                  sx={{ height: 200 }}
                  image={dog.img}
                  title={dog.name}
                />
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
            ))}
          </div>
        ) : (
          <p>No dogs found</p>
        )}

        <div>
          <button onClick={goToPrevPage} disabled={!paginationLinks.prev}>
            Previous
          </button>
          <button onClick={goToNextPage} disabled={!paginationLinks.next}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
