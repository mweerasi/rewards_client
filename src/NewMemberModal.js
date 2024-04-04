import React, { useState } from 'react';
import axiosInstance from './axios';

function NewMemberModal({ show, onClose, programId, onMemberAdded }) {
  const [memberName, setMemberName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new member
      const memberResponse = await axiosInstance.post('/members/', { name: memberName });
      const memberId = memberResponse.data.id;

      // Link the member to the program
      await axiosInstance.post(`/programs/${programId}/members/`, { member: memberId });

      onMemberAdded(); // Notify the parent component that a member was added
      setMemberName('');
      onClose();
    } catch (error) {
      console.error('Error adding new member:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Member</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
          </label>
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default NewMemberModal;