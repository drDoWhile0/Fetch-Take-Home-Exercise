import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Feed from './components/Feed';
import Favorites from './components/Favorites';
import Login from './components/Login';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    axios.get('/favorites', { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <Feed /> : <Navigate to="/login" replace />} />
        <Route path="/favorites" element={isAuthenticated ? <Favorites /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
