import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axiosInstance from './axios';
import ClaimRewardModal from './ClaimRewardModal';
import './MemberDetails.css';

function MemberDetails() {
  const { programId, memberId } = useParams();
  const location = useLocation();
  const { programName, memberName, currentPoints } = location.state || {};
  const [fetchedProgramName, setFetchedProgramName] = useState('');
  const [fetchedMemberName, setFetchedMemberName] = useState('');
  const [fetchedCurrentPoints, setFetchedCurrentPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!programName || !memberName || currentPoints === undefined) {
      fetchProgramName();
      fetchMemberData();
    }
    fetchRewards();
    fetchHistory();
  }, [programId, memberId, programName, memberName, currentPoints]);

  const fetchProgramName = async () => {
    try {
      const response = await axiosInstance.get(`/programs/${programId}/`);
      setFetchedProgramName(response.data.name);
    } catch (error) {
      console.error('Error fetching program name:', error);
    }
  };

  const fetchMemberData = async () => {
    try {
      const response = await axiosInstance.get(`/programs/${programId}/members/${memberId}/`);
      setFetchedMemberName(response.data.member_name);
      setFetchedCurrentPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axiosInstance.get(`/programs/${programId}/rewards/`);
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get(`/programs/${programId}/members/${memberId}/history/`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleClaimReward = async (selectedReward) => {
    try {
      await axiosInstance.post(`/programs/${programId}/members/${memberId}/history/`, {
        member: memberId,
        reward: selectedReward.reward,
        value: selectedReward.cost,
      });
      fetchHistory();
      fetchMemberData();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).replace(', ', ' ');
  };

  const displayProgramName = programName || fetchedProgramName;
  const displayMemberName = memberName || fetchedMemberName;
  const displayCurrentPoints = currentPoints !== undefined ? currentPoints : fetchedCurrentPoints;

  return (
    <div className="member-details-container">
      <h2>
        <Link to={`/programs/${programId}`}>{displayProgramName}</Link> / {displayMemberName}
      </h2>
      <div className="member-points">
        <span>Current Points: {displayCurrentPoints}</span>
        <button onClick={() => setShowModal(true)}>Claim Reward</button>
      </div>
      <ClaimRewardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        rewards={rewards}
        currentPoints={displayCurrentPoints}
        onClaimReward={handleClaimReward}
      />
      <h3>Member History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Reward</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{formatDate(entry.created_on).split(' ')[0]}</td>
              <td>{formatDate(entry.created_on).split(' ')[1]}</td>
              <td>{entry.reward_name}</td>
              <td>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberDetails;