import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './axios';
import NewProgramModal from './NewProgramModal';
import './ProgramList.css';

function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axiosInstance.get('/programs/');
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const createProgram = async (programName) => {
    try {
      const response = await axiosInstance.post('/programs/', { name: programName });
      setPrograms([...programs, response.data]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  return (
    <div className="program-list-container">
      <div className="create-program-btn" onClick={() => setShowModal(true)}>
        Create New Program
      </div>
      <div className="program-list">
        {programs.map((program) => (
          <Link
            key={program.id}
            to={`/programs/${program.id}`}
            className="program-box-link"
          >
            <div className="program-box">{program.name}</div>
          </Link>
        ))}
      </div>
      <NewProgramModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={createProgram}
      />
    </div>
  );
}

export default ProgramList;