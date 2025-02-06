import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>('');
    const navigateAuthUser = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            setError('Please fill in both fields.')
            return;
        }

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            navigateAuthUser('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return(
        <div>
            <h1>Login Here</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label></label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label></label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;