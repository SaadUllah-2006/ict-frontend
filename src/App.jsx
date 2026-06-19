import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// Public pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import Events from './pages/student/Events';
import EventDetail from './pages/student/EventDetail';
import MyRegistrations from './pages/student/MyRegistrations';
import Profile from './pages/student/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import EventForm from './pages/admin/EventForm';
import Participants from './pages/admin/Participants';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <>
      <Toast />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute role="student"><Events /></ProtectedRoute>
        } />
        <Route path="/events/:id" element={
          <ProtectedRoute role="student"><EventDetail /></ProtectedRoute>
        } />
        <Route path="/my-registrations" element={
          <ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute role="student"><Profile /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute role="admin"><ManageEvents /></ProtectedRoute>
        } />
        <Route path="/admin/events/new" element={
          <ProtectedRoute role="admin"><EventForm /></ProtectedRoute>
        } />
        <Route path="/admin/events/:id/edit" element={
          <ProtectedRoute role="admin"><EventForm /></ProtectedRoute>
        } />
        <Route path="/admin/participants" element={
          <ProtectedRoute role="admin"><Participants /></ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute role="admin"><Reports /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
