import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import { ProvideAuth } from './useAuth';
import { fetchProjectInfo } from './api/UserAPI';
import Landing from '../src/components/Landing';
import Board from '../src/components/Board';
import IssueView from './components/IssueView';
import SettingsView from './components/SettingsView';
import PrivateRoute from '../src/components/PrivateRoute';
import NotFound from '../src/components/NotFound';

// Styling for semantic-ui-react components.
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

function App() {
  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  useEffect(() => {
    const getProjectInfo = async () => {
        const info = await fetchProjectInfo();
        setProjectName(info.name);
        setProjectCategory(info.category);
    };
    getProjectInfo();
}, []);

  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/project' element={<PrivateRoute />}>
            <Route exact path='/project' element={<Board projectName={projectName} projectCategory={projectCategory} />} />
          </Route>
          <Route exact path='/project/issue/:id' element={<PrivateRoute />}>
            <Route exact path='/project/issue/:id' element={<IssueView projectName={projectName} projectCategory={projectCategory} />} />
          </Route>
          <Route exact path='/project/settings' element={<PrivateRoute />}>
            <Route exact path='/project/settings' element={<SettingsView projectName={projectName} projectCategory={projectCategory} onNameSave={setProjectName} onCategorySave={setProjectCategory} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;