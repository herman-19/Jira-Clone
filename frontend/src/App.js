import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Landing from '../src/components/Landing';
import Board from '../src/components/Board';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/project' element={<Board />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;