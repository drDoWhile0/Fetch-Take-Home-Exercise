import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Feed from './components/Feed';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Feed /> }></Route>
        <Route path='/login' element= { <Login /> }></Route>
      </Routes>
    </Router>
  );
}

export default App;
