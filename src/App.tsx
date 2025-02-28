import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import ProfileForm from './pages/ProfileInput';
import UserProfile from './pages/UserProfile';
import DailyCalendar from './pages/DailyCalendar';

function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const navigate = useNavigate(); // Call useNavigate here
  const showForm = () => {
    setIsFormVisible(true);
    navigate('/create-profile'); // Use navigate here
  };

  return (
    <div className="flex h-screen">
      <Sidebar onCreateProfile={showForm}/>
      <div className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl">Welcome to Web Admin</h1>} />
          <Route path="/create-profile" element={<ProfileForm />} />
          <Route path="/get-user" element={<UserProfile />} />
          <Route path="/dailycalendar" element={<DailyCalendar />} />
        </Routes>
      </div>
    </div>
  );
}

// Wrap the App component with Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}