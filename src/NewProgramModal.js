import React, { useState } from 'react';
import axiosInstance from './axios';

function NewProgramModal({ show, onClose, onSubmit }) {
  const [programName, setProgramName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(programName);
    setProgramName('');
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Program</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
          </label>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default NewProgramModal;