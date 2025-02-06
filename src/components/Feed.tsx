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
    const [loadingResults, setloadingResults] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDogData = async () => {
            try {

            } catch {

            }
        }
    });

    return(
        <h1>Welcome!</h1>
    );
};

export default Feed;