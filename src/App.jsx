import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import WeeklyView from './pages/WeeklyView';
import NotificationsView from './pages/NotificationsView';
import AdminUsers from './pages/AdminUsers';
import AdminTimetable from './pages/AdminTimetable';
import SettingsView from './pages/SettingsView';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to default if no access
  }

  return children;
};

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading App...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 w-full transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/timetable" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminTimetable />
            </PrivateRoute>
          } />

          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminUsers />
            </PrivateRoute>
          } />

          <Route path="/admin/settings" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <SettingsView />
            </PrivateRoute>
          } />

          <Route path="/admin/notifications" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <NotificationsView />
            </PrivateRoute>
          } />

          <Route path="/teacher" element={
            <PrivateRoute allowedRoles={['Teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } />

          <Route path="/teacher/weekly" element={
            <PrivateRoute allowedRoles={['Teacher']}>
              <WeeklyView />
            </PrivateRoute>
          } />

          <Route path="/teacher/notifications" element={
            <PrivateRoute allowedRoles={['Teacher']}>
              <NotificationsView />
            </PrivateRoute>
          } />
          
          <Route path="/student" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          <Route path="/student/weekly" element={
            <PrivateRoute allowedRoles={['Student']}>
              <WeeklyView />
            </PrivateRoute>
          } />

          <Route path="/student/notifications" element={
            <PrivateRoute allowedRoles={['Student']}>
              <NotificationsView />
            </PrivateRoute>
          } />

          {/* Root Redirect based on Role */}
          <Route path="/" element={
            !user ? <Navigate to="/login" /> :
            user.role === 'Admin' ? <Navigate to="/admin" /> :
            user.role === 'Teacher' ? <Navigate to="/teacher" /> :
            <Navigate to="/student" />
          } />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
