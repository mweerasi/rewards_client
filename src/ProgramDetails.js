import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from './axios';
import NewMemberModal from './NewMemberModal';
import NewRewardModal from './NewRewardModal';
import './ProgramDetails.css';

function ProgramDetails() {
  const { programId } = useParams();
  const [programName, setProgramName] = useState('');
  const [members, setMembers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  useEffect(() => {
    fetchProgramData();
  }, [programId]);

  const fetchProgramData = async () => {
    try {
      const programResponse = await axiosInstance.get(`/programs/${programId}/`);
      setProgramName(programResponse.data.name);

      const membersResponse = await axiosInstance.get(`/programs/${programId}/members/`);
      setMembers(membersResponse.data);

      const rewardsResponse = await axiosInstance.get(`/programs/${programId}/rewards/`);
      setRewards(rewardsResponse.data);
    } catch (error) {
      console.error('Error fetching program data:', error);
    }
  };

  const handleMemberAdded = () => {
    fetchProgramData();
  };

  const handleRewardAdded = () => {
    fetchProgramData();
  };

  const handleMemberRemoved = async (memberId) => {
    try {
      await axiosInstance.delete(`/members/${memberId}/`);
      fetchProgramData();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleRewardRemoved = async (rewardId) => {
    try {
      await axiosInstance.delete(`/rewards/${rewardId}/`);
      fetchProgramData();
    } catch (error) {
      console.error('Error removing reward:', error);
    }
  };

  const handlePointChange = async (member, newPoints) => {
    try {
      await axiosInstance.put(`/programs/${programId}/members/${member.id}/`, {
        member: member.member,
        points: newPoints
      });
      fetchProgramData();
    } catch (error) {
      console.error('Error changing point total:', error);
    }
  };

  return (
    <div className="program-details-container">
      <h2>Members</h2>
      <div className="table-actions">
        <button onClick={() => setShowMemberModal(true)}>Add New Member</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Point Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.member}>
              <td>
                <Link
                  to={{
                    pathname: `/programs/${programId}/members/${member.id}`,
                    state: {
                      programName,
                      memberName: member.member_name,
                      currentPoints: member.points,
                    },
                  }}
                >
                  {member.member_name}
                </Link>
              </td>
              <td>{member.points}</td>
              <td>
                <button onClick={() => handlePointChange(member, prompt('Enter new point total:'))}>
                  Change Point Total
                </button>
                <button onClick={() => handleMemberRemoved(member.member)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Rewards</h2>
      <div className="table-actions">
        <button onClick={() => setShowRewardModal(true)}>Add New Reward</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Reward Name</th>
            <th>Cost</th>
            <th>Maximum</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.reward}>
              <td>{reward.reward_name}</td>
              <td>{reward.cost}</td>
              <td>{reward.max_claim || 'Unlimited'}</td>
              <td>
                <button onClick={() => handleRewardRemoved(reward.reward)}>
                  Remove Reward
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <NewMemberModal
        show={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        programId={programId}
        onMemberAdded={handleMemberAdded}
      />
      <NewRewardModal
        show={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        programId={programId}
        onRewardAdded={handleRewardAdded}
      />
    </div>
  );
}

export default ProgramDetails;