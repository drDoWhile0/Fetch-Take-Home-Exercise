import React, { useState, useEffect } from 'react';

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
    const [match, setMatch] = useState<Dog | null>(null);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedResponse = await fetch(
                    "https://frontend-take-home-service.fetch.com/dogs/breeds",
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

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
                    "https://frontend-take-home-service.fetch.com/dogs/search?" +
                        new URLSearchParams(searchParams).toString(),
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
                const dogDetailsResponse = await fetch(
                    "https://frontend-take-home-service.fetch.com/dogs",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dogIds),
                    }
                );

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

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        setPage(0);
    };

    const toggleFavorite = (dog: Dog) => {
        setFavorites((prev) =>
            prev.find((fav) => fav.id === dog.id)
                ? prev.filter((fav) => fav.id !== dog.id)
                : [...prev, dog]
        );
    };

    const findMatch = async () => {
        if (favorites.length === 0) return;

        const favoriteIds = favorites.map((dog) => dog.id);
        try {
            const matchResponse = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favoriteIds),
            });

            if (!matchResponse.ok) {
                throw new Error(`HTTP error! Status: ${matchResponse.status}`);
            }

            const matchResult = await matchResponse.json();
            const matchedDogId = matchResult.match;
            setMatch(dogData?.find((dog) => dog.id === matchedDogId) || null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loadingResults) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Your Potential Pawtners</h1>

            {/* Displaying favorite counter/button */}
            <div>
                <button>
                    <strong>Favorites: {favorites.length}</strong>
                </button>
            </div>

            {/* Displaying the favorites list */}
            {favorites.length > 0 && (
                <div>
                    <h2>Your Favorite Dogs</h2>
                    <div>
                        {favorites.map((dog) => (
                            <div key={dog.id}>
                                <img src={dog.img} alt={dog.name} />
                                <h3>{dog.name}</h3>
                                <p>Age: {dog.age}</p>
                                <p>Breed: {dog.breed}</p>
                                <button onClick={() => toggleFavorite(dog)}>
                                    Unfavorite
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing breed filter and sorting UI */}
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

            {/* Displaying the dog list */}
            {dogData && dogData.length > 0 ? (
                <div>
                    {dogData.map((dog) => (
                        <div key={dog.id}>
                            <img src={dog.img} alt={dog.name} />
                            <h2>{dog.name}</h2>
                            <p>Age: {dog.age}</p>
                            <p>Breed: {dog.breed}</p>
                            <button onClick={() => toggleFavorite(dog)}>
                                {favorites.some((fav) => fav.id === dog.id)
                                    ? 'Unfavorite'
                                    : 'Favorite'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No dogs found</p>
            )}

            {/* Match button */}
            <button onClick={findMatch} disabled={favorites.length === 0}>
                Find a Match
            </button>
            {match && <p>Matched with: {match.name}</p>}
        </div>
    );
};

export default Feed;
