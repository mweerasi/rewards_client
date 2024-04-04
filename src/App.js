import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProgramList from './ProgramList';
import ProgramDetails from './ProgramDetails';
import MemberDetails from './MemberDetails';
import { FaHome } from 'react-icons/fa';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <Link to="/programs" className="home-link">
            <FaHome />
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/programs" />} />
          <Route path="/programs" element={<ProgramList />} />
          <Route path="/programs/:programId" element={<ProgramDetails />} />
          <Route path="/programs/:programId/members/:memberId" element={<MemberDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;