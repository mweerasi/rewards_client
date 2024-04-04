import React, { useState } from 'react';

function ClaimRewardModal({ show, onClose, rewards, currentPoints, onClaimReward }) {
  const [selectedReward, setSelectedReward] = useState('');

  const handleClaimReward = () => {
    const selectedRewardObj = rewards.find((reward) => reward.reward === parseInt(selectedReward));

    if (selectedRewardObj && selectedRewardObj.cost <= currentPoints) {
      onClaimReward(selectedRewardObj);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Claim Reward</h3>
        <p>Current Points: {currentPoints}</p>
        <select value={selectedReward} onChange={(e) => setSelectedReward(e.target.value)}>
          <option value="">Select a reward</option>
          {rewards.map((reward) => (
            <option key={reward.reward} value={reward.reward}>
              {reward.reward_name} ({reward.cost} points)
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button onClick={handleClaimReward}>Claim</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ClaimRewardModal;