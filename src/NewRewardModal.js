import React, { useState } from 'react';
import axiosInstance from './axios';

function NewRewardModal({ show, onClose, programId, onRewardAdded }) {
  const [rewardName, setRewardName] = useState('');
  const [maxClaim, setMaxClaim] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new reward
      const rewardResponse = await axiosInstance.post('/rewards/', {
        name: rewardName,
      });
      const rewardId = rewardResponse.data.id;

      // Link the reward to the program
      await axiosInstance.post(`/programs/${programId}/rewards/`, {
        reward: rewardId,
        max_claim: maxClaim === '' ? null : parseInt(maxClaim),
      });

      onRewardAdded(); // Notify the parent component that a reward was added
      setRewardName('');
      setMaxClaim('');
      onClose();
    } catch (error) {
      console.error('Error adding new reward:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Reward</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
            />
          </label>
          <label>
            Maximum Claimable:
            <input
              type="number"
              value={maxClaim}
              onChange={(e) => setMaxClaim(e.target.value)}
              placeholder="Leave empty for unlimited"
            />
          </label>
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default NewRewardModal;