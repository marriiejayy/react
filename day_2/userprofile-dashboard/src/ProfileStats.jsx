// ProfileStats.jsx
import './ProfileStats.css';

function ProfileStats({ projects, followers, following }) {
  return (
    <div className="profile-stats">
      <div className="stat">
        <strong>{projects}</strong>
        <span>Projects</span>
      </div>
      <div className="stat">
        <strong>{followers}</strong>
        <span>Followers</span>
      </div>
      <div className="stat">
        <strong>{following}</strong>
        <span>Following</span>
      </div>
    </div>
  );
}

export default ProfileStats;