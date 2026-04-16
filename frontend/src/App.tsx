import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Simple placeholder for now
const Dashboard = () => <div className="p-10 text-2xl">Welcome to your Dashboard! (Private)</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* We will add the Editor route here later */}
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;