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

    useEffect(() => {
        const fetchDogIds = async () => {
            try {
                const dogIdResponse = await fetch(
                    "https://frontend-take-home-service.fetch.com/dogs/search",
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
                const dogIds: string[] = dogIdResult.resultIds

                if (dogIds.length > 0) {
                    fetchDogDetails(dogIds);
                } else {
                    setLoadingResults(false);
                }
          
            } catch (err: any) {
                setError(err.message);
                setLoadingResults(false);
            }
        }

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

            } catch(err: any) {
                setError(err.message);
            } finally {
                setLoadingResults(false);
            }
        }

        fetchDogIds();
    }, []);

    if (loadingResults) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div>
            <h1>Your Potential Pawtners</h1>
            {dogData && dogData.length > 0 ? (              
                <div>
                { dogData.map((dog) => (
                    <div key={dog.id}>
                    <img src={dog.img} alt={dog.name} />
                    <h2>{dog.name}</h2>
                    <p>Age: {dog.age}</p>
                    <p>Breed: {dog.breed}</p>
                    <p>Zip Code: {dog.zip_code}</p>
                    </div>
                )) }
                </div>
            ) : (
                <p>No dogs found</p>
        )}
        </div>
    );
};

export default Feed;