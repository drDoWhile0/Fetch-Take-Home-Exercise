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
    const [breeds, setBreeds] = useState<string[]>([]); // Store available breeds
    const [selectedBreed, setSelectedBreed] = useState<string>(''); // Store selected breed

    // Fetch breeds on component mount
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
                setBreeds(breedData); // Set available breeds in state
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBreeds();
    }, []);

    // Fetch dog data based on breed filter
    useEffect(() => {
        const fetchDogIds = async () => {
            try {
                const searchParams: any = { size: 25, sort: 'breed:asc' };

                // If a breed is selected, add it to the search query
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

                if (dogIds.length > 0) {
                    fetchDogDetails(dogIds);
                } else {
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
    }, [selectedBreed]); // Re-run when selected breed changes

    if (loadingResults) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Your Potential Pawtners</h1>

            {/* Breed Filter Dropdown */}
            <div>
                <label htmlFor="breed">Filter by Breed: </label>
                <select
                    id="breed"
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                >
                    <option value="">All Breeds</option>
                    {breeds.map((breed) => (
                        <option key={breed} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display Dog Data */}
            {dogData && dogData.length > 0 ? (
                <div>
                    {dogData.map((dog) => (
                        <div key={dog.id}>
                            <img src={dog.img} alt={dog.name} />
                            <h2>{dog.name}</h2>
                            <p>Age: {dog.age}</p>
                            <p>Breed: {dog.breed}</p>
                            <p>Zip Code: {dog.zip_code}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No dogs found</p>
            )}
        </div>
    );
};

export default Feed;
