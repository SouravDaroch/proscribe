import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// --- DUMMY EDITOR COMPONENT ---
// This acts as a placeholder until we build the real Editor.tsx
const DummyEditor = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
    <div className="max-w-md text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Editor Page</h1>
      <p className="text-gray-500 mb-8">
        This is where the block-based editor will live. 
        If you see this, your **Role-Based Routing** is working perfectly!
      </p>
      <a href="/dashboard" className="text-violet-600 font-semibold hover:underline">
        ← Back to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (General) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Routes (Role-Specific) */}
        {/* Accessing /editor/new now requires a token and a role of 'admin' or 'writer' */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'writer']} />}>
          <Route path="/editor/new" element={<DummyEditor />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;