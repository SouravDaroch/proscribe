import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePost from './pages/CreatePost';
import './App.css';
import PostView from './pages/PostView';
import EditPost from './pages/EditPost';
import PublicFeed from './pages/PublicFeed';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<PublicFeed />} />

        {/* Protected Routes (General) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Routes (Role-Specific) */}
        {/* Accessing /editor/new now requires a token and a role of 'admin' or 'writer' */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'writer']} />}>
          <Route path="/editor/new" element={<CreatePost />} />
        </Route>

        <Route path="/post/:id" element={<PostView />} />
        <Route path="/edit-post/:id" element={<EditPost />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;