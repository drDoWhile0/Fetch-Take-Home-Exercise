import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/Feed';
import Favorites from './components/Favorites';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
