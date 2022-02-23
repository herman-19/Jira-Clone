import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import { ProvideAuth } from './useAuth';
import Landing from '../src/components/Landing';
import Board from '../src/components/Board';
import PrivateRoute from '../src/components/PrivateRoute';
import NotFound from '../src/components/NotFound';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/project' element={<PrivateRoute />}>
            <Route exact path='/project' element={<Board />} />
          </Route>/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;