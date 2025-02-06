import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Feed from "./components/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={ <Feed /> }></Route>
        <Route path='/login' exact element= { <Login /> }></Route>
      </Routes>
    </Router>
  );
}

export default App;
