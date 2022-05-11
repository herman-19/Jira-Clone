import React, {useState, useEffect} from 'react';
import {
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';

import { useAuth } from './useAuth';
import { fetchProjectInfo } from './api/UserAPI';
import Landing from '../src/components/Landing';
import Board from '../src/components/Board';
import IssueView from './components/IssueView';
import SettingsView from './components/SettingsView';
import UserSettingsView from './components/UserSettingsView';
import PrivateRoute from '../src/components/PrivateRoute';
import NotFound from '../src/components/NotFound';

// Styling for semantic-ui-react components.
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  useEffect(() => {
    const getProjectInfo = async () => {
      try {
          const info = await fetchProjectInfo();
          setProjectName(info.name);
          setProjectCategory(info.category);
        } catch (error) {
          if (error.response.status === 401) {
            await auth.unauthorizedLogout(() => {
              navigate('/');
            });
          }
        }
    };
    if (auth.loggedIn) {
      getProjectInfo();
    }
}, [auth.loggedIn]);

  return (
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
      <Route exact path='/project/user-settings' element={<PrivateRoute />}>
        <Route exact path='/project/user-settings' element={<UserSettingsView projectName={projectName} projectCategory={projectCategory} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;